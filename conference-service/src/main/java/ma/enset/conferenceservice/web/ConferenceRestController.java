package ma.enset.conferenceservice.web;

import lombok.RequiredArgsConstructor;
import ma.enset.conferenceservice.dto.*;
import ma.enset.conferenceservice.enums.ConferenceType;
import ma.enset.conferenceservice.services.ConferenceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conferences")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ConferenceRestController {

    private final ConferenceService conferenceService;

    // ==================== Conference Endpoints ====================

    @PostMapping
    public ResponseEntity<ConferenceResponseDTO> createConference(@RequestBody ConferenceRequestDTO request) {
        ConferenceResponseDTO response = conferenceService.createConference(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ConferenceResponseDTO>> getAllConferences() {
        List<ConferenceResponseDTO> conferences = conferenceService.getAllConferences();
        return ResponseEntity.ok(conferences);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConferenceResponseDTO> getConferenceById(@PathVariable Long id) {
        ConferenceResponseDTO conference = conferenceService.getConferenceById(id);
        return ResponseEntity.ok(conference);
    }

    @GetMapping("/{id}/full")
    public ResponseEntity<ConferenceResponseDTO> getConferenceByIdWithKeynote(@PathVariable Long id) {
        ConferenceResponseDTO conference = conferenceService.getConferenceByIdWithKeynote(id);
        return ResponseEntity.ok(conference);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<ConferenceResponseDTO>> getConferencesByType(@PathVariable ConferenceType type) {
        List<ConferenceResponseDTO> conferences = conferenceService.getConferencesByType(type);
        return ResponseEntity.ok(conferences);
    }

    @GetMapping("/keynote/{keynoteId}")
    public ResponseEntity<List<ConferenceResponseDTO>> getConferencesByKeynoteId(@PathVariable Long keynoteId) {
        List<ConferenceResponseDTO> conferences = conferenceService.getConferencesByKeynoteId(keynoteId);
        return ResponseEntity.ok(conferences);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ConferenceResponseDTO> updateConference(@PathVariable Long id, @RequestBody ConferenceRequestDTO request) {
        ConferenceResponseDTO response = conferenceService.updateConference(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConference(@PathVariable Long id) {
        conferenceService.deleteConference(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== Review Endpoints ====================

    @PostMapping("/{conferenceId}/reviews")
    public ResponseEntity<ReviewResponseDTO> addReview(@PathVariable Long conferenceId, @RequestBody ReviewRequestDTO request) {
        ReviewResponseDTO response = conferenceService.addReview(conferenceId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{conferenceId}/reviews")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsByConferenceId(@PathVariable Long conferenceId) {
        List<ReviewResponseDTO> reviews = conferenceService.getReviewsByConferenceId(conferenceId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/reviews/{id}")
    public ResponseEntity<ReviewResponseDTO> getReviewById(@PathVariable Long id) {
        ReviewResponseDTO review = conferenceService.getReviewById(id);
        return ResponseEntity.ok(review);
    }

    @PutMapping("/reviews/{id}")
    public ResponseEntity<ReviewResponseDTO> updateReview(@PathVariable Long id, @RequestBody ReviewRequestDTO request) {
        ReviewResponseDTO response = conferenceService.updateReview(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        conferenceService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}

