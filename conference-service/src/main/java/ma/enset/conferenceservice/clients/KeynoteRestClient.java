package ma.enset.conferenceservice.clients;

import ma.enset.conferenceservice.dto.KeynoteDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "keynote-service", url = "${keynote-service.url}")
public interface KeynoteRestClient {

    @GetMapping("/api/keynotes/{id}")
    KeynoteDTO getKeynoteById(@PathVariable("id") Long id);

    @GetMapping("/api/keynotes")
    List<KeynoteDTO> getAllKeynotes();
}

