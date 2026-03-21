package com.eventflow.backend.repository;

import com.eventflow.backend.model.UserLikedEvent;
import com.eventflow.backend.model.UserLikedEventId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserLikedEventRepository extends JpaRepository<UserLikedEvent, UserLikedEventId> {
}