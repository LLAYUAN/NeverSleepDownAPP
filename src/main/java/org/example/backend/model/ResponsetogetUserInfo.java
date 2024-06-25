package org.example.backend.model;

public class ResponsetogetUserInfo {
    private int code;

    public class Data {
        private String userID;
        private String userName;
        private boolean userGender;
        private String userLocation;
        public Data() {
        }
        public String getUserID() { return userID; }
        public void setUserID(String value) { this.userID = value; }
        public String getUserName() { return userName; }
        public void setUserName(String value) { this.userName = value; }
        public boolean getUserGender() { return userGender; }
        public void setUserGender(boolean value) { this.userGender = value; }
        public String getUserLocation() { return userLocation; }
        public void setUserLocation(String value) { this.userLocation = value; }
    }

    private Data data;

    public ResponsetogetUserInfo() {
        this.code = 1; // 默认响应码为1
        this.data = null; // 默认数据为空
    }

    public ResponsetogetUserInfo(int code, Data data) {
        this.code = code;
        this.data = data;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public Data getData() {
        return data;
    }

    public void setData(String userID, String userName, boolean userGender, String userLocation) {
        this.data = new Data();
        this.data.setUserID(userID);
        this.data.setUserName(userName);
        this.data.setUserGender(userGender);
        this.data.setUserLocation(userLocation);
    }


}
