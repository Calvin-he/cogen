package com.learning.cognitiveenglish.repository.converters;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.persistence.AttributeConverter;
import java.io.IOException;
import java.util.List;

/**
 * Created by pt on 16-3-4.
 */
public class JsonConverters {

    private static ObjectMapper objectMapper = new ObjectMapper();

    public static class ListConvert implements AttributeConverter<List, String> {
        @Override
        public String convertToDatabaseColumn(List attribute) {
            try {
                return objectMapper.writeValueAsString(attribute);
            } catch (JsonProcessingException e) {
                throw new IllegalArgumentException(e);
            }
        }

        @Override
        public List convertToEntityAttribute(String dbData) {
            try {
//                objectMapper.readValue(dbData, objectMapper.getTypeFactory().constructCollectionType(List.class,class String.class))
                return objectMapper.readValue(dbData, List.class);
            } catch (IOException e) {
                throw new IllegalArgumentException(e);
            }
        }

    }

}
