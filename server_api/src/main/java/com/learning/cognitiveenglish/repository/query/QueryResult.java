package com.learning.cognitiveenglish.repository.query;

import org.springframework.data.domain.Page;

import java.util.List;

/**
 * Created by pt on 16-2-16.
 */
public class QueryResult<T> {
    private List<T> items;
    private long total;

    public QueryResult(List<T> items, long total) {
        this.items = items;
        this.total = total;
    }

    public QueryResult(List<T> items) {
        this(items, items.size());
    }

    public QueryResult(Page<T> page, long total) {
        this(page.getContent(), total);
    }

    public List<T> getItems() {
        return items;
    }

    public long getTotal() {
        return total;
    }
}