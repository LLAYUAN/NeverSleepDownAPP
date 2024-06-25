package org.example.backend.model;

import java.util.Set;
import java.util.HashSet;

public class ResponsetoGetAllCourseinNote {
    public class CourseInfoinNote {
        private Integer id;
        private String courseCode;
        private String courseName;

        CourseInfoinNote(Integer eventID, String courseCode, String courseName) {
            this.id = eventID;
            this.courseCode = courseCode;
            this.courseName = courseName;
        }

        CourseInfoinNote(Event event) {
            this.id = event.getEventID();
            this.courseCode = event.getCourseCode();
            this.courseName = event.getEventName();
        }

        // getters
        public Integer getId() {
            return id;
        }

        public String getCourseCode() {
            return courseCode;
        }

        public String getCourseName() {
            return courseName;
        }
    }

    private Set<CourseInfoinNote> courseInfoinNote;

    public void setCourseInfoinNote(Set<Event> events) {
        courseInfoinNote = new HashSet<>();
        for (Event event : events) {
            if (event.getType())
                continue;
            CourseInfoinNote courseInfoinNoteItem = new CourseInfoinNote(event);
            courseInfoinNote.add(courseInfoinNoteItem);
        }
    }

    public Set<CourseInfoinNote> getCourseInfoinNote() {
        return courseInfoinNote;
    }
}
