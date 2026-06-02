package com.eventflow.backend.repository;

import com.eventflow.backend.model.UserFollowedVenue;
import com.eventflow.backend.model.UserFollowedVenueId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserFollowedVenueRepository extends JpaRepository<UserFollowedVenue, UserFollowedVenueId> {
    List<UserFollowedVenue> findByVenueId(UUID venueId);
}