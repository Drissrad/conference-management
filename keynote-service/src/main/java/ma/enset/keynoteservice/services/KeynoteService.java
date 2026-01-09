package ma.enset.keynoteservice.services;

import ma.enset.keynoteservice.dto.KeynoteRequestDTO;
import ma.enset.keynoteservice.dto.KeynoteResponseDTO;

import java.util.List;

public interface KeynoteService {
    List<KeynoteResponseDTO> findAll();
    KeynoteResponseDTO findById(Long id);
    KeynoteResponseDTO save(KeynoteRequestDTO dto);
    KeynoteResponseDTO update(Long id, KeynoteRequestDTO dto);
    void delete(Long id);
}
