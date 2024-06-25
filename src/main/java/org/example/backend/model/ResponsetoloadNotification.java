package org.example.backend.model;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ResponsetoloadNotification
{
    @Data
    public class NoteTime
    {
        private String notificationName;
        private String notificationTime;
    }

    private List<NoteTime> notifications;

    public ResponsetoloadNotification()
    {
        notifications = null;
    }

    //
    public void addNoteTime(String eventName, String noteTime)
    {
        if(notifications == null)
        {
            notifications = new ArrayList<>();
        }
        NoteTime noteTimeObj = new NoteTime();
        noteTimeObj.setNotificationName(eventName);
        noteTimeObj.setNotificationTime(noteTime);
        notifications.add(noteTimeObj);
    }
}
