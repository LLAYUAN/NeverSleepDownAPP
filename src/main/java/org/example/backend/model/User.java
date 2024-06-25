package org.example.backend.model;

import jakarta.persistence.*;
import org.example.backend.service.EventTableService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Set;

@Entity
@Table(name = "user")
public class User {

    @Id
    @Column(name = "user_id")
    private String userID;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "user_gender")
    private boolean userGender;

    @Column(name = "password")
    private String password;

    @Column(name = "user_location")
    private String userLocation;

    @Column(name = "avatar_url")
    private String AvatarURL;

    @Column(name = "is_first_login")
    private boolean isFirstLogin;

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private Set<EventTable> eventTables;

    @OneToMany(mappedBy = "changeTableUser", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private Set<ChangeTable> changeTables;

    public User(){
        this.userGender = true;
        this.userLocation = "China";
        this.userName = "新用户";
        this.isFirstLogin = true;
    }

    public User(String userID,String userName, boolean userGender, String password, String userLocation, String AvatarURL) {
        this.userID = userID;
        this.userName = userName;
        this.userGender = userGender;
        this.password = password;
        this.userLocation = userLocation;
        this.AvatarURL = AvatarURL;
    }

    // getters
    public String getUserID() { return userID; }
    public String getUserName() { return userName; }
    public boolean getIsFirstLogin() { return isFirstLogin; }
    public boolean getUserGender() { return userGender; }
    public String getPassword() { return password; }
    public String getUserLocation() { return userLocation; }
    public String getAvatarURL() { return AvatarURL; }
    public Set<EventTable> getEventTables() { return eventTables; }

    // setters
    public void setUserID(String userID) { this.userID = userID; }
    public void setUserName(String userName) { this.userName = userName; }
    public void setIsFirstLogin(boolean isFirstLogin) { this.isFirstLogin = isFirstLogin; }
    public void setUserGender(boolean userGender) { this.userGender = userGender; }
    public void setPassword(String password) { this.password = password; }
    public void setUserLocation(String userLocation) { this.userLocation = userLocation; }
    public void setAvatarURL(String AvatarURL) { this.AvatarURL = AvatarURL; }
    public void setEventTables(Set<EventTable> eventTables) { this.eventTables = eventTables; }
    public void setChangeTables(Set<ChangeTable> changeTables) { this.changeTables = changeTables; }
    public Set<ChangeTable> getChangeTables() { return changeTables; }

    public EventTable getEventTableByTableID(Integer tableID) {
        for (EventTable eventTable : eventTables) {
            if (eventTable.getTableID().equals(tableID)) {
                return eventTable;
            }
        }
        return null;
    }
}