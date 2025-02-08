package org.tilakpatellshreyaan.devspacebackend.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import org.tilakpatellshreyaan.devspacebackend.model.CodeRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

@Repository
public interface CodeRepositoryRepository extends MongoRepository<CodeRepository, String> {
  List<CodeRepository> findByOwnerId(String ownerId);
  @Query("{ $or: [ { 'ownerId': ?0 }, { 'collaboratorIds': ?1 } ] }")
  List<CodeRepository> findByOwnerIdOrCollaboratorIdsContaining(ObjectId ownerId, ObjectId collaboratorId);
}