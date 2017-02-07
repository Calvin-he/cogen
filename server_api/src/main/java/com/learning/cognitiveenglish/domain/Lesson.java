package com.learning.cognitiveenglish.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
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
    private int numOfViewer;
    private int numOfComments;
    @Convert(converter = JsonConverters.ListConvert.class)
    private List<String> tags;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date publishTime;

    public void increaseComments(){
        this.numOfComments ++;
    }
}
