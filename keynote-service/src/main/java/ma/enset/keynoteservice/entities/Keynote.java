package ma.enset.keynoteservice.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "keynotes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Keynote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false, unique = true)
    private String email;

    private String fonction;
}