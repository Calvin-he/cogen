package com.learning.cognitiveenglish.repository;

import com.learning.cognitiveenglish.domain.Lesson;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by pt on 17-2-6.
 */
public interface LessonRepository extends CrudRepository<Lesson, Integer>{
    
}
