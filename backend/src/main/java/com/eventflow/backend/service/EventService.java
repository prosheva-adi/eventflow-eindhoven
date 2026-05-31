package com.eventflow.backend.service;

import com.eventflow.backend.dto.EventRequest;
import com.eventflow.backend.model.Event;
import com.eventflow.backend.model.Venue;
import com.eventflow.backend.repository.EventRepository;
import com.eventflow.backend.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final VenueRepository venueRepository;
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

    public Event createEvent(EventRequest req) {
        System.out.println("createEvent called with venueId: " + req.getVenueId());
        Venue venue = venueRepository.findById(req.getVenueId())
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        Event event = new Event();
        event.setVenue(venue);
        event.setName(req.getName());
        event.setDescription(req.getDescription());
        event.setImageUrl(req.getImageUrl());
        event.setStartDate(req.getStartDate());
        event.setStartTime(req.getStartTime());
        event.setEndTime(req.getEndTime());
        event.setTicketPrice(req.getTicketPrice());
        event.setTicketUrl(req.getTicketUrl());
        event.setOrganiserName(req.getOrganiserName());
        event.setCategories(req.getCategories());

        Event saved = eventRepository.save(event);
        System.out.println("Event saved with id: " + saved.getId());

        Event reloaded = eventRepository.findById(saved.getId())
                .orElseThrow(() -> new RuntimeException("Event not found after save"));
        System.out.println("Calling notifyFollowers...");
        notificationService.notifyFollowers(reloaded);
        return reloaded;
    }

    public void deleteEvent(UUID id) {
        eventRepository.deleteById(id);
    }
}