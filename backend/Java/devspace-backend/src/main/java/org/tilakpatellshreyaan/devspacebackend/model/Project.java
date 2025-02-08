package org.tilakshreyaan.devspacebackend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {
  private String name;
  private String description;
  private String status;
  private boolean featured;
  private List<String> technologies;
  private List<String> team;
  private String lastUpdated;
  private int stars;
  private int commits;
}
