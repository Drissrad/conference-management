package ma.enset.conferenceservice.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewRequestDTO {
    private LocalDate date;
    private String texte;
    private Integer note;
    private Long conferenceId;
}

