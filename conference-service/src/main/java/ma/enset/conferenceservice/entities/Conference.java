package ma.enset.conferenceservice.entities;

import jakarta.persistence.*;
import lombok.*;
import ma.enset.conferenceservice.enums.ConferenceType;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "conferences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConferenceType type;

    @Column(nullable = false)
    private LocalDate date;

    private Integer duree; // durée en minutes

    private Integer nombreInscrits;

    private Double score;

    // ID du keynote (référence vers keynote-service)
    private Long keynoteId;

    @OneToMany(mappedBy = "conference", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Review> reviews;
}

