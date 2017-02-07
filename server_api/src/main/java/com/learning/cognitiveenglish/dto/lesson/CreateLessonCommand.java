package com.learning.cognitiveenglish.dto.lesson;

import lombok.Data;

import java.util.List;

/**
 * Created by pt on 17-2-7.
 */
@Data
public class CreateLessonCommand {
    private String name;
    private String url;
    private String description;
    private List<String> tags;
}
