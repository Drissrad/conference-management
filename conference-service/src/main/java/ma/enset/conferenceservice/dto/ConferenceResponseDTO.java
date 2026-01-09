package ma.enset.conferenceservice.dto;

import lombok.*;
import ma.enset.conferenceservice.enums.ConferenceType;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConferenceResponseDTO {
    private Long id;
    private String titre;
    private ConferenceType type;
    private LocalDate date;
    private Integer duree;
    private Integer nombreInscrits;
    private Double score;
    private Long keynoteId;
    private KeynoteDTO keynote;
    private List<ReviewResponseDTO> reviews;
}

