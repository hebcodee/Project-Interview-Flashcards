package dev.heb.application.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import dev.heb.application.models.QA;
import dto.QADto;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class QAService {

    public void criarJson() throws IOException {
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

    public void addNewQA(QADto req) throws IOException {
        Path path = Paths.get("src", "main", "resources", "perguntas.txt");
        List<String> linhas = new ArrayList<>(Files.readAllLines(path));

        String marcadorTopico = "#" + req.topico();
        int indexTopico = -1;

        // 1. Procurar o tópico
        for (int i = 0; i < linhas.size(); i++) {
            if (linhas.get(i).trim().equalsIgnoreCase(marcadorTopico)) {
                indexTopico = i;
                break;
            }
        }

        if (indexTopico == -1) {
            // 2. Se o tópico não existe, criar no final
            linhas.add("");
            linhas.add(marcadorTopico);
            indexTopico = linhas.size() - 1;
        }

        // 3. Encontrar fim do tópico (antes do próximo "#OutroTopico")
        int insertIndex = linhas.size();
        for (int i = indexTopico + 1; i < linhas.size(); i++) {
            if (linhas.get(i).startsWith("#")) {
                insertIndex = i;
                break;
            }
        }

        // 4. Inserir pergunta e resposta
        List<String> bloco = List.of(
                "?" + req.pergunta(),
                req.resposta().isEmpty() ? ">" : ">" + req.resposta()
        );

        linhas.addAll(insertIndex, bloco);

        // 5. Reescrever o arquivo
        Files.write(path, linhas);
    }
}

