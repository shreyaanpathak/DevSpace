package org.tilakpatellshreyaan.devspacebackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.tilakpatellshreyaan.devspacebackend.model.Activity;
import org.tilakpatellshreyaan.devspacebackend.model.Project;
import org.tilakpatellshreyaan.devspacebackend.model.Stat;
import org.tilakpatellshreyaan.devspacebackend.model.User;
import org.tilakpatellshreyaan.devspacebackend.repository.UserRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
public class UserController {

  private final UserRepository userRepository;

  public UserController(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  // Sign In: Validate credentials and store session data.
  @PostMapping("/signin")
  public ResponseEntity<?> signIn(@RequestBody Map<String, String> credentials, HttpSession session) {
    String username = credentials.get("username");
    String password = credentials.get("password");

    System.out.println("Attempting sign in with username: " + username);

    Optional<User> userOpt = userRepository.findByUsername(username);
    if (userOpt.isPresent()) {
      session.setAttribute("userId", userOpt.get().getId());
      Map<String, Object> response = new HashMap<>();
      response.put("message", "Sign in successful");
      response.put("user", userOpt.get());
      return ResponseEntity.ok(response);
    } else {
      System.out.println("User not found for username: " + username);
      return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
    }
  }


  // Sign Out: Invalidate the user session.
  @PostMapping("/signout")
  public ResponseEntity<?> signOut(HttpSession session) {
    session.invalidate();
    return ResponseEntity.ok(Map.of("message", "Signed out successfully"));
  }

  // Check Session: Returns session status and user info if a session is active.
  @GetMapping("/check-session")
  public ResponseEntity<?> checkSession(HttpSession session) {
    String userId = (String) session.getAttribute("userId");
    if (userId == null) {
      return ResponseEntity.status(401).body(Map.of("message", "No active session"));
    }
    Optional<User> userOpt = userRepository.findById(userId);
    if (userOpt.isEmpty()) {
      return ResponseEntity.status(404).body(Map.of("message", "User not found"));
    }
    Map<String, Object> response = new HashMap<>();
    response.put("session", "active");
    response.put("user", userOpt.get());
    return ResponseEntity.ok(response);
  }

  // Get User by ID.
  @GetMapping("/{userId}")
  public ResponseEntity<?> getUserByUserId(@PathVariable String userId) {
    Optional<User> userOpt = userRepository.findById(userId);
    if (userOpt.isPresent()) {
      return ResponseEntity.ok(userOpt.get());
    } else {
      return ResponseEntity.status(404).body(Map.of("error", "User not found"));
    }
  }

  // Get User Stats.
  @GetMapping("/{userId}/stats")
  public ResponseEntity<?> getUserStats(@PathVariable String userId) {
    Optional<User> userOpt = userRepository.findById(userId);
    if (userOpt.isPresent()) {
      return ResponseEntity.ok(userOpt.get().getStats());
    } else {
      return ResponseEntity.status(404).body(Map.of("error", "User not found"));
    }
  }

  // Get User Projects.
  @GetMapping("/{userId}/projects")
  public ResponseEntity<?> getUserProjects(@PathVariable String userId) {
    Optional<User> userOpt = userRepository.findById(userId);
    if (userOpt.isPresent()) {
      return ResponseEntity.ok(userOpt.get().getProjects());
    } else {
      return ResponseEntity.status(404).body(Map.of("error", "User not found"));
    }
  }

  // Get User Activities.
  @GetMapping("/{userId}/activities")
  public ResponseEntity<?> getUserActivities(@PathVariable String userId) {
    Optional<User> userOpt = userRepository.findById(userId);
    if (userOpt.isPresent()) {
      return ResponseEntity.ok(userOpt.get().getActivities());
    } else {
      return ResponseEntity.status(404).body(Map.of("error", "User not found"));
    }
  }

  @GetMapping("/profile/{userId}")
  public ResponseEntity<?> getUserProfile(@PathVariable String userId) {
    Optional<User> userOpt = userRepository.findById(userId);

    if (userOpt.isEmpty()) {
      return ResponseEntity.status(404).body(Map.of("error", "User not found"));
    }

    User user = userOpt.get();

    // Consolidate everything into one response
    Map<String, Object> profileResponse = new HashMap<>();
    profileResponse.put("id", user.getId());
    profileResponse.put("username", user.getUsername());
    profileResponse.put("email", user.getEmail());
    profileResponse.put("avatarUrl", user.getAvatarUrl());
    profileResponse.put("stats", user.getStats());
    profileResponse.put("skills", user.getSkills());
    profileResponse.put("projects", user.getProjects());
    profileResponse.put("activities", user.getActivities());

    return ResponseEntity.ok(profileResponse);
  }


  // Update User Information.
  @PutMapping("/{userId}")
  public ResponseEntity<?> updateUser(@PathVariable String userId, @RequestBody User updatedUser) {
    Optional<User> userOpt = userRepository.findById(userId);
    if (userOpt.isPresent()) {
      User user = userOpt.get();
      user.setUsername(updatedUser.getUsername());
      user.setEmail(updatedUser.getEmail());
      user.setAvatarUrl(updatedUser.getAvatarUrl());
      user.setStats(updatedUser.getStats());
      user.setProjects(updatedUser.getProjects());
      user.setActivities(updatedUser.getActivities());
      userRepository.save(user);
      return ResponseEntity.ok(user);
    } else {
      return ResponseEntity.status(404).body(Map.of("error", "User not found"));
    }
  }

  // Delete User Account.
  @DeleteMapping("/{userId}")
  public ResponseEntity<?> deleteUser(@PathVariable String userId) {
    if (userRepository.existsById(userId)) {
      userRepository.deleteById(userId);
      return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    } else {
      return ResponseEntity.status(404).body(Map.of("error", "User not found"));
    }
  }
}
