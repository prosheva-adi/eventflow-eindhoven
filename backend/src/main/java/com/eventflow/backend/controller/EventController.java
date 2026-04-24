package com.eventflow.backend.controller;

import com.eventflow.backend.model.Event;
import com.eventflow.backend.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable UUID id) {
        return eventService.getEventById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        return eventService.saveEvent(event);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable UUID id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(
            @PathVariable UUID id,
            @RequestBody Event updatedEvent
    ) {
        return eventService.getEventById(id)
                .map(existing -> {

                    // Basic fields
                    existing.setName(updatedEvent.getName());
                    existing.setDescription(updatedEvent.getDescription());
                    existing.setImageUrl(updatedEvent.getImageUrl());

                    // Dates & times
                    existing.setStartDate(updatedEvent.getStartDate());
                    existing.setStartTime(updatedEvent.getStartTime());
                    existing.setEndTime(updatedEvent.getEndTime());

                    // Ticket info
                    existing.setTicketPrice(updatedEvent.getTicketPrice());
                    existing.setTicketUrl(updatedEvent.getTicketUrl());

                    // Organiser
                    existing.setOrganiserName(updatedEvent.getOrganiserName());

                    // Categories (list)
                    existing.setCategories(updatedEvent.getCategories());

                    // ⚠️ Venue (important, see below)
                    existing.setVenue(updatedEvent.getVenue());

                    Event saved = eventService.saveEvent(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}