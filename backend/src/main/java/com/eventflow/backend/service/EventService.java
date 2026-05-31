package com.eventflow.backend.service;

import com.eventflow.backend.model.Event;
import com.eventflow.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final NotificationService notificationService;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEventById(UUID id) {
        return eventRepository.findById(id);
    }

    public Event saveEvent(Event event) {
        Event saved = eventRepository.save(event);
        notificationService.notifyFollowers(saved);
        return saved;
    }

    public void deleteEvent(UUID id) {
        eventRepository.deleteById(id);
    }
}