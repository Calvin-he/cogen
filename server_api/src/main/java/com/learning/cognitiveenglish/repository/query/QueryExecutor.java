package com.learning.cognitiveenglish.repository.query;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.function.UnaryOperator;

/**
 * Created by pt on 16-2-18.
 */
public interface QueryExecutor<T> extends JpaSpecificationExecutor<T> {

    default QueryResult<T> query(Specification<T> spec, Pageable pageable) {
        Page<T> page = this.findAll(spec, pageable);
       // long count = this.count(spec);
        return new QueryResult<>(page, page.getTotalElements());
    }

    default QueryResult<T> query(UnaryOperator<SpecBuilder> consumer, Pageable pageable) {
        Specification<T> spec = SpecBuilder.newSpec(consumer);
        return query(spec, pageable);
    }

    default List<T> findAll(UnaryOperator<SpecBuilder> consumer) {
        Specification<T> spec = SpecBuilder.newSpec(consumer);
        return findAll(spec);
    }

    default T findOne(UnaryOperator<SpecBuilder> consumer) {
        Specification<T> spec = SpecBuilder.newSpec(consumer);
        return findOne(spec);
    }

    default long count(UnaryOperator<SpecBuilder> consumer) {
        Specification<T> spec = SpecBuilder.newSpec(consumer);
        return count(spec);
    }
}
