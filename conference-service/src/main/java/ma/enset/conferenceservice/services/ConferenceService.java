package ma.enset.conferenceservice.services;

import ma.enset.conferenceservice.dto.*;
import ma.enset.conferenceservice.enums.ConferenceType;

import java.util.List;

public interface ConferenceService {
    // Conference operations
    ConferenceResponseDTO createConference(ConferenceRequestDTO request);
    ConferenceResponseDTO getConferenceById(Long id);
    ConferenceResponseDTO getConferenceByIdWithKeynote(Long id);
    List<ConferenceResponseDTO> getAllConferences();
    List<ConferenceResponseDTO> getConferencesByType(ConferenceType type);
    List<ConferenceResponseDTO> getConferencesByKeynoteId(Long keynoteId);
    ConferenceResponseDTO updateConference(Long id, ConferenceRequestDTO request);
    void deleteConference(Long id);

    // Review operations
    ReviewResponseDTO addReview(Long conferenceId, ReviewRequestDTO request);
    ReviewResponseDTO getReviewById(Long id);
    List<ReviewResponseDTO> getReviewsByConferenceId(Long conferenceId);
    ReviewResponseDTO updateReview(Long id, ReviewRequestDTO request);
    void deleteReview(Long id);
}

