package com.eventflow.backend.dto;

import com.eventflow.backend.model.enums.Category;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Data
public class EventRequest {
    private UUID venueId;
    private String name;
    private String description;
    private String imageUrl;
    private LocalDate startDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private BigDecimal ticketPrice;
    private String ticketUrl;
    private String organiserName;
    private List<Category> categories;
}