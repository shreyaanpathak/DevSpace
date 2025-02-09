package org.tilakpatellshreyaan.devspacebackend.controller;

import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;
import org.tilakpatellshreyaan.devspacebackend.model.FileData;
import org.tilakpatellshreyaan.devspacebackend.repository.FileDataRepository;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Date;
import java.util.Map;
import java.util.Optional;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;

@RestController
@RequestMapping("/api/files")
public class FileController {
  private final FileDataRepository fileRepository;
  private WebSocketClient jetsonWebSocketClient;
  private final ObjectMapper objectMapper = new ObjectMapper();

  public FileController(FileDataRepository fileRepository) {
    this.fileRepository = fileRepository;

    // Connect to Jetson Nano WebSocket
    try {
      jetsonWebSocketClient = new WebSocketClient(new URI("ws://172.20.10.2:8000/ws")) {
        @Override
        public void onOpen(ServerHandshake handshake) {
          System.out.println("Connected to Jetson WebSocket");
        }

        @Override
        public void onMessage(String message) {
          System.out.println("Received from Jetson: " + message);
        }

        @Override
        public void onClose(int code, String reason, boolean remote) {
          System.out.println("Jetson WebSocket closed: " + reason);
        }

        @Override
        public void onError(Exception ex) {
          System.out.println("Error in Jetson WebSocket: " + ex.getMessage());
        }
      };
      jetsonWebSocketClient.connect();
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  @GetMapping("/{fileId}")
  public ResponseEntity<?> getFileById(@PathVariable String fileId) {
    try {
      ObjectId objectId = new ObjectId(fileId);
      Optional<FileData> fileOpt = fileRepository.findById(objectId);
      if (fileOpt.isPresent()) {
        return ResponseEntity.ok(fileOpt.get());
      } else {
        return ResponseEntity.status(404).body(Map.of("error", "File not found"));
      }
    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(400).body(Map.of("error", "Invalid file ID format"));
    }
  }

  @PutMapping("/{fileId}")
  public ResponseEntity<?> updateFile(@PathVariable String fileId, @RequestBody FileData updatedFile) {
    try {
      ObjectId objectId = new ObjectId(fileId);
      Optional<FileData> fileOpt = fileRepository.findById(objectId);
      if (fileOpt.isPresent()) {
        FileData file = fileOpt.get();
        file.setContent(updatedFile.getContent());
        file.setLastModified(new Date());

        FileData savedFile = fileRepository.save(file);
        return ResponseEntity.ok(savedFile);
      } else {
        return ResponseEntity.status(404).body(Map.of("error", "File not found"));
      }
    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(400).body(Map.of("error", "Invalid file ID format"));
    }
  }

  @PostMapping("/{fileId}/execute")
  public ResponseEntity<?> executeFile(@PathVariable String fileId) {
    try {
      ObjectId objectId = new ObjectId(fileId);
      Optional<FileData> fileOpt = fileRepository.findById(objectId);

      if (fileOpt.isEmpty()) {
        return ResponseEntity.status(404).body(Map.of("error", "File not found"));
      }

      FileData file = fileOpt.get();
      String fileJson = objectMapper.writeValueAsString(file);

      // Send the file data to Jetson Nano via WebSocket
      if (jetsonWebSocketClient != null && jetsonWebSocketClient.isOpen()) {
        jetsonWebSocketClient.send(fileJson);
        System.out.println("Sent file to Jetson Nano for execution: " + file.getFilename());
      } else {
        return ResponseEntity.status(500).body(Map.of("error", "Jetson WebSocket is not connected"));
      }

      return ResponseEntity.ok(Map.of("message", "File execution request sent"));

    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(400).body(Map.of("error", "Invalid file ID format"));
    } catch (IOException e) {
      return ResponseEntity.status(500).body(Map.of("error", "Error processing file data", "message", e.getMessage()));
    }
  }

  @DeleteMapping("/{fileId}")
  public ResponseEntity<?> deleteFile(@PathVariable String fileId) {
    try {
      ObjectId objectId = new ObjectId(fileId);
      if (fileRepository.existsById(objectId)) {
        fileRepository.deleteById(objectId);
        return ResponseEntity.ok(Map.of("message", "File deleted successfully"));
      } else {
        return ResponseEntity.status(404).body(Map.of("error", "File not found"));
      }
    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(400).body(Map.of("error", "Invalid file ID format"));
    }
  }
}
