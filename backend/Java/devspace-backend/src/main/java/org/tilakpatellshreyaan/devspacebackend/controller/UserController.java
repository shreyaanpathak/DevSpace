package org.tilakshreyaan.devspacebackend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.tilakshreyaan.devspacebackend.model.Activity;
import org.tilakshreyaan.devspacebackend.model.Project;
import org.tilakshreyaan.devspacebackend.model.Stat;
import org.tilakshreyaan.devspacebackend.model.User;
import org.tilakshreyaan.devspacebackend.repository.UserRepository;

import java.util.List;
import java.util.Optional;

import javax.swing.text.html.Option;

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
