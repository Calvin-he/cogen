package com.learning.cognitiveenglish.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.learning.cognitiveenglish.repository.converters.JsonConverters;
import lombok.Data;

import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.Date;
import java.util.List;

/**
 * Created by pt on 17-2-6.
 */
@Data
@Entity
public class Lesson extends Auditable {
    @Id
    @GeneratedValue
    private int id;
    private String name;
    private String url;
    private String description;
    @JsonProperty("num_of_viewer")
    private int numOfViewer;
    @JsonProperty("num_of_comments")
    private int numOfComments;
    @Convert(converter = JsonConverters.ListConvert.class)
    private List<String> tags;
    @JsonProperty("publish_time")
    @JsonFormat(pattern = "yyyy-MM-ddTHH:mm:ss")
    private Date publishTime;
}
