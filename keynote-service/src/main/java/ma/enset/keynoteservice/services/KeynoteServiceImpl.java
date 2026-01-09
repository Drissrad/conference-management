package ma.enset.keynoteservice.services;

import lombok.RequiredArgsConstructor;
import ma.enset.keynoteservice.dto.KeynoteRequestDTO;
import ma.enset.keynoteservice.dto.KeynoteResponseDTO;
import ma.enset.keynoteservice.entities.Keynote;
import ma.enset.keynoteservice.mappers.KeynoteMapper;
import ma.enset.keynoteservice.repositories.KeynoteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class KeynoteServiceImpl implements KeynoteService {

    private final KeynoteRepository repository;
    private final KeynoteMapper mapper;

    private void validate(KeynoteRequestDTO dto) {
        if (dto.getNom() == null || dto.getNom().isEmpty())
            throw new RuntimeException("Nom obligatoire");
        if (dto.getPrenom() == null || dto.getPrenom().isEmpty())
            throw new RuntimeException("Prenom obligatoire");
        if (dto.getEmail() == null || dto.getEmail().isEmpty())
            throw new RuntimeException("Email obligatoire");
    }

    @Override
    public List<KeynoteResponseDTO> findAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    @Override
    public KeynoteResponseDTO findById(Long id) {
        Keynote k = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Keynote introuvable"));
        return mapper.toDTO(k);
    }

    @Override
    public KeynoteResponseDTO save(KeynoteRequestDTO dto) {
        validate(dto);
        if (repository.existsByEmail(dto.getEmail()))
            throw new RuntimeException("Email déjà utilisé");

        return mapper.toDTO(repository.save(mapper.toEntity(dto)));
    }

    @Override
    public KeynoteResponseDTO update(Long id, KeynoteRequestDTO dto) {
        validate(dto);
        Keynote k = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Keynote introuvable"));

        mapper.update(k, dto);
        return mapper.toDTO(repository.save(k));
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }
}