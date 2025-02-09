# test_client.py

import asyncio
import websockets
import json

TEST_CASES = {
    "python": """
import numpy as np
print("Testing NumPy:", np.__version__)
a = np.array([1, 2, 3])
print("NumPy array:", a)

try:
    import torch
    print("PyTorch available:", torch.__version__)
    print("CUDA available:", torch.cuda.is_available())
    if torch.cuda.is_available():
        print("CUDA device:", torch.cuda.get_device_name(0))
except ImportError:
    print("PyTorch not installed")
""",

    "cuda": """
#include <stdio.h>
#include <cuda_runtime.h>

__global__ void addKernel(int *a, int *b, int *c) {
    int i = threadIdx.x;
    c[i] = a[i] + b[i];
}

int main() {
    const int size = 5;
    int a[size] = {1, 2, 3, 4, 5};
    int b[size] = {10, 20, 30, 40, 50};
    int c[size] = {0};

    // Device memory
    int *d_a, *d_b, *d_c;
    
    // Allocate device memory
    cudaMalloc(&d_a, size * sizeof(int));
    cudaMalloc(&d_b, size * sizeof(int));
    cudaMalloc(&d_c, size * sizeof(int));
    
    // Copy inputs to device
    cudaMemcpy(d_a, a, size * sizeof(int), cudaMemcpyHostToDevice);
    cudaMemcpy(d_b, b, size * sizeof(int), cudaMemcpyHostToDevice);
    
    // Launch kernel
    addKernel<<<1, size>>>(d_a, d_b, d_c);
    
    // Copy result back to host
    cudaMemcpy(c, d_c, size * sizeof(int), cudaMemcpyDeviceToHost);
    
    // Print result
    printf("Result: ");
    for(int i = 0; i < size; i++) {
        printf("%d ", c[i]);
    }
    printf("\\n");
    
    // Cleanup
    cudaFree(d_a);
    cudaFree(d_b);
    cudaFree(d_c);
    
    return 0;
}
""",

    "cpp": """
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> numbers = {5, 2, 8, 1, 9};
    std::sort(numbers.begin(), numbers.end());
    
    std::cout << "Sorted numbers: ";
    for (int num : numbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    return 0;
}
""",

    "c": """
#include <stdio.h>
#include <stdlib.h>

int main() {
    int *arr = (int*)malloc(5 * sizeof(int));
    for(int i = 0; i < 5; i++) {
        arr[i] = i * 2;
    }
    
    printf("Array values: ");
    for(int i = 0; i < 5; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");
    
    free(arr);
    return 0;
}
"""
}

async def test_execution(filename, language, code):
    uri = "ws://172.20.10.2/ws"
    print(f"\nTesting {language} execution...")
    print(f"Code to execute:\n{code}")
    
    try:
        async with websockets.connect(uri) as websocket:
            # Send metadata
            await websocket.send(f"{filename},{language}")
            print(f"Sent metadata: {filename}, {language}")
            
            # Send code
            await websocket.send(code)
            await websocket.send("EOF")
            print("Sent code")
            
            # Receive results
            while True:
                try:
                    response = await websocket.recv()
                    data = json.loads(response)
                    if data.get("type") == "output":
                        print(f"Output: {data['data']}")
                    elif data.get("type") == "error":
                        print(f"Error: {data['data']}")
                    elif data.get("status") == "complete":
                        print(f"\nExecution completed with exit code: {data.get('exit_code')}")
                        break
                except websockets.ConnectionClosed:
                    print("Connection closed")
                    break
    except Exception as e:
        print(f"Error during execution: {e}")

async def run_tests():
    for lang, code in TEST_CASES.items():
        await test_execution(f"test.{lang}", lang, code)

if __name__ == "__main__":
    asyncio.run(run_tests())
