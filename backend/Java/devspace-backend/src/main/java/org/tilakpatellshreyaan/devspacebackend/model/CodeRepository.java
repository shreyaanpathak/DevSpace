package org.tilakshreyaan.devspacebackend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;

@Data
@Document(collection = "repository")
public class CodeRepository {
  @Id
  private String id;
  private String repositoryName;
  private String description;
  private Date createdAt;
  private Date updatedAt;
  private String ownerId;
  private List<String> fileIds;
  private List<String> collaboratorIds;
}
