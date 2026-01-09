package ma.enset.keynoteservice.dto;


import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class KeynoteRequestDTO {
    private String nom;
    private String prenom;
    private String email;
    private String fonction;
}
