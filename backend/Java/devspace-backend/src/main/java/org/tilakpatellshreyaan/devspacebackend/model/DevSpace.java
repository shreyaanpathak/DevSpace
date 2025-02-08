package org.tilakpatellshreyaan.devspacebackend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.Date;
import lombok.Data;

@Data
@Document(collection = "devspace")
public class DevSpace {
  @Id
  private String id;
  private String name;
  private String description;
  private String ownerId;  // Added to track owner
  private List<String> collaboratorIds;  // Changed from List<User> to List<String>
  private List<org.tilakpatellshreyaan.devspacebackend.model.FileData> files;
  private Date createdAt;  // Added to track creation time
  private Date updatedAt;  // Added to track updates
}