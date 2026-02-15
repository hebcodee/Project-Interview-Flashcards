package dev.heb.application.controller;

import dev.heb.application.service.QAService;
import dto.QADto;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class QAController {

    QAService service = new QAService();

    @GetMapping("/api/qa")
    public Object getQA() throws IOException {
        service.criarJson();
        ClassPathResource resource = new ClassPathResource("resultado.json");
        String json = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(json);
    }

    @PostMapping("/api/qa")
    public ResponseEntity<Void> setQA(@RequestBody QADto req) throws IOException {
        service.addNewQA(req);
        return ResponseEntity.ok().build();
    }
}
