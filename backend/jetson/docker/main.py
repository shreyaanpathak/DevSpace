import asyncio
import os
import uuid
from fastapi import FastAPI, WebSocket
from fastapi.websockets import WebSocketDisconnect
import subprocess
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

DOCKER_CONFIGS = {
    "python": {
        "image": "nvcr.io/nvidia/l4t-ml:r32.6.1-py3",
        "run_cmd": "python3 main.py",
        "file_ext": ".py",
        "gpu_flags": "--runtime nvidia"
    },
    "cpp": {
        "image": "nvcr.io/nvidia/l4t-ml:r32.6.1-py3",  # Use ML image that includes g++
        "run_cmd": "g++ -o /tmp/output Main.cpp && /tmp/output",
        "file_ext": ".cpp",
        "gpu_flags": "--runtime nvidia"
    },
    "cuda": {
        "image": "nvcr.io/nvidia/l4t-ml:r32.6.1-py3",
        "run_cmd": "nvcc -o /tmp/output Main.cu && /tmp/output",
        "file_ext": ".cu",
        "gpu_flags": "--runtime nvidia"
    },
    "c": {
        "image": "nvcr.io/nvidia/l4t-ml:r32.6.1-py3", 
        "run_cmd": "gcc -o /tmp/output Main.c && /tmp/output",
        "file_ext": ".c",
        "gpu_flags": "--runtime nvidia"
    },
    "c_with_install": {  
        "image": "nvcr.io/nvidia/l4t-base:r32.6.1",
        "run_cmd": "apt update && apt install -y gcc && gcc -o /tmp/output Main.c && /tmp/output",
        "file_ext": ".c",
        "gpu_flags": "--runtime nvidia"
    },
    "cpp_with_install": {  
        "image": "nvcr.io/nvidia/l4t-base:r32.6.1",
        "run_cmd": "apt update && apt install -y g++ && g++ -o /tmp/output Main.cpp && /tmp/output",
        "file_ext": ".cpp",
        "gpu_flags": "--runtime nvidia"
    }
}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    project_dir = None

    try:
        logger.info("WebSocket connection accepted")
        
        while True:
            message = await websocket.receive_text()
            logger.info(f"Received message: {message}")
            
            try:
                data = json.loads(message)
                
                if data.get("type") == "command":
                    # Handle shell command
                    command = data.get("command")
                    working_dir = data.get("workingDir", "/workspace")
                    
                    docker_cmd = f"""
                    docker run --rm {DOCKER_CONFIGS['python']['gpu_flags']} \
                    -v {working_dir}:/workspace \
                    --workdir=/workspace \
                    --memory=2g \
                    --cpus=2 \
                    {DOCKER_CONFIGS['python']['image']} \
                    bash -c "{command}"
                    """
                    
                    process = await asyncio.create_subprocess_shell(
                        docker_cmd,
                        stdout=asyncio.subprocess.PIPE,
                        stderr=asyncio.subprocess.PIPE
                    )
                    
                    stdout, stderr = await process.communicate()
                    
                    if stdout:
                        await websocket.send_text(json.dumps({
                            "type": "output",
                            "data": stdout.decode()
                        }))
                    if stderr:
                        await websocket.send_text(json.dumps({
                            "type": "error",
                            "data": stderr.decode()
                        }))
                    
                    await websocket.send_text(json.dumps({
                        "type": "status",
                        "status": "complete",
                        "exit_code": process.returncode
                    }))
                    
                else:
                    # Handle file execution
                    filename = data.get("filename")
                    language = data.get("language", "python")
                    content = data.get("content")
                    working_dir = data.get("workingDir", "/workspace")
                    
                    if not filename or content is None:
                        raise ValueError("Missing required file details")

                    if language not in DOCKER_CONFIGS:
                        raise ValueError(f"Unsupported language: {language}")

                    # Prepare execution environment
                    config = DOCKER_CONFIGS[language]
                    project_id = str(uuid.uuid4())[:8]
                    project_dir = f"/tmp/project_{project_id}"
                    os.makedirs(project_dir, exist_ok=True)

                    file_path = os.path.join(project_dir, f"Main{config['file_ext']}")
                    with open(file_path, "w") as file:
                        file.write(content)

                    logger.info(f"Saved file at {file_path}")

                    # Construct Docker command with working directory support
                    docker_cmd = f"""
                    docker run --rm {config['gpu_flags']} \
                    -v {project_dir}:/workspace \
                    -v {working_dir}:/workdir \
                    --workdir=/workdir \
                    --memory=2g \
                    --cpus=2 \
                    {config['image']} \
                    bash -c "cd /workspace && {config['run_cmd']}"
                    """
                    logger.info(f"Docker command: {docker_cmd}")

                    # Run process inside Docker
                    process = await asyncio.create_subprocess_shell(
                        docker_cmd,
                        stdout=asyncio.subprocess.PIPE,
                        stderr=asyncio.subprocess.PIPE
                    )

                    # Stream output to WebSocket
                    async def stream_output(stream, type_):
                        try:
                            while True:
                                line = await stream.readline()
                                if not line:
                                    break
                                try:
                                    line_text = line.decode().strip()
                                    if line_text:
                                        logger.info(f"Got {type_}: {line_text}")
                                        await websocket.send_text(json.dumps({
                                            "type": type_,
                                            "data": line_text
                                        }))
                                except UnicodeDecodeError:
                                    continue
                        except Exception as e:
                            logger.error(f"Error in stream_output: {str(e)}")

                    await asyncio.gather(
                        stream_output(process.stdout, "output"),
                        stream_output(process.stderr, "error")
                    )

                    await process.wait()
                    logger.info(f"Execution completed with exit code: {process.returncode}")

                    await websocket.send_text(json.dumps({
                        "status": "complete",
                        "exit_code": process.returncode
                    }))

            except json.JSONDecodeError as e:
                logger.error(f"JSON decode error: {str(e)}")
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "data": f"Invalid message format: {str(e)}"
                }))
            except Exception as e:
                logger.error(f"Error during execution: {str(e)}")
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "data": str(e)
                }))

    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
    finally:
        if project_dir and os.path.exists(project_dir):
            try:
                subprocess.run(["rm", "-rf", project_dir])
                logger.info(f"Cleaned up {project_dir}")
            except Exception as e:
                logger.error(f"Cleanup error: {e}")
                

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

