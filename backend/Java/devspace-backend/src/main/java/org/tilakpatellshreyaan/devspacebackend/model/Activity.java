package org.tilakpatellshreyaan.devspacebackend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activity {
  private String icon;
  private String description;
  private String time;
}
