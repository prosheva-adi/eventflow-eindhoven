package com.eventflow.backend.repository;

import com.eventflow.backend.model.UserLikedEvent;
import com.eventflow.backend.model.UserLikedEventId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserLikedEventRepository extends JpaRepository<UserLikedEvent, UserLikedEventId> {

    @Query("SELECT ule FROM UserLikedEvent ule JOIN FETCH ule.event WHERE ule.user.id = :userId ORDER BY ule.likedAt DESC")
    List<UserLikedEvent> findByUserIdWithEvent(@Param("userId") UUID userId);
}
