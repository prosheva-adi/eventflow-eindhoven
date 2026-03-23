package com.eventflow.backend.controller;

import com.eventflow.backend.model.Venue;
import com.eventflow.backend.service.VenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/venues")
@RequiredArgsConstructor
public class VenueController {

    private final VenueService venueService;

    @GetMapping
    public List<Venue> getAllVenues() {
        return venueService.getAllVenues();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venue> getVenueById(@PathVariable UUID id) {
        return venueService.getVenueById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Venue createVenue(@RequestBody Venue venue) {
        return venueService.saveVenue(venue);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVenue(@PathVariable UUID id) {
        venueService.deleteVenue(id);
        return ResponseEntity.noContent().build();
    }
}