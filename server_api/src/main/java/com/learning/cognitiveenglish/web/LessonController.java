package com.learning.cognitiveenglish.web;

import com.learning.cognitiveenglish.domain.Comment;
import com.learning.cognitiveenglish.domain.Lesson;
import com.learning.cognitiveenglish.domain.User;
import com.learning.cognitiveenglish.dto.lesson.CreateCommentCommand;
import com.learning.cognitiveenglish.dto.lesson.CreateLessonCommand;
import com.learning.cognitiveenglish.repository.CommentRepository;
import com.learning.cognitiveenglish.repository.LessonRepository;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Date;

/**
 * Created by pt on 17-2-6.
 */
@RestController
public class LessonController extends BaseController {
    private final LessonRepository lessonRepository;
    private final CommentRepository commentRepository;

    public LessonController(LessonRepository lessonRepository, CommentRepository commentRepository) {
        this.lessonRepository = lessonRepository;
        this.commentRepository = commentRepository;
    }

    @GetMapping("/lessons")
    public Iterable<Lesson> list() {
        return lessonRepository.findAll();
    }

    @PostMapping("/lessons")
    public ModelMap create(@RequestBody CreateLessonCommand cmd) {
        Lesson lesson = new Lesson();
        lesson.setName(cmd.getName());
        lesson.setUrl(cmd.getUrl());
        lesson.setDescription(cmd.getDescription());
        lesson.setTags(cmd.getTags());
        lesson.setPublishTime(new Date());
        lessonRepository.save(lesson);
        return mapOf("id", lesson.getId());
    }

    @GetMapping("/lessons/{lessonId}/comments")
    public Iterable<Comment> findComments(@PathVariable int lessonId) {
        return commentRepository.findAllByLessonId(lessonId);
    }

    @PostMapping("/lessons/{lessonId}/comments")
    public ModelMap createComment(@PathVariable int lessonId, @RequestBody CreateCommentCommand cmd) {
        Comment comment = new Comment();
        transactional(tx -> {
            Lesson lesson = lessonRepository.findOne(lessonId);
            User author = new User();
            author.setId(cmd.getAuthorId());
            comment.setAuthor(author);
            comment.setLesson(lesson);
            comment.setContent(cmd.getContent());
            commentRepository.save(comment);
            lesson.increaseComments();
        });
        return mapOf("id", comment.getId());
    }
}
