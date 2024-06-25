package org.example.backend.model;

import lombok.Data;

@Data
public class ResponsetoDeleteTable {
    private Boolean deleteSuccess;
    private String cookie;
    public ResponsetoDeleteTable(Boolean deleteSuccess, String cookie) {
        this.deleteSuccess = deleteSuccess;
        this.cookie = cookie;
    }
}
