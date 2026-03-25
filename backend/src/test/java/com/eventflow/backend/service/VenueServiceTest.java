package com.eventflow.backend.service;

import com.eventflow.backend.model.Venue;
import com.eventflow.backend.repository.VenueRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VenueServiceTest {

    @Mock
    private VenueRepository venueRepository;

    @InjectMocks
    private VenueService venueService;

    private Venue testVenue;
    private UUID testId;

    @BeforeEach
    void setUp() {
        testId = UUID.randomUUID();
        testVenue = new Venue();
        testVenue.setId(testId);
        testVenue.setName("Test Venue");
    }

    @Test
    void getAllVenues_ReturnsListOfVenues() {
        when(venueRepository.findAll()).thenReturn(List.of(testVenue));

        List<Venue> result = venueService.getAllVenues();

        assertEquals(1, result.size());
        assertEquals("Test Venue", result.get(0).getName());
        verify(venueRepository, times(1)).findAll();
    }

    @Test
    void getVenueById_WhenExists_ReturnsVenue() {
        when(venueRepository.findById(testId)).thenReturn(Optional.of(testVenue));

        Optional<Venue> result = venueService.getVenueById(testId);

        assertTrue(result.isPresent());
        assertEquals("Test Venue", result.get().getName());
        verify(venueRepository, times(1)).findById(testId);
    }

    @Test
    void getVenueById_WhenNotExists_ReturnsEmpty() {
        when(venueRepository.findById(testId)).thenReturn(Optional.empty());

        Optional<Venue> result = venueService.getVenueById(testId);

        assertFalse(result.isPresent());
        verify(venueRepository, times(1)).findById(testId);
    }

    @Test
    void saveVenue_ReturnsSavedVenue() {
        when(venueRepository.save(testVenue)).thenReturn(testVenue);

        Venue result = venueService.saveVenue(testVenue);

        assertNotNull(result);
        assertEquals("Test Venue", result.getName());
        verify(venueRepository, times(1)).save(testVenue);
    }

    @Test
    void deleteVenue_CallsRepositoryDelete() {
        doNothing().when(venueRepository).deleteById(testId);

        venueService.deleteVenue(testId);

        verify(venueRepository, times(1)).deleteById(testId);
    }
}