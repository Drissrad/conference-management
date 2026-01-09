package ma.enset.conferenceservice.mappers;

import ma.enset.conferenceservice.dto.*;
import ma.enset.conferenceservice.entities.Conference;
import ma.enset.conferenceservice.entities.Review;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ConferenceMapper {

    public Conference toEntity(ConferenceRequestDTO dto) {
        if (dto == null) return null;
        return Conference.builder()
                .titre(dto.getTitre())
                .type(dto.getType())
                .date(dto.getDate())
                .duree(dto.getDuree())
                .nombreInscrits(dto.getNombreInscrits())
                .score(dto.getScore())
                .keynoteId(dto.getKeynoteId())
                .build();
    }

    public ConferenceResponseDTO toResponseDTO(Conference entity) {
        if (entity == null) return null;
        return ConferenceResponseDTO.builder()
                .id(entity.getId())
                .titre(entity.getTitre())
                .type(entity.getType())
                .date(entity.getDate())
                .duree(entity.getDuree())
                .nombreInscrits(entity.getNombreInscrits())
                .score(entity.getScore())
                .keynoteId(entity.getKeynoteId())
                .reviews(entity.getReviews() != null ?
                        entity.getReviews().stream()
                                .map(this::toReviewResponseDTO)
                                .collect(Collectors.toList()) : null)
                .build();
    }

    public ConferenceResponseDTO toResponseDTO(Conference entity, KeynoteDTO keynoteDTO) {
        ConferenceResponseDTO dto = toResponseDTO(entity);
        if (dto != null) {
            dto.setKeynote(keynoteDTO);
        }
        return dto;
    }

    public List<ConferenceResponseDTO> toResponseDTOList(List<Conference> entities) {
        return entities.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public void updateEntity(Conference entity, ConferenceRequestDTO dto) {
        if (dto.getTitre() != null) entity.setTitre(dto.getTitre());
        if (dto.getType() != null) entity.setType(dto.getType());
        if (dto.getDate() != null) entity.setDate(dto.getDate());
        if (dto.getDuree() != null) entity.setDuree(dto.getDuree());
        if (dto.getNombreInscrits() != null) entity.setNombreInscrits(dto.getNombreInscrits());
        if (dto.getScore() != null) entity.setScore(dto.getScore());
        if (dto.getKeynoteId() != null) entity.setKeynoteId(dto.getKeynoteId());
    }

    // Review Mappings
    public Review toEntity(ReviewRequestDTO dto, Conference conference) {
        if (dto == null) return null;
        return Review.builder()
                .date(dto.getDate())
                .texte(dto.getTexte())
                .note(dto.getNote())
                .conference(conference)
                .build();
    }

    public ReviewResponseDTO toReviewResponseDTO(Review entity) {
        if (entity == null) return null;
        return ReviewResponseDTO.builder()
                .id(entity.getId())
                .date(entity.getDate())
                .texte(entity.getTexte())
                .note(entity.getNote())
                .conferenceId(entity.getConference() != null ? entity.getConference().getId() : null)
                .build();
    }

    public List<ReviewResponseDTO> toReviewResponseDTOList(List<Review> entities) {
        return entities.stream()
                .map(this::toReviewResponseDTO)
                .collect(Collectors.toList());
    }

    public void updateEntity(Review entity, ReviewRequestDTO dto) {
        if (dto.getDate() != null) entity.setDate(dto.getDate());
        if (dto.getTexte() != null) entity.setTexte(dto.getTexte());
        if (dto.getNote() != null) entity.setNote(dto.getNote());
    }
}

