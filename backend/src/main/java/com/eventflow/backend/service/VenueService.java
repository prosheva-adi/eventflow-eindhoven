package com.eventflow.backend.service;

import com.eventflow.backend.model.User;
import com.eventflow.backend.model.UserFollowedVenue;
import com.eventflow.backend.model.UserFollowedVenueId;
import com.eventflow.backend.model.Venue;
import com.eventflow.backend.repository.UserFollowedVenueRepository;
import com.eventflow.backend.repository.UserRepository;
import com.eventflow.backend.repository.VenueRepository;
import com.eventflow.backend.security.JwtUtil;
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
    private final JwtUtil jwtUtil;

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

    public Optional<Venue> updateVenue(UUID id, Venue updatedVenue) {
        return venueRepository.findById(id).map(existing -> {
            existing.setName(updatedVenue.getName());
            existing.setDescription(updatedVenue.getDescription());
            existing.setAddress(updatedVenue.getAddress());
            existing.setLatitude(updatedVenue.getLatitude());
            existing.setLongitude(updatedVenue.getLongitude());
            existing.setImageUrl(updatedVenue.getImageUrl());
            existing.setWebsite(updatedVenue.getWebsite());
            existing.setCategory(updatedVenue.getCategory());
            return venueRepository.save(existing);
        });
    }

    public User getUserFromToken(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public boolean isFollowing(String authHeader, UUID venueId) {
        User user = getUserFromToken(authHeader);
        UserFollowedVenueId followId = new UserFollowedVenueId();
        followId.setUserId(user.getId());
        followId.setVenueId(venueId);
        return followRepository.existsById(followId);
    }

    public void followVenueByToken(String authHeader, UUID venueId) {
        User user = getUserFromToken(authHeader);
        followVenue(user.getId(), venueId);
    }

    public void unfollowVenueByToken(String authHeader, UUID venueId) {
        User user = getUserFromToken(authHeader);
        unfollowVenue(user.getId(), venueId);
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