package com.learning.cognitiveenglish.repository;

import com.learning.cognitiveenglish.domain.Comment;
import com.learning.cognitiveenglish.domain.Lesson;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by pt on 17-2-6.
 */
public interface CommentRepository extends CrudRepository<Comment, Integer>{

    @Query("from Comment where lesson.id = ?1")
    Iterable<Comment> findAllByLessonId(int lessonId);
}
