package org.example.backend.model;
import org.example.backend.model.TableArray;

import java.util.Set;

public class ResponsetogetAllTableInfo {

    private int code;

    public class Data {
        public Set<TableArray> tableArrays;
        public Data() {
        }
        public Set<TableArray> getTableArrays() {
            return tableArrays;
        }
        public void setTableArrays(int length, Set<TableArray> tableArrays) {
            this.tableArrays = tableArrays;
        }
    }

    private Data data;

    public int getCode() {
        return code;
    }

    public void setCode(int value) {
        this.code = value;
    }

    public Data getData() {
        return data;
    }

    public void setData(int length, Set<TableArray> tableArray) {
        this.data = new Data();
        data.setTableArrays(length, tableArray);
    }
}
