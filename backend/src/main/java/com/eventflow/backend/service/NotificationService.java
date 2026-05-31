package com.eventflow.backend.service;

import com.eventflow.backend.dto.EventNotificationDTO;
import com.eventflow.backend.model.Event;
import com.eventflow.backend.model.User;
import com.eventflow.backend.model.UserFollowedVenue;
import com.eventflow.backend.repository.UserFollowedVenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserFollowedVenueRepository followRepo;
    private final JavaMailSender mailSender;

    public void notifyFollowers(Event event) {
        List<UserFollowedVenue> followers = followRepo.findByVenueId(event.getVenue().getId());

        for (UserFollowedVenue follow : followers) {
            User user = follow.getUser();

            // in-app WebSocket notification
            messagingTemplate.convertAndSendToUser(
                    user.getId().toString(),
                    "/topic/notifications",
                    new EventNotificationDTO(event)
            );

            // email notification
            sendEmailNotification(user, event);
        }
    }

    private void sendEmailNotification(User user, Event event) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(user.getEmail());
        mail.setSubject("New event at " + event.getVenue().getName() + "!");
        mail.setText(
                "Hey " + user.getUsername() + ",\n\n" +
                        event.getVenue().getName() + " just posted a new event:\n\n" +
                        "📅 " + event.getName() + "\n" +
                        "📆 " + event.getStartDate() + " at " + event.getStartTime() + "\n\n" +
                        "Check it out on EventFlow!"
        );
        mailSender.send(mail);
    }
}