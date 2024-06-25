package org.example.backend.service;

import org.example.backend.model.ChangeTable;
import org.example.backend.model.User;
import org.example.backend.repository.ChangeTableRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ChangeTableService {
    private final ChangeTableRepository changeTableRepository;

    public ChangeTableService(ChangeTableRepository changeTableRepository) {
        this.changeTableRepository = changeTableRepository;
    }

    public void saveChangeTable(ChangeTable changeTable) {
        changeTableRepository.save(changeTable);
    }
}
