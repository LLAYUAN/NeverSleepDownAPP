package org.example.backend.model;

import jakarta.persistence.*;

import java.sql.Date;

@Entity
@Table(name = "changetable")
public class ChangeTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer changeTableID;

    //originalDate为要被覆盖的周数和日期
//    @Column(name = "originalWeek")
//    private Integer originalWeek;

    @Column(name = "originalDate")
    private Date modifiedDate;

    //targetDate为要覆盖的周数和日期
//    @Column(name = "targetWeek")
//    private Integer targetWeek;

    @Column(name = "targetDate")
    private Date replaceDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userid")
    private User changeTableUser;

    public ChangeTable() {
    }

    public ChangeTable(Integer changeTableID, Date modifiedDate, Date replaceDate) {
        this.changeTableID = changeTableID;
//        this.originalWeek = originalWeek;
        this.modifiedDate = modifiedDate;
//        this.targetWeek = targetWeek;
        this.replaceDate = replaceDate;
    }

    // getters
    public Integer getChangeTableID() { return changeTableID; }
//    public Integer getOriginalWeek() { return originalWeek; }
    public Date getModifiedDate() { return modifiedDate; }
//    public Integer getTargetWeek() { return targetWeek; }
    public Date getReplaceDate() { return replaceDate; }

    // setters
    public void setChangeTableID(Integer changeTableID) { this.changeTableID = changeTableID; }
//    public void setOriginalWeek(Integer originalWeek) { this.originalWeek = originalWeek; }
    public void setModifiedDate(Date modifiedDate) { this.modifiedDate = modifiedDate; }
//    public void setTargetWeek(Integer targetWeek) { this.targetWeek = targetWeek; }
    public void setReplaceDate(Date replaceDate) { this.replaceDate = replaceDate; }

    public void setUser(User user) { this.changeTableUser = user; }
    public User getUser() { return changeTableUser; }
//    public void detach() { this.changeTableUser.setChangeTable(null); }
}
