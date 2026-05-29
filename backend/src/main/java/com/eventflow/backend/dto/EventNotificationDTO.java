package com.eventflow.backend.dto;

import com.eventflow.backend.model.Event;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
public class EventNotificationDTO {
    private UUID eventId;
    private String name;
    private String venueName;
    private UUID venueId;
    private LocalDate startDate;
    private LocalTime startTime;

    public EventNotificationDTO(Event event) {
        this.eventId = event.getId();
        this.name = event.getName();
        this.venueName = event.getVenue().getName();
        this.venueId = event.getVenue().getId();
        this.startDate = event.getStartDate();
        this.startTime = event.getStartTime();
    }
}