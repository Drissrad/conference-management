package ma.enset.conferenceservice.web;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Conference", description = "Conference Management API")
@CrossOrigin("*")
public class ConferenceRestController {

    private final ConferenceService conferenceService;

    // ==================== Conference Endpoints ====================

    @Operation(summary = "Create a new conference")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Conference created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    @PostMapping
    public ResponseEntity<ConferenceResponseDTO> createConference(@RequestBody ConferenceRequestDTO request) {
        ConferenceResponseDTO response = conferenceService.createConference(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "Get all conferences")
    @GetMapping
    public ResponseEntity<List<ConferenceResponseDTO>> getAllConferences() {
        List<ConferenceResponseDTO> conferences = conferenceService.getAllConferences();
        return ResponseEntity.ok(conferences);
    }

    @Operation(summary = "Get conference by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Conference found"),
            @ApiResponse(responseCode = "404", description = "Conference not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ConferenceResponseDTO> getConferenceById(
            @Parameter(description = "Conference ID") @PathVariable Long id) {
        ConferenceResponseDTO conference = conferenceService.getConferenceById(id);
        return ResponseEntity.ok(conference);
    }

    @Operation(summary = "Get conference by ID with Keynote details")
    @GetMapping("/{id}/full")
    public ResponseEntity<ConferenceResponseDTO> getConferenceByIdWithKeynote(
            @Parameter(description = "Conference ID") @PathVariable Long id) {
        ConferenceResponseDTO conference = conferenceService.getConferenceByIdWithKeynote(id);
        return ResponseEntity.ok(conference);
    }

    @Operation(summary = "Get conferences by type")
    @GetMapping("/type/{type}")
    public ResponseEntity<List<ConferenceResponseDTO>> getConferencesByType(
            @Parameter(description = "Conference type (ACADEMIQUE or COMMERCIALE)") @PathVariable ConferenceType type) {
        List<ConferenceResponseDTO> conferences = conferenceService.getConferencesByType(type);
        return ResponseEntity.ok(conferences);
    }

    @Operation(summary = "Get conferences by Keynote ID")
    @GetMapping("/keynote/{keynoteId}")
    public ResponseEntity<List<ConferenceResponseDTO>> getConferencesByKeynoteId(
            @Parameter(description = "Keynote ID") @PathVariable Long keynoteId) {
        List<ConferenceResponseDTO> conferences = conferenceService.getConferencesByKeynoteId(keynoteId);
        return ResponseEntity.ok(conferences);
    }

    @Operation(summary = "Update a conference")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Conference updated successfully"),
            @ApiResponse(responseCode = "404", description = "Conference not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<ConferenceResponseDTO> updateConference(
            @Parameter(description = "Conference ID") @PathVariable Long id,
            @RequestBody ConferenceRequestDTO request) {
        ConferenceResponseDTO response = conferenceService.updateConference(id, request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Delete a conference")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Conference deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Conference not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConference(
            @Parameter(description = "Conference ID") @PathVariable Long id) {
        conferenceService.deleteConference(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== Review Endpoints ====================

    @Operation(summary = "Add a review to a conference")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Review added successfully"),
            @ApiResponse(responseCode = "404", description = "Conference not found"),
            @ApiResponse(responseCode = "400", description = "Invalid note (must be 1-5)")
    })
    @PostMapping("/{conferenceId}/reviews")
    public ResponseEntity<ReviewResponseDTO> addReview(
            @Parameter(description = "Conference ID") @PathVariable Long conferenceId,
            @RequestBody ReviewRequestDTO request) {
        ReviewResponseDTO response = conferenceService.addReview(conferenceId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "Get all reviews for a conference")
    @GetMapping("/{conferenceId}/reviews")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsByConferenceId(
            @Parameter(description = "Conference ID") @PathVariable Long conferenceId) {
        List<ReviewResponseDTO> reviews = conferenceService.getReviewsByConferenceId(conferenceId);
        return ResponseEntity.ok(reviews);
    }

    @Operation(summary = "Get review by ID")
    @GetMapping("/reviews/{id}")
    public ResponseEntity<ReviewResponseDTO> getReviewById(
            @Parameter(description = "Review ID") @PathVariable Long id) {
        ReviewResponseDTO review = conferenceService.getReviewById(id);
        return ResponseEntity.ok(review);
    }

    @Operation(summary = "Update a review")
    @PutMapping("/reviews/{id}")
    public ResponseEntity<ReviewResponseDTO> updateReview(
            @Parameter(description = "Review ID") @PathVariable Long id,
            @RequestBody ReviewRequestDTO request) {
        ReviewResponseDTO response = conferenceService.updateReview(id, request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Delete a review")
    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<Void> deleteReview(
            @Parameter(description = "Review ID") @PathVariable Long id) {
        conferenceService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}

