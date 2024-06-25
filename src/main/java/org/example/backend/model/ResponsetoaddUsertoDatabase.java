package org.example.backend.model;

public class ResponsetoaddUsertoDatabase {
    //返回code和data两个部分，最简单的返回方式
    private int code;

    public class Data {
        private boolean isSuccess;
        public Data() {
        }
        public boolean getIsSuccess() { return isSuccess; }
        public void setIsSuccess(boolean value) { this.isSuccess = value; }
    }

    private Data data;

    public ResponsetoaddUsertoDatabase() {
    }

    public int getCode() {
        return code;
    }

    public void setCode(int value) {
        this.code = value;
    }

    public Data getData() {
        return data;
    }

    public void setData(boolean isSuccess) {
        this.data = new Data();
        this.data.setIsSuccess(isSuccess);
    }
}
