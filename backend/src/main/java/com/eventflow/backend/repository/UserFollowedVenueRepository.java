package com.eventflow.backend.repository;

import com.eventflow.backend.model.UserFollowedVenue;
import com.eventflow.backend.model.UserFollowedVenueId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserFollowedVenueRepository extends JpaRepository<UserFollowedVenue, UserFollowedVenueId> {
}