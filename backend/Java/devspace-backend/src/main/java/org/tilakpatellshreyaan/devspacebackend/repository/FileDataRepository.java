package org.tilakshreyaan.devspacebackend.repository;

import org.tilakshreyaan.devspacebackend.model.FileData;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface FileDataRepository extends MongoRepository<FileData, String> {
  List<FileData> findByRepositoryId(String repoId);
}
