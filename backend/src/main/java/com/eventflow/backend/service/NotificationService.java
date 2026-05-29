package com.eventflow.backend.service;

import com.eventflow.backend.dto.EventNotificationDTO;
import com.eventflow.backend.model.Event;
import com.eventflow.backend.model.UserFollowedVenue;
import com.eventflow.backend.repository.UserFollowedVenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserFollowedVenueRepository followRepo;

    public void notifyFollowers(Event event) {
        List<UserFollowedVenue> followers = followRepo.findByVenueId(event.getVenue().getId());

        for (UserFollowedVenue follow : followers) {
            String userId = follow.getUser().getId().toString();
            messagingTemplate.convertAndSendToUser(
                    userId,
                    "/topic/notifications",
                    new EventNotificationDTO(event)
            );
        }
    }
}