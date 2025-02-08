package org.tilakpatellshreyaan.devspacebackend.repository;

import org.springframework.stereotype.Repository;
import org.tilakpatellshreyaan.devspacebackend.model.CodeRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

@Repository
public interface CodeRepositoryRepository extends MongoRepository<CodeRepository, String> {
  List<CodeRepository> findByCreatorId(String creatorId);
  List<CodeRepository> findByCreatorIdOrCollaboratorIdsContaining(String creatorId, String collaboratorId);
}
