package dev.heb.application;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import dev.heb.application.models.QA;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;


@SpringBootApplication
public class InterviewFlashcardsSpringApplication {

    public static void main(String[] args) throws IOException {
        SpringApplication.run(InterviewFlashcardsSpringApplication.class, args);

        Map<String, List<QA>> mapTopicos = new LinkedHashMap<>();

        List<String> lines = Files.readAllLines(Paths.get("src", "main", "resources", "perguntas.txt"));

        String currentTopic = null;
        List<QA> currentList = null;
        String currentQuestion = null;

        for (String line : lines) {
            line = line.trim();

            if (line.isEmpty()) continue;

            // novo tópico ("# Topico")
            if (line.startsWith("#")) {
                currentTopic = line.substring(1).trim();
                currentList = new ArrayList<>();
                mapTopicos.put(currentTopic, currentList);
            }

            // pergunta ("? Pergunta...")
            else if (line.startsWith("?")) {
                currentQuestion = line.substring(1).trim();
            }

            // resposta ("> Resposta...")
            else if (line.startsWith(">")) {
                String resposta = line.substring(1).trim();
                if (currentTopic != null && currentList != null && currentQuestion != null) {
                    currentList.add(new QA(currentQuestion, resposta));
                }
                currentQuestion = null;
            }
        }

        // Jackson: gerar JSON bonito (pretty print)
        ObjectMapper mapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
        String json = mapper.writeValueAsString(mapTopicos);

        Files.write(Paths.get("src", "main", "resources", "resultado.json"), json.getBytes());

        System.out.println("JSON gerado com sucesso!");
    }

}
