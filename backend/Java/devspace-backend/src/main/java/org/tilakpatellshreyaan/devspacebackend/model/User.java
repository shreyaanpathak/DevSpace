package org.tilakshreyaan.devspacebackend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Data
@Document(collection = "users")
public class User {
  @Id
  private String id;

  private String username;
  private String email;
  private String avatarUrl;
  @JsonIgnore
  private String password;
  private List<Stat> stats;
  private List<Project> projects;
  private List<Activity> activities;
  private List<Skill> skills;
  private String location;
  private String title;
}
