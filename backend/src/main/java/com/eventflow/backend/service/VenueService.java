package com.eventflow.backend.service;

import com.eventflow.backend.model.User;
import com.eventflow.backend.model.UserFollowedVenue;
import com.eventflow.backend.model.UserFollowedVenueId;
import com.eventflow.backend.model.Venue;
import com.eventflow.backend.repository.UserRepository;
import com.eventflow.backend.repository.UserFollowedVenueRepository;
import com.eventflow.backend.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VenueService {

    private final VenueRepository venueRepository;
    private final UserRepository userRepository;
    private final UserFollowedVenueRepository followRepository;

    public List<Venue> getAllVenues() {
        return venueRepository.findAll();
    }

    public Optional<Venue> getVenueById(UUID id) {
        return venueRepository.findById(id);
    }

    public Venue saveVenue(Venue venue) {
        return venueRepository.save(venue);
    }

    public void deleteVenue(UUID id) {
        venueRepository.deleteById(id);
    }

    public void followVenue(UUID userId, UUID venueId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        UserFollowedVenueId id = new UserFollowedVenueId();
        id.setUserId(userId);
        id.setVenueId(venueId);

        if (!followRepository.existsById(id)) {
            UserFollowedVenue follow = new UserFollowedVenue();
            follow.setId(id);
            follow.setUser(user);
            follow.setVenue(venue);
            followRepository.save(follow);
        }
    }

    public void unfollowVenue(UUID userId, UUID venueId) {
        UserFollowedVenueId id = new UserFollowedVenueId();
        id.setUserId(userId);
        id.setVenueId(venueId);
        followRepository.deleteById(id);
    }
}