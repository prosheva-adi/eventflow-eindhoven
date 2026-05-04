package com.eventflow.backend.dto;

import com.eventflow.backend.model.UserLikedEvent;
import com.eventflow.backend.model.Event;
import com.eventflow.backend.model.enums.Category;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public record LikedEventResponse(
        UUID eventId,
        String name,
        String description,
        String imageUrl,
        LocalDate startDate,
        LocalTime startTime,
        LocalTime endTime,
        BigDecimal ticketPrice,
        String ticketUrl,
        String organiserName,
        List<Category> categories,
        LocalDateTime likedAt
) {
    public static LikedEventResponse from(UserLikedEvent ule) {
        Event e = ule.getEvent();
        return new LikedEventResponse(
                e.getId(),
                e.getName(),
                e.getDescription(),
                e.getImageUrl(),
                e.getStartDate(),
                e.getStartTime(),
                e.getEndTime(),
                e.getTicketPrice(),
                e.getTicketUrl(),
                e.getOrganiserName(),
                e.getCategories(),
                ule.getLikedAt()
        );
    }
}