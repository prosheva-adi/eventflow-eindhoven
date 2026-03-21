package com.eventflow.backend.model;

import jakarta.persistence.Embeddable;
import lombok.Data;
import java.io.Serializable;
import java.util.UUID;

@Data
@Embeddable
public class UserLikedEventId implements Serializable {
    private UUID userId;
    private UUID eventId;
}