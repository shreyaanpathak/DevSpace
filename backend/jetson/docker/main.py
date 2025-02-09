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
        
        # Receive data
        file_data = await websocket.receive_text()
        logger.info(f"Received raw data: {file_data}")
        
        try:
            # Try parsing as JSON (for React app)
            file_info = json.loads(file_data)
            filename = file_info.get("filename")
            language = file_info.get("language")
            content = file_info.get("content")
            
            logger.info(f"Successfully parsed JSON data:")
            logger.info(f"Filename: {filename}")
            logger.info(f"Language: {language}")
            logger.info(f"Content length: {len(content) if content else 0}")
            
        except json.JSONDecodeError:
            logger.info("Failed to parse as JSON, trying test client format")
            try:
                # Try test client format
                filename, language = file_data.split(",")
                content = await websocket.receive_text()
                if content == "EOF":
                    content = ""
                logger.info(f"Using test client format - filename: {filename}, language: {language}")
            except Exception as e:
                error_msg = f"Invalid data format: {str(e)}"
                logger.error(error_msg)
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "data": error_msg
                }))
                return

        if not filename or not language or content is None:
            error_msg = "Missing required file details"
            logger.error(error_msg)
            await websocket.send_text(json.dumps({
                "type": "error",
                "data": error_msg
            }))
            return

        logger.info(f"Processing file '{filename}' for language '{language}'")

        if language not in DOCKER_CONFIGS:
            error_msg = f"Unsupported language: {language}"
            logger.error(error_msg)
            await websocket.send_text(json.dumps({
                "type": "error",
                "data": error_msg
            }))
            return

        # Prepare execution environment
        config = DOCKER_CONFIGS[language]
        project_id = str(uuid.uuid4())[:8]
        project_dir = f"/tmp/project_{project_id}"
        os.makedirs(project_dir, exist_ok=True)

        file_path = os.path.join(project_dir, f"Main{config['file_ext']}")
        with open(file_path, "w") as file:
            file.write(content)

        logger.info(f"Saved file at {file_path}")

        # Construct Docker command
        docker_cmd = f"""
        docker run --rm {config['gpu_flags']} \
        -v {project_dir}:/workspace \
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

