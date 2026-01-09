package ma.enset.conferenceservice.services;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.enset.conferenceservice.clients.KeynoteRestClient;
import ma.enset.conferenceservice.dto.*;
import ma.enset.conferenceservice.entities.Conference;
import ma.enset.conferenceservice.entities.Review;
import ma.enset.conferenceservice.enums.ConferenceType;
import ma.enset.conferenceservice.exceptions.ConferenceNotFoundException;
import ma.enset.conferenceservice.exceptions.ReviewNotFoundException;
import ma.enset.conferenceservice.mappers.ConferenceMapper;
import ma.enset.conferenceservice.repositories.ConferenceRepository;
import ma.enset.conferenceservice.repositories.ReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ConferenceServiceImpl implements ConferenceService {

    private final ConferenceRepository conferenceRepository;
    private final ReviewRepository reviewRepository;
    private final ConferenceMapper conferenceMapper;
    private final KeynoteRestClient keynoteRestClient;

    // ==================== Conference Operations ====================

    @Override
    public ConferenceResponseDTO createConference(ConferenceRequestDTO request) {
        Conference conference = conferenceMapper.toEntity(request);
        Conference savedConference = conferenceRepository.save(conference);
        log.info("Conference created with ID: {}", savedConference.getId());
        return conferenceMapper.toResponseDTO(savedConference);
    }

    @Override
    public ConferenceResponseDTO getConferenceById(Long id) {
        Conference conference = conferenceRepository.findById(id)
                .orElseThrow(() -> new ConferenceNotFoundException("Conference not found with id: " + id));
        return conferenceMapper.toResponseDTO(conference);
    }

    @Override
    @CircuitBreaker(name = "keynoteService", fallbackMethod = "getConferenceByIdFallback")
    public ConferenceResponseDTO getConferenceByIdWithKeynote(Long id) {
        Conference conference = conferenceRepository.findById(id)
                .orElseThrow(() -> new ConferenceNotFoundException("Conference not found with id: " + id));

        KeynoteDTO keynoteDTO = null;
        if (conference.getKeynoteId() != null) {
            keynoteDTO = keynoteRestClient.getKeynoteById(conference.getKeynoteId());
        }

        return conferenceMapper.toResponseDTO(conference, keynoteDTO);
    }

    public ConferenceResponseDTO getConferenceByIdFallback(Long id, Exception e) {
        log.warn("Fallback triggered for getConferenceByIdWithKeynote. Error: {}", e.getMessage());
        Conference conference = conferenceRepository.findById(id)
                .orElseThrow(() -> new ConferenceNotFoundException("Conference not found with id: " + id));
        ConferenceResponseDTO dto = conferenceMapper.toResponseDTO(conference);
        dto.setKeynote(KeynoteDTO.builder()
                .id(conference.getKeynoteId())
                .nom("Service indisponible")
                .prenom("")
                .email("")
                .fonction("")
                .build());
        return dto;
    }

    @Override
    public List<ConferenceResponseDTO> getAllConferences() {
        List<Conference> conferences = conferenceRepository.findAll();
        return conferenceMapper.toResponseDTOList(conferences);
    }

    @Override
    public List<ConferenceResponseDTO> getConferencesByType(ConferenceType type) {
        List<Conference> conferences = conferenceRepository.findByType(type);
        return conferenceMapper.toResponseDTOList(conferences);
    }

    @Override
    public List<ConferenceResponseDTO> getConferencesByKeynoteId(Long keynoteId) {
        List<Conference> conferences = conferenceRepository.findByKeynoteId(keynoteId);
        return conferenceMapper.toResponseDTOList(conferences);
    }

    @Override
    public ConferenceResponseDTO updateConference(Long id, ConferenceRequestDTO request) {
        Conference conference = conferenceRepository.findById(id)
                .orElseThrow(() -> new ConferenceNotFoundException("Conference not found with id: " + id));

        conferenceMapper.updateEntity(conference, request);
        Conference updatedConference = conferenceRepository.save(conference);
        log.info("Conference updated with ID: {}", id);
        return conferenceMapper.toResponseDTO(updatedConference);
    }

    @Override
    public void deleteConference(Long id) {
        if (!conferenceRepository.existsById(id)) {
            throw new ConferenceNotFoundException("Conference not found with id: " + id);
        }
        conferenceRepository.deleteById(id);
        log.info("Conference deleted with ID: {}", id);
    }

    // ==================== Review Operations ====================

    @Override
    public ReviewResponseDTO addReview(Long conferenceId, ReviewRequestDTO request) {
        Conference conference = conferenceRepository.findById(conferenceId)
                .orElseThrow(() -> new ConferenceNotFoundException("Conference not found with id: " + conferenceId));

        // Validate note (1-5)
        if (request.getNote() < 1 || request.getNote() > 5) {
            throw new IllegalArgumentException("Note must be between 1 and 5");
        }

        Review review = conferenceMapper.toEntity(request, conference);
        Review savedReview = reviewRepository.save(review);

        // Update conference score
        updateConferenceScore(conferenceId);

        log.info("Review added with ID: {} for Conference ID: {}", savedReview.getId(), conferenceId);
        return conferenceMapper.toReviewResponseDTO(savedReview);
    }

    @Override
    public ReviewResponseDTO getReviewById(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ReviewNotFoundException("Review not found with id: " + id));
        return conferenceMapper.toReviewResponseDTO(review);
    }

    @Override
    public List<ReviewResponseDTO> getReviewsByConferenceId(Long conferenceId) {
        List<Review> reviews = reviewRepository.findByConferenceIdOrderByDateDesc(conferenceId);
        return conferenceMapper.toReviewResponseDTOList(reviews);
    }

    @Override
    public ReviewResponseDTO updateReview(Long id, ReviewRequestDTO request) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ReviewNotFoundException("Review not found with id: " + id));

        // Validate note (1-5)
        if (request.getNote() != null && (request.getNote() < 1 || request.getNote() > 5)) {
            throw new IllegalArgumentException("Note must be between 1 and 5");
        }

        conferenceMapper.updateEntity(review, request);
        Review updatedReview = reviewRepository.save(review);

        // Update conference score
        updateConferenceScore(review.getConference().getId());

        log.info("Review updated with ID: {}", id);
        return conferenceMapper.toReviewResponseDTO(updatedReview);
    }

    @Override
    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ReviewNotFoundException("Review not found with id: " + id));

        Long conferenceId = review.getConference().getId();
        reviewRepository.deleteById(id);

        // Update conference score
        updateConferenceScore(conferenceId);

        log.info("Review deleted with ID: {}", id);
    }

    // ==================== Helper Methods ====================

    private void updateConferenceScore(Long conferenceId) {
        List<Review> reviews = reviewRepository.findByConferenceId(conferenceId);
        if (!reviews.isEmpty()) {
            double averageScore = reviews.stream()
                    .mapToInt(Review::getNote)
                    .average()
                    .orElse(0.0);

            Conference conference = conferenceRepository.findById(conferenceId).orElse(null);
            if (conference != null) {
                conference.setScore(Math.round(averageScore * 10.0) / 10.0);
                conferenceRepository.save(conference);
            }
        }
    }
}

