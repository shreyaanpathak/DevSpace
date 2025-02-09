package org.tilakpatellshreyaan.devspacebackend.model;

import lombok.Data;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "files")
public class FileData {
  @Id
  private String id;

  private String filename;
  private String language;
  private ObjectId repositoryId;
  private String content;
  private Date lastModified;
}
