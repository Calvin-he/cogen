package com.learning.cognitiveenglish.repository.query;

import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.function.UnaryOperator;

/**
 * Created by pt on 16-2-26.
 */
public class SpecBuilder<T> implements Specification<T> {
    private final SpecBuilder<T> parent;
    private final Specification<T> spec;

    public SpecBuilder(SpecBuilder parent, Specification spec) {
        this.parent = parent;
        this.spec = spec;
    }

    static private SpecBuilder HEAD = new SpecBuilder(null, null);

    public static <T> Specification<T> newSpec(final UnaryOperator<SpecBuilder> specs) {
        return (r, q, cb) -> {
            SpecBuilder s = specs.apply(HEAD);
            return s.toPredicate(r, q, cb);
        };
    }

    public SpecBuilder eq(String name, Object value) {
        if (null != value) {
            return new SpecBuilder(this, (root, query, cb) -> cb.equal(find(name, root), value));
        }
        return this;
    }

    public SpecBuilder ne(String name, Object value) {
        if (null != value) {
            return new SpecBuilder(this, (root, query, cb) -> cb.notEqual(find(name, root), value));
        }
        return this;
    }

    public SpecBuilder in(String name, Collection<?> values) {
        if (null != values && !values.isEmpty()) {
            return new SpecBuilder(this, (root, query, cb) -> find(name, root).in(values));
        }
        return this;
    }

    public SpecBuilder between(String name,Comparable low,Comparable high) {
        if (null != low && null != high) {
            return new SpecBuilder(this, (root, query, cb) -> cb.between(find(name, root),low,high));
        }
        return this;
    }

    public SpecBuilder gt(String name, Comparable value) {
        if (null != value) {
            return new SpecBuilder(this, (root, query, cb) -> cb.greaterThan(find(name, root), value));
        }
        return this;
    }

    public SpecBuilder ge(String name, Comparable value) {
        if (null != value) {
            return new SpecBuilder(this, (root, query, cb) -> cb.greaterThanOrEqualTo(find(name, root), value));
        }
        return this;
    }

    public SpecBuilder lt(String name, Comparable value) {
        if (null != value) {
            return new SpecBuilder(this, (root, query, cb) -> cb.lessThan(find(name, root), value));
        }
        return this;
    }

    public SpecBuilder le(String name, Comparable value) {
        if (null != value) {
            return new SpecBuilder(this, (root, query, cb) -> cb.lessThanOrEqualTo(find(name, root), value));
        }
        return this;
    }

    private SpecBuilder like0(String name, String value) {
        return new SpecBuilder(this, (root, query, cb) -> cb.like(find(name, root), value));
    }

    public SpecBuilder like(String name, String value) {
        if (null != value && !value.trim().isEmpty()) {
            return like0(name, "%" + value + "%");
        }
        return this;
    }

    public SpecBuilder startLike(String name, String value) {
        if (null != value && !value.trim().isEmpty()) {
            return  like0(name, value + "%");
        }
        return this;
    }

    public SpecBuilder endLike(String name, String value) {
        if (null != value && !value.trim().isEmpty()) {
            return like0(name, "%" + value);
        }
        return this;
    }

    public SpecBuilder isNull(String name){
        return new SpecBuilder(this, (root, query, cb) -> find(name, root).isNull());
    }

    public SpecBuilder isNotNull(String name){
        return new SpecBuilder(this, (root, query, cb) -> find(name, root).isNotNull());
    }

    public SpecBuilder or(SpecBuilder... specs_) {
        List<SpecBuilder> specs = new ArrayList<>();
        for (SpecBuilder spec : specs_) {
            if (spec == HEAD)
                continue;
            specs.add(spec);
        }
        if (specs.isEmpty())
            return this;
        if (specs.size() == 1)
            return new SpecBuilder(this, specs.get(0).spec);
        return new SpecBuilder(this, (root, query, cb) -> {
            Predicate[] predicates = new Predicate[specs.size()];
            for (int i = 0; i < specs.size(); i++) {
                predicates[i] = specs.get(i).toPredicate(root, query, cb);
            }
            return cb.or(predicates);
        });
    }

    public SpecBuilder join(String path, JoinType joinType) {
        return new SpecBuilder(this, new JoinSpecification(path, joinType));
    }

    public SpecBuilder join(String path) {
        return join(path, JoinType.INNER);
    }

    static class JoinSpecification<T> implements Specification<T> {
        private String path;
        private JoinType joinType;

        public JoinSpecification(String path, JoinType joinType) {
            this.path = path;
            this.joinType = joinType;
        }

        @Override
        public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
            boolean isCountQuery = query.getResultType().equals(Long.class);
            if (!isCountQuery) {
                String[] objPath = path.split("\\.");
                if (objPath.length == 1) {
                    root.fetch(path, joinType);
                } else {
                    Fetch f = root.fetch(objPath[0], joinType);
                    int i = 1;
                    while (i < objPath.length) {
                        f = f.fetch(objPath[i], joinType);
                        i++;
                    }
                }
            }
            return cb.and();
        }
    }


    private static <T> Path<T> find(String path, Root<T> root) {
        String[] objPath = path.split("\\.");
        if (objPath.length == 1)
            return root.get(path);

        Join p = root.join(objPath[0]);
        int i = 1;
        while ((i + 1) < objPath.length) {
            p = p.join(objPath[i]);
            i++;
        }
        return p.get(objPath[i]);
    }

    @Override
    public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        if (this == HEAD) {
//            throw new IllegalStateException("Should't call toPredicate in HEAD");
            return cb.and();
        }
        if (this.parent == HEAD) {
            return this.spec.toPredicate(root, query, cb);
        }
        Predicate pp = this.parent.toPredicate(root, query, cb);
        return cb.and(pp, this.spec.toPredicate(root, query, cb));
    }

}
