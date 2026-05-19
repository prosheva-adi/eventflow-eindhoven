package com.eventflow.backend.controller;

import com.eventflow.backend.dto.LikedEventResponse;
import com.eventflow.backend.model.Event;
import com.eventflow.backend.model.User;
import com.eventflow.backend.service.EventService;
import com.eventflow.backend.service.LikedEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final LikedEventService likedEventService;

    // -------------------------------------------------------------------------
    // Event CRUD
    // -------------------------------------------------------------------------

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
                    existing.setName(updatedEvent.getName());
                    existing.setDescription(updatedEvent.getDescription());
                    existing.setImageUrl(updatedEvent.getImageUrl());
                    existing.setStartDate(updatedEvent.getStartDate());
                    existing.setStartTime(updatedEvent.getStartTime());
                    existing.setEndTime(updatedEvent.getEndTime());
                    existing.setTicketPrice(updatedEvent.getTicketPrice());
                    existing.setTicketUrl(updatedEvent.getTicketUrl());
                    existing.setOrganiserName(updatedEvent.getOrganiserName());
                    existing.setCategories(updatedEvent.getCategories());
                    existing.setVenue(updatedEvent.getVenue());
                    return ResponseEntity.ok(eventService.saveEvent(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // -------------------------------------------------------------------------
    // Like / Unlike
    // -------------------------------------------------------------------------

    /** POST /api/events/{eventId}/like  — like an event */
    @PostMapping("/{eventId}/like")
    public ResponseEntity<Void> likeEvent(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID eventId
    ) {
        likedEventService.likeEvent(currentUser, eventId);
        return ResponseEntity.noContent().build();
    }

    /** DELETE /api/events/{eventId}/like  — unlike an event */
    @DeleteMapping("/{eventId}/like")
    public ResponseEntity<Void> unlikeEvent(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID eventId
    ) {
        likedEventService.unlikeEvent(currentUser, eventId);
        return ResponseEntity.noContent().build();
    }

    /** GET /api/events/{eventId}/like  — check if current user liked this event */
    @GetMapping("/{eventId}/like")
    public ResponseEntity<Map<String, Boolean>> isLiked(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID eventId
    ) {
        return ResponseEntity.ok(Map.of("liked", likedEventService.isLiked(currentUser, eventId)));
    }

    /** GET /api/events/liked  — get all events liked by current user */
    @GetMapping("/liked")
    public ResponseEntity<List<LikedEventResponse>> getLikedEvents(
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(likedEventService.getLikedEvents(currentUser));
    }
}