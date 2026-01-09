package ma.enset.conferenceservice.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KeynoteDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String fonction;
}

