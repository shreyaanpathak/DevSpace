package org.tilakshreyaan.devspacebackend.controller;

import org.tilakshreyaan.devspacebackend.model.FileData;
import org.tilakshreyaan.devspacebackend.repository.FileDataRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/files")
public class FileController {

  private final FileDataRepository fileRepository;

  public FileController(FileDataRepository fileRepository) {
    this.fileRepository = fileRepository;
  }

  // Get file by ID
  @GetMapping("/{fileId}")
  public Optional<FileData> getFileById(@PathVariable String fileId) {
    return fileRepository.findById(fileId);
  }

  // Get all files in a repository
  @GetMapping("/repositories/{repoId}/files")
  public List<FileData> getFilesByRepository(@PathVariable String repoId) {
    return fileRepository.findByRepositoryId(repoId);
  }

  // Upload a new file
  @PostMapping
  public FileData uploadFile(@RequestBody FileData file) {
    return fileRepository.save(file);
  }

  // Update a file
  @PutMapping("/{fileId}")
  public Optional<FileData> updateFile(@PathVariable String fileId, @RequestBody FileData updatedFile) {
    return fileRepository.findById(fileId).map(existingFile -> {
      existingFile.setFilename(updatedFile.getFilename());
      existingFile.setLanguage(updatedFile.getLanguage());
      existingFile.setContent(updatedFile.getContent());
      return fileRepository.save(existingFile);
    });
  }
}
