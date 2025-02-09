package org.tilakpatellshreyaan.devspacebackend.controller;

import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;
import org.tilakpatellshreyaan.devspacebackend.model.FileData;
import org.tilakpatellshreyaan.devspacebackend.repository.FileDataRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/files")
public class FileController {
  private final FileDataRepository fileRepository;

  public FileController(FileDataRepository fileRepository) {
    this.fileRepository = fileRepository;
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

  @GetMapping("/repositories/{repoId}/files")
  public ResponseEntity<?> getFilesByRepository(@PathVariable String repoId) {
    try {
      ObjectId objectId = new ObjectId(repoId);
      List<FileData> files = fileRepository.findByRepositoryId(objectId);
      return ResponseEntity.ok(files.isEmpty() ? Collections.emptyList() : files);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(400).body(Map.of("error", "Invalid repository ID format"));
    }
  }

  @PostMapping
  public ResponseEntity<?> uploadFile(@RequestBody FileData file) {
    try {
      FileData savedFile = fileRepository.save(file);
      return ResponseEntity.ok(savedFile);
    } catch (Exception e) {
      return ResponseEntity.status(500)
              .body(Map.of("error", "Failed to upload file", "message", e.getMessage()));
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