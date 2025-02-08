package org.tilakpatellshreyaan.devspacebackend.controller;

import org.springframework.http.ResponseEntity;
import org.tilakpatellshreyaan.devspacebackend.model.CodeRepository;
import org.tilakpatellshreyaan.devspacebackend.repository.CodeRepositoryRepository;

import jakarta.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/repositories")
public class CodeRepositoryController {
  private final CodeRepositoryRepository repositoryRepo;
  private final HttpSession httpSession; // Add this instead of UserService

  public CodeRepositoryController(CodeRepositoryRepository repositoryRepo, HttpSession httpSession) {
    this.repositoryRepo = repositoryRepo;
    this.httpSession = httpSession;
  }

  // Modified endpoint to get repositories accessible by the current user
  @GetMapping("/accessible")
  public ResponseEntity<?> getAccessibleRepositories() {
    try {
      String currentUserId = (String) httpSession.getAttribute("userId");
      if (currentUserId == null) {
        return ResponseEntity.status(401)
                .body(Map.of("error", "No active session"));
      }
      
      List<CodeRepository> repositories = repositoryRepo.findByCreatorIdOrCollaboratorIdsContaining(
              currentUserId,
              currentUserId
      );
      return ResponseEntity.ok(repositories);
    } catch (Exception e) {
      return ResponseEntity.status(500)
              .body(Map.of("error", "Failed to fetch accessible repositories"));
    }
  }
  // Add this endpoint to get user's repositories
  @GetMapping("/user/{userId}")
  public ResponseEntity<?> getUserRepositories(@PathVariable String userId) {
    try {
      List<CodeRepository> repositories = repositoryRepo.findByCreatorId(userId);
      return ResponseEntity.ok(repositories);
    } catch (Exception e) {
      return ResponseEntity.status(500)
              .body(Map.of("error", "Failed to fetch user repositories"));
    }
  }
  @GetMapping("/{repoId}")
  public ResponseEntity<?> getRepositoryById(@PathVariable String repoId) {
    Optional<CodeRepository> repoOpt = repositoryRepo.findById(repoId);
    if (repoOpt.isPresent()) {
      return ResponseEntity.ok(repoOpt.get());
    } else {
      return ResponseEntity.status(404).body(Map.of("error", "Repository not found"));
    }
  }

  @GetMapping("/{repoId}/collaborators")
  public ResponseEntity<?> getRepositoryCollaborators(@PathVariable String repoId) {
    Optional<CodeRepository> repoOpt = repositoryRepo.findById(repoId);
    if (repoOpt.isPresent()) {
      List<String> collaborators = repoOpt.get().getCollaboratorIds();
      return ResponseEntity.ok(collaborators);
    } else {
      return ResponseEntity.status(404).body(Map.of("error", "Repository not found"));
    }
  }

  @PostMapping
  public ResponseEntity<?> createRepository(@RequestBody CodeRepository repository) {
    try {
      repository.setCreatedAt(new Date());
      repository.setUpdatedAt(new Date());
      CodeRepository savedRepo = repositoryRepo.save(repository);
      return ResponseEntity.ok(savedRepo);
    } catch (Exception e) {
      return ResponseEntity.status(500).body(Map.of("error", "Failed to create repository"));
    }
  }

  @PutMapping("/{repoId}")
  public ResponseEntity<?> updateRepository(@PathVariable String repoId, @RequestBody CodeRepository updatedRepo) {
    Optional<CodeRepository> repoOpt = repositoryRepo.findById(repoId);
    if (repoOpt.isPresent()) {
      CodeRepository repo = repoOpt.get();
      repo.setRepositoryName(updatedRepo.getRepositoryName());
      repo.setDescription(updatedRepo.getDescription());
      repo.setFileIds(updatedRepo.getFileIds());
      repo.setCollaboratorIds(updatedRepo.getCollaboratorIds());
      repo.setUpdatedAt(new Date());
      repositoryRepo.save(repo);
      return ResponseEntity.ok(repo);
    } else {
      return ResponseEntity.status(404).body(Map.of("error", "Repository not found"));
    }
  }

  @DeleteMapping("/{repoId}")
  public ResponseEntity<?> deleteRepository(@PathVariable String repoId) {
    if (repositoryRepo.existsById(repoId)) {
      repositoryRepo.deleteById(repoId);
      return ResponseEntity.ok(Map.of("message", "Repository deleted successfully"));
    } else {
      return ResponseEntity.status(404).body(Map.of("error", "Repository not found"));
    }
  }
}