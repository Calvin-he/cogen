package com.learning.cognitiveenglish.repository;

import com.learning.cognitiveenglish.domain.User;
import com.learning.cognitiveenglish.repository.query.QueryExecutor;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by pt on 17-2-6.
 */
public interface UserRepository extends CrudRepository<User, Integer>, QueryExecutor<User> {
}
