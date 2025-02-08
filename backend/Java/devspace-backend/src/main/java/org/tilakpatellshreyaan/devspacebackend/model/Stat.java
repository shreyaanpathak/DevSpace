package org.tilakpatellshreyaan.devspacebackend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Stat {
  private String title;
  private String value;
  private String icon;
  private Integer change; // Nullable field
}
