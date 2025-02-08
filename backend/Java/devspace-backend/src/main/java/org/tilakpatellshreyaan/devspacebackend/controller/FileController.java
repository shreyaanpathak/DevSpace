package org.tilakpatellshreyaan.devspacebackend.controller;

import org.springframework.http.ResponseEntity;
import org.tilakpatellshreyaan.devspacebackend.model.FileData;
import org.tilakpatellshreyaan.devspacebackend.repository.FileDataRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
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
    Optional<FileData> fileOpt = fileRepository.findById(fileId);
    if (fileOpt.isPresent()) {
      return ResponseEntity.ok(fileOpt.get());
    } else {
      return ResponseEntity.status(404).body(Map.of("error", "File not found"));
    }
  }

  @GetMapping("/repositories/{repoId}/files")
  public ResponseEntity<?> getFilesByRepository(@PathVariable String repoId) {
    List<FileData> files = fileRepository.findByRepositoryId(repoId);
    if (!files.isEmpty()) {
      return ResponseEntity.ok(files);
    } else {
      return ResponseEntity.ok(Collections.emptyList());
    }
  }

  @PostMapping
  public ResponseEntity<?> uploadFile(@RequestBody FileData file) {
    try {
      FileData savedFile = fileRepository.save(file);
      return ResponseEntity.ok(savedFile);
    } catch (Exception e) {
      return ResponseEntity.status(500).body(Map.of("error", "Failed to upload file"));
    }
  }

  @PutMapping("/{fileId}")
  public ResponseEntity<?> updateFile(@PathVariable String fileId, @RequestBody FileData updatedFile) {
    Optional<FileData> fileOpt = fileRepository.findById(fileId);
    if (fileOpt.isPresent()) {
      FileData file = fileOpt.get();
      file.setFilename(updatedFile.getFilename());
      file.setLanguage(updatedFile.getLanguage());
      file.setContent(updatedFile.getContent());
      fileRepository.save(file);
      return ResponseEntity.ok(file);
    } else {
      return ResponseEntity.status(404).body(Map.of("error", "File not found"));
    }
  }
}
