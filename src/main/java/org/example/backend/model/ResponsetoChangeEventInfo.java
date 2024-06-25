package org.example.backend.model;

public class ResponsetoChangeEventInfo {
    private String message;
    private boolean isRepeat;

    public ResponsetoChangeEventInfo(String message, boolean isRepeat) {
        this.message = message;
        this.isRepeat = isRepeat;
    }

    //getters
    public String getMessage() {
        return message;
    }
    public boolean getIsRepeat() {
        return isRepeat;
    }

    //setters
    public void setMessage(String message) {
        this.message = message;
    }
    public void setIsRepeat(boolean isRepeat) {
        this.isRepeat = isRepeat;
    }
}
