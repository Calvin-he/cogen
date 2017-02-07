package com.learning.cognitiveenglish.dto.lesson;

import lombok.Data;

/**
 * Created by pt on 17-2-7.
 */
@Data
public class CreateCommentCommand {
    private int lessonId;
    private int authorId;
    private String content;

}
