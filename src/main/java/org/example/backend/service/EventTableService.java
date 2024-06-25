package org.example.backend.service;

import org.example.backend.model.*;
import org.example.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.example.backend.repository.EventTableRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

@Service
@Transactional
public class EventTableService {

    private final EventTableRepository eventTableRepository;
    private final CourseTimeTableRepository courseTimeTableRepository;
    private final EventService eventService;

    @Autowired
    public EventTableService(EventTableRepository eventTableRepository, CourseTimeTableRepository courseTimeTableRepository,EventService eventService) {
        this.eventTableRepository = eventTableRepository;
        this.courseTimeTableRepository = courseTimeTableRepository;
        this.eventService = eventService;
    }

    public long countByUser(User user) {
        return eventTableRepository.countByUser(user);
    }

    public EventTable getByTableID(Integer tableID) {
        return eventTableRepository.getByTableID(tableID);
    }

    public List<EventTable> findByUser(User user) {
        return eventTableRepository.findByUser(user);
    }

    public List<EventTable> findByTableNameContaining(String tableName, User user) {
        return eventTableRepository.findByTableNameContainingAndUser(tableName, user);
    }

    public void saveEventTable(EventTable eventTable) {
        eventTableRepository.save(eventTable);
    }

    public void deleteByTableID(Integer tableID) {
        //删除一个table的时候，要连带着把这个table对应的coursetimetable，event，inventory等等全部删除
        final Logger log = Logger.getLogger(EventTableService.class.getName());
        EventTable eventTable = eventTableRepository.getByTableID(tableID);
//        eventTable.detach();
        delete(eventTable);
        log.info("Deleting event table with tableID: " + tableID);
    }

    public void delete(EventTable eventTable) {
//        eventTable.detach();
        //inventory要删，event也要删（event删除的时候要删除timeconnection和对应的eventtime），coursetimetable也要删
        //TODO；inventory中所有event删除
//        List<Event> eventsToDelete = new ArrayList<>();
//        for (Event event : eventTable.getEvents()) {
//            eventsToDelete.add(event);
//        }
//        // 删除临时集合中的 EventTime
//        for (Event event : eventsToDelete) {
//            eventTable.getEvents().remove(event);
//            eventService.delete(event);
//        }
        eventTableRepository.delete(eventTable);
    }
}
