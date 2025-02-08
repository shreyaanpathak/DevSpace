package org.tilakshreyaan.devspacebackend.repository;

import org.tilakshreyaan.devspacebackend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
  Optional<User> findByUsername(String username);
  Optional<User> findByEmail(String email);
}
