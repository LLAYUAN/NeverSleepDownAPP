package org.example.backend.model;

public class TableArray{

    private int tableID;
    private String tableName;

    public TableArray() {
    }

    // getters
    public int getTableID() {
        return tableID;
    }
    public String getTableName() {
        return tableName;
    }

    // setters
    public void setTableArray(int tableID, String tableName) {
        this.tableID = tableID;
        this.tableName = tableName;
    }
}
