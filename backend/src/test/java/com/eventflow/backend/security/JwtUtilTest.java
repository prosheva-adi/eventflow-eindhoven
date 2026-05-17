package com.eventflow.backend.security;

import com.eventflow.backend.model.enums.Role;
import com.eventflow.backend.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;
    private User testUser;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret",
                "thisIsAVeryLongSecretKeyForTestingPurposesOnly123456");
        ReflectionTestUtils.setField(jwtUtil, "expiration", 3600000L);

        testUser = new User();
        testUser.setEmail("test@example.com");
        testUser.setRole(Role.USER);
    }

    @Test
    void generateToken_ReturnsNonNullToken() {
        String token = jwtUtil.generateToken(testUser);
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void extractEmail_ReturnsCorrectEmail() {
        String token = jwtUtil.generateToken(testUser);
        assertEquals("test@example.com", jwtUtil.extractEmail(token));
    }

    @Test
    void extractRole_ReturnsCorrectRole() {
        String token = jwtUtil.generateToken(testUser);
        assertEquals("USER", jwtUtil.extractRole(token));
    }

    @Test
    void isTokenValid_WithValidToken_ReturnsTrue() {
        String token = jwtUtil.generateToken(testUser);
        assertTrue(jwtUtil.isTokenValid(token));
    }

    @Test
    void isTokenValid_WithInvalidToken_ReturnsFalse() {
        assertFalse(jwtUtil.isTokenValid("invalid.token.here"));
    }

    @Test
    void isTokenValid_WithTamperedToken_ReturnsFalse() {
        String token = jwtUtil.generateToken(testUser);
        assertFalse(jwtUtil.isTokenValid(token + "tampered"));
    }
}