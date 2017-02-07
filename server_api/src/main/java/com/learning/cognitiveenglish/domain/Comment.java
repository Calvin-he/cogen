package com.learning.cognitiveenglish.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;

/**
 * Created by pt on 17-2-7.
 */
@Data
@Entity
public class Comment extends Auditable{
    @Id
    @GeneratedValue
    private int id;
    private String content;
    @ManyToOne
    @JoinColumn(name = "lessonId")
    @JsonIgnore
    private Lesson lesson;
    @ManyToOne
    @JoinColumn(name = "authorId")
    @JsonIgnore
    private User author;

    public String getAuthorName(){
        return author.getName();
    }
}
