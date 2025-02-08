package org.tilakpatellshreyaan.devspacebackend.controller;

import org.tilakpatellshreyaan.devspacebackend.model.CodeRepository;
import org.tilakpatellshreyaan.devspacebackend.repository.CodeRepositoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/repositories")
public class CodeRepositoryController {

  private final CodeRepositoryRepository repositoryRepo;

  public CodeRepositoryController(CodeRepositoryRepository repositoryRepo) {
    this.repositoryRepo = repositoryRepo;
  }

  // Get repository by ID
  @GetMapping("/{repoId}")
  public Optional<CodeRepository> getRepositoryById(@PathVariable String repoId) {
    return repositoryRepo.findById(repoId);
  }

  // Get repository collaborators
  @GetMapping("/{repoId}/collaborators")
  public Optional<List<String>> getRepositoryCollaborators(@PathVariable String repoId) {
    return repositoryRepo.findById(repoId).map(CodeRepository::getCollaboratorIds);
  }

  // Create a new repository
  @PostMapping
  public CodeRepository createRepository(@RequestBody CodeRepository repository) {
    return repositoryRepo.save(repository);
  }
}
