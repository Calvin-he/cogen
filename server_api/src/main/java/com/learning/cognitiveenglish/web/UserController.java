package com.learning.cognitiveenglish.web;

import com.learning.cognitiveenglish.domain.User;
import com.learning.cognitiveenglish.repository.UserRepository;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

/**
 * Created by pt on 17-2-6.
 */
@RestController
public class UserController extends BaseController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public Iterable<User> list() {
        return userRepository.findAll();
    }

    @PostMapping("/users")
    public ModelMap create(@RequestBody User user) {
        User saved = userRepository.save(user);
        return mapOf("id", saved.getId());
    }

    @GetMapping("/users/{id}")
    public User findOne(@PathVariable int id){
        return userRepository.findOne(id);
    }

}
