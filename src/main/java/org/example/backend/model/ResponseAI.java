package org.example.backend.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)//如果值为null就不进行传输
public class ResponseAI<T> {
    private Integer type;
    private T data;

    public ResponseAI(Integer type, T data) {
        this.type = type;
        this.data = data;
    }
}
