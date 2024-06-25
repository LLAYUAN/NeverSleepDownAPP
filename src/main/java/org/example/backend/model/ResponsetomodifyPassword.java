package org.example.backend.model;

public class ResponsetomodifyPassword {
    //返回code和data两个部分，最简单的返回方式
    private int code;

    public class Data {
        private int modifyStatus;
        public Data() {
        }
        public int getmodifyStatus() { return modifyStatus; }
        public void setmodifyStatus(int value) { this.modifyStatus = value; }
    }

    private Data data;

    public ResponsetomodifyPassword() {
    }

    public long getCode() {
        return code;
    }

    public void setCode(int value) {
        this.code = value;
    }

    public Data getData() {
        return data;
    }

    public void setData(int modifyStatus) {
        this.data = new Data();
        this.data.setmodifyStatus(modifyStatus);
    }
}
