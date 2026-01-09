package ma.enset.keynoteservice.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KeynoteResponseDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String fonction;
}