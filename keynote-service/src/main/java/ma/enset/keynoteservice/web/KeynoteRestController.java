package ma.enset.keynoteservice.web;

import lombok.RequiredArgsConstructor;
import ma.enset.keynoteservice.dto.KeynoteRequestDTO;
import ma.enset.keynoteservice.dto.KeynoteResponseDTO;
import ma.enset.keynoteservice.services.KeynoteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/keynotes")
@RequiredArgsConstructor
@CrossOrigin("*")
public class KeynoteRestController {

    private final KeynoteService service;

    @GetMapping
    public List<KeynoteResponseDTO> all() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public KeynoteResponseDTO one(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public KeynoteResponseDTO create(@RequestBody KeynoteRequestDTO dto) {
        return service.save(dto);
    }

    @PutMapping("/{id}")
    public KeynoteResponseDTO update(@PathVariable Long id,
                                     @RequestBody KeynoteRequestDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
