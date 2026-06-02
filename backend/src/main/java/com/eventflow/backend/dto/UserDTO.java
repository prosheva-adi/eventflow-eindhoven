package com.eventflow.backend.dto;

import com.eventflow.backend.model.enums.Role;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class UserDTO {
    private UUID id;
    private String username;
    private String email;
    private Role role;
    private LocalDateTime createdAt;
}