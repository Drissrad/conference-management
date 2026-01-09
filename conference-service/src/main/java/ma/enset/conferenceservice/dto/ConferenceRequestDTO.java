package ma.enset.conferenceservice.dto;

import lombok.*;
import ma.enset.conferenceservice.enums.ConferenceType;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConferenceRequestDTO {
    private String titre;
    private ConferenceType type;
    private LocalDate date;
    private Integer duree;
    private Integer nombreInscrits;
    private Double score;
    private Long keynoteId;
}

