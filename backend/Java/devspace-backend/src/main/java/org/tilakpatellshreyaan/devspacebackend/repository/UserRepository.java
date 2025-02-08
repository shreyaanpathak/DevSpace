package org.tilakpatellshreyaan.devspacebackend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.tilakpatellshreyaan.devspacebackend.model.User;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
  Optional<User> findByUsername(String username);
}
