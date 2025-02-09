# main.py

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
        "run_cmd": "python3",
        "file_ext": ".py",
        "gpu_flags": "--runtime nvidia"
    },
    "cpp": {
        "image": "nvcr.io/nvidia/l4t-base:r32.6.1",
        "run_cmd": "apt-get update && apt-get install -y build-essential && g++ -o /tmp/output main.cpp && /tmp/output",
        "file_ext": ".cpp",
        "gpu_flags": "--runtime nvidia"
    },
    "cuda": {
        "image": "nvcr.io/nvidia/l4t-ml:r32.6.1-py3",
        "run_cmd": "cd /workspace && nvcc -ccbin aarch64-linux-gnu-g++ main.cu -o /tmp/output && /tmp/output",
        "file_ext": ".cu",
        "gpu_flags": "--runtime nvidia"
    },
    "c": {
        "image": "nvcr.io/nvidia/l4t-base:r32.6.1",
        "run_cmd": "apt-get update && apt-get install -y build-essential && gcc -o /tmp/output main.c && /tmp/output",
        "file_ext": ".c",
        "gpu_flags": "--runtime nvidia"
    }
}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    project_dir = None
    
    try:
        logger.info("WebSocket connection accepted")
        metadata = await websocket.receive_text()
        logger.info(f"Received metadata: {metadata}")
        
        filename, language = metadata.split(",")
        logger.info(f"Processing {language} file: {filename}")
        
        if language not in DOCKER_CONFIGS:
            await websocket.send_text(json.dumps({
                "type": "error",
                "data": f"Unsupported language: {language}"
            }))
            return

        config = DOCKER_CONFIGS[language]
        project_id = str(uuid.uuid4())[:8]
        project_dir = f"/tmp/project_{project_id}"
        os.makedirs(project_dir, exist_ok=True)
        logger.info(f"Created project directory: {project_dir}")
        
        file_path = os.path.join(project_dir, f"main{config['file_ext']}")
        with open(file_path, "w") as file:
            while True:
                data = await websocket.receive_text()
                if data == "EOF":
                    break
                file.write(data + "\n")
        
        logger.info(f"Wrote code to {file_path}")

        # Docker command for execution
        docker_cmd = f"""
        docker run --rm {config['gpu_flags']} \
        -v {project_dir}:/workspace \
        --memory=2g \
        --cpus=2 \
        {config['image']} \
        bash -c "cd /workspace && {config['run_cmd']}"
        """
        logger.info(f"Docker command: {docker_cmd}")

        process = await asyncio.create_subprocess_shell(
            docker_cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )

        # Stream output and errors
        async def stream_output(stream, type_):
            while True:
                line = await stream.readline()
                if not line:
                    break
                line_text = line.decode().strip()
                logger.info(f"Got {type_}: {line_text}")
                await websocket.send_text(json.dumps({
                    "type": type_,
                    "data": line_text
                }))

        await asyncio.gather(
            stream_output(process.stdout, "output"),
            stream_output(process.stderr, "error")
        )

        await process.wait()
        logger.info(f"Process completed with exit code: {process.returncode}")
        
        await websocket.send_text(json.dumps({
            "status": "complete",
            "exit_code": process.returncode
        }))

    except Exception as e:
        logger.error(f"Error during execution: {str(e)}")
        try:
            await websocket.send_text(json.dumps({
                "type": "error",
                "data": str(e)
            }))
        except:
            pass
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
