#include <stdio.h>

int main() {
    printf("Starting CUDA test...\n");
    fflush(stdout);  // Force print
    
    int deviceCount;
    cudaError_t err = cudaGetDeviceCount(&deviceCount);
    
    if (err != cudaSuccess) {
        printf("Error getting device count: %s\n", cudaGetErrorString(err));
        return -1;
    }
    
    printf("Found %d CUDA devices\n", deviceCount);
    return 0;
}
