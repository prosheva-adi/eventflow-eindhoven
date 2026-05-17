package com.eventflow.backend.controller;

import com.eventflow.backend.dto.AuthRequest;
import com.eventflow.backend.dto.AuthResponse;
import com.eventflow.backend.dto.RegisterRequest;
import com.eventflow.backend.security.JwtAuthFilter;
import com.eventflow.backend.security.JwtUtil;
import com.eventflow.backend.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private JwtAuthFilter jwtAuthFilter;

    private AuthResponse testResponse;

    @BeforeEach
    void setUp() {
        testResponse = new AuthResponse(
                "mock-jwt-token",
                UUID.randomUUID(),
                "testuser",
                "test@example.com",
                "USER"
        );
    }

    @Test
    void register_Returns200WithToken() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("testuser");
        request.setEmail("test@example.com");
        request.setPassword("password123");

        when(authService.register(any(RegisterRequest.class))).thenReturn(testResponse);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-jwt-token"))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"));

        verify(authService, times(1)).register(any(RegisterRequest.class));
    }

    @Test
    void register_WhenEmailInUse_Returns400() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("testuser");
        request.setEmail("taken@example.com");
        request.setPassword("password123");

        when(authService.register(any(RegisterRequest.class)))
                .thenThrow(new RuntimeException("Email already in use"));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_Returns200WithToken() throws Exception {
        AuthRequest request = new AuthRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");

        when(authService.login(any(AuthRequest.class))).thenReturn(testResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-jwt-token"))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"));

        verify(authService, times(1)).login(any(AuthRequest.class));
    }

    @Test
    void login_WhenInvalidCredentials_Returns400() throws Exception {
        AuthRequest request = new AuthRequest();
        request.setEmail("wrong@example.com");
        request.setPassword("wrongpassword");

        when(authService.login(any(AuthRequest.class)))
                .thenThrow(new RuntimeException("User not found"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}