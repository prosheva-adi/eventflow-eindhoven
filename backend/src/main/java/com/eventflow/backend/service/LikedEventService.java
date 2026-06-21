package com.eventflow.backend.service;

import com.eventflow.backend.dto.LikedEventResponse;
import com.eventflow.backend.model.Event;
import com.eventflow.backend.model.User;
import com.eventflow.backend.model.UserLikedEvent;
import com.eventflow.backend.model.UserLikedEventId;
import com.eventflow.backend.repository.EventRepository;
import com.eventflow.backend.repository.UserLikedEventRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LikedEventService {

    private final UserLikedEventRepository likedEventRepository;
    private final EventRepository eventRepository;

    @Transactional
    public void likeEvent(User currentUser, UUID eventId) {
        UserLikedEventId id = buildId(currentUser.getId(), eventId);

        if (likedEventRepository.existsById(id)) {
            return;
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found: " + eventId));

        UserLikedEvent ule = new UserLikedEvent();
        ule.setId(id);
        ule.setUser(currentUser);
        ule.setEvent(event);

        likedEventRepository.save(ule);
    }

    @Transactional
    public void unlikeEvent(User currentUser, UUID eventId) {
        UserLikedEventId id = buildId(currentUser.getId(), eventId);

        if (!likedEventRepository.existsById(id)) {
            throw new EntityNotFoundException("Liked event not found for event: " + eventId);
        }

        likedEventRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<LikedEventResponse> getLikedEvents(User currentUser) {
        return likedEventRepository
                .findByUserIdWithEvent(currentUser.getId())
                .stream()
                .map(LikedEventResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public boolean isLiked(User currentUser, UUID eventId) {
        return likedEventRepository.existsById(buildId(currentUser.getId(), eventId));
    }

    private UserLikedEventId buildId(UUID userId, UUID eventId) {
        UserLikedEventId id = new UserLikedEventId();
        id.setUserId(userId);
        id.setEventId(eventId);
        return id;
    }
}