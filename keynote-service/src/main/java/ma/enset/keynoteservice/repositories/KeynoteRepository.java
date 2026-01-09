package ma.enset.keynoteservice.repositories;

import ma.enset.keynoteservice.entities.Keynote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface KeynoteRepository extends JpaRepository<Keynote, Long> {
    Optional<Keynote> findByEmail(String email);
    boolean existsByEmail(String email);
}