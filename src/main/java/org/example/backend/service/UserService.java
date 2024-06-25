package org.example.backend.service;

import org.example.backend.model.EventTable;
import org.example.backend.model.User;
import org.example.backend.repository.EventTableRepository;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.example.backend.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Set;


@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final EventTableRepository eventTableRepository;

    @Autowired
    public UserService(UserRepository userRepository, EventTableRepository eventTableRepository) {
        this.userRepository = userRepository;
        this.eventTableRepository = eventTableRepository;
    }

    public User isPasswardCorrect(String userID, String password) {
        User user = userRepository.findByUserID(userID);
        if(user!=null) {
            if(user.getPassword().equals(password)) {
                return user;
            }
        }
        return null;
    }

    public User getUserByUserID(String userID) {
        return userRepository.findByUserID(userID);
    }

    public void updateUser(User user) {
        userRepository.save(user);
    }

    //这个saveUser用来检查是否存在相同的userID，如果存在则返回false，否则存入数据并返回true
    public boolean saveUser(User user) {
        Logger log = org.slf4j.LoggerFactory.getLogger(UserService.class);
        log.info("to here 1");
        if(userRepository.findByUserID(user.getUserID())==null) {
            log.info("to here 2");
            userRepository.save(user);
            log.info("to here 3");
            return true;
        }
        else {
            return false;
        }
    }

    public Set<EventTable> getEventTablesByuserID(String userID) {
        User user = userRepository.findByUserID(userID);
        final Logger log = org.slf4j.LoggerFactory.getLogger(UserService.class);
        log.info("tohere1");
        log.info(user.getUserID());
//        if (user != null) {
        return user.getEventTables();
//        }
//        return null; // or return an empty set if preferred
    }
}