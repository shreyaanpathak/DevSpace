package org.tilakpatellshreyaan.devspacebackend.repository;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Repository;
import org.tilakpatellshreyaan.devspacebackend.model.FileData;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

@Repository
public interface FileDataRepository extends MongoRepository<FileData, ObjectId> {
  List<FileData> findByRepositoryId(ObjectId repoId);
}
