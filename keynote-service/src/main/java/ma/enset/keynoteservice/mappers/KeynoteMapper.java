package ma.enset.keynoteservice.mappers;

import ma.enset.keynoteservice.dto.KeynoteRequestDTO;
import ma.enset.keynoteservice.dto.KeynoteResponseDTO;
import ma.enset.keynoteservice.entities.Keynote;
import org.springframework.stereotype.Component;

@Component
public class KeynoteMapper {

    public Keynote toEntity(KeynoteRequestDTO dto) {
        return Keynote.builder()
                .nom(dto.getNom())
                .prenom(dto.getPrenom())
                .email(dto.getEmail())
                .fonction(dto.getFonction())
                .build();
    }

    public void update(Keynote k, KeynoteRequestDTO dto) {
        k.setNom(dto.getNom());
        k.setPrenom(dto.getPrenom());
        k.setEmail(dto.getEmail());
        k.setFonction(dto.getFonction());
    }

    public KeynoteResponseDTO toDTO(Keynote k) {
        return KeynoteResponseDTO.builder()
                .id(k.getId())
                .nom(k.getNom())
                .prenom(k.getPrenom())
                .email(k.getEmail())
                .fonction(k.getFonction())
                .build();
    }
}