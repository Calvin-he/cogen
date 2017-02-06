package com.learning.cognitiveenglish.web;

import com.learning.cognitiveenglish.domain.Lesson;
import com.learning.cognitiveenglish.repository.LessonRepository;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by pt on 17-2-6.
 */
@RestController
public class LessonController extends BaseController{
    private final LessonRepository lessonRepository;

    public LessonController(LessonRepository lessonRepository) {
        this.lessonRepository = lessonRepository;
    }

    @GetMapping("/lessons")
    public Iterable<Lesson> list(){
        return lessonRepository.findAll();
    }

    @PostMapping("/lessons")
    public ModelMap create(@RequestBody Lesson lesson){
        Lesson saved = lessonRepository.save(lesson);
        return mapOf("id", saved.getId());
    }
}
