package org.tilakshreyaan.devspacebackend.repository;

import org.tilakshreyaan.devspacebackend.model.CodeRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CodeRepositoryRepository extends MongoRepository<CodeRepository, String> {
  List<CodeRepository> findByOwnerId(String ownerId);
}
