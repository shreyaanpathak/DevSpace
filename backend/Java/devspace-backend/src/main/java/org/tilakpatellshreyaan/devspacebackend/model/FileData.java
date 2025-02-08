package org.tilakshreyaan.devspacebackend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "files")
public class FileData {
  @Id
  private String id;

  private String filename;
  private String language;
  private String repositoryId;
  private String content;
}
