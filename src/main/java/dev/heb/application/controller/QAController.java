package dev.heb.application.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@RestController
public class QAController {
    @GetMapping("/api/qa")
    public String  getQA() throws IOException {
        ClassPathResource resource = new ClassPathResource("resultado.json");
        return new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
    }
}
