package com.eventflow.backend.integration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class VenueIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getAllVenues_WithoutAuth_Returns200() throws Exception {
        mockMvc.perform(get("/api/venues"))
                .andExpect(status().isOk());
    }

    @Test
    void getVenueById_WithNonExistentId_Returns404() throws Exception {
        mockMvc.perform(get("/api/venues/00000000-0000-0000-0000-000000000000"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createVenue_WithoutAuth_Returns403() throws Exception {
        mockMvc.perform(post("/api/venues")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                            "name": "Test Venue",
                            "address": "Test Street 1",
                            "latitude": 51.441642,
                            "longitude": 5.469722,
                            "category": "Music"
                        }
                        """))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createVenue_WithAdminAuth_Returns200() throws Exception {
        mockMvc.perform(post("/api/venues")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                            "name": "Test Venue",
                            "address": "Test Street 1",
                            "latitude": 51.441642,
                            "longitude": 5.469722,
                            "category": "Music"
                        }
                        """))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "USER")
    void createVenue_WithUserAuth_Returns403() throws Exception {
        mockMvc.perform(post("/api/venues")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                            "name": "Test Venue",
                            "address": "Test Street 1",
                            "latitude": 51.441642,
                            "longitude": 5.469722,
                            "category": "Music"
                        }
                        """))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteVenue_WithNonExistentId_Returns204() throws Exception {
        mockMvc.perform(delete("/api/venues/00000000-0000-0000-0000-000000000000"))
                .andExpect(status().isNoContent());
    }
}
