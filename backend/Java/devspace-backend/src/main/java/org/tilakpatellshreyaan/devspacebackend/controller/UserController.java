package org.tilakpatellshreyaan.devspacebackend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.tilakpatellshreyaan.devspacebackend.model.Activity;
import org.tilakpatellshreyaan.devspacebackend.model.Project;
import org.tilakpatellshreyaan.devspacebackend.model.Stat;
import org.tilakpatellshreyaan.devspacebackend.model.User;
import org.tilakpatellshreyaan.devspacebackend.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

  private final UserRepository userRepository;

  public UserController(UserRepository userRepository) {
    this.userRepository = userRepository;
  }


  @GetMapping("/{userId}")
  public Optional<User> getUserByUserId(@PathVariable String userId) {
    return userRepository.findById(userId);
  }

  @GetMapping("/{userId}/stats")
  public Optional<List<Stat>> getUserStats(@PathVariable String userId) {
    return userRepository.findById(userId).map(User::getStats);
  }

  @GetMapping("/{userId}/projects")
  public Optional<List<Project>> getUserProjects(@PathVariable String userId) {
    return userRepository.findById(userId).map(User::getProjects);
  }

  @GetMapping("/{userId}/activities")
  public Optional<List<Activity>> getUserActivities(@PathVariable String userId) {
    return userRepository.findById(userId).map(User::getActivities);
  }




}
