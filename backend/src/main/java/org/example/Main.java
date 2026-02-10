package org.example;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
public class Main {

    public static void main(String[] args) throws IOException {

        List<Map<String, List<QA>>> listaTopicos = new ArrayList<>();

        List<String> lines = Files.readAllLines(Paths.get("perguntas.txt"));

        String currentTopic = null;
        List<QA> currentList = null;
        String currentQuestion = null;

        for (String line : lines) {
            line = line.trim();

            if (line.isEmpty()) continue;

            // novo tópico ("# Topico")
            if (line.startsWith("#")) {

                // se já tinha um tópico aberto, salva ele antes de iniciar outro
                if (currentTopic != null) {
                    Map<String, List<QA>> obj = new LinkedHashMap<>();
                    obj.put(currentTopic, currentList);
                    listaTopicos.add(obj);
                }

                currentTopic = line.substring(1).trim();
                currentList = new ArrayList<>();
            }

            // pergunta ("? Pergunta...")
            else if (line.startsWith("?")) {
                currentQuestion = line.substring(1).trim();
            }

            // resposta ("> Resposta...")
            else if (line.startsWith(">")) {
                String resposta = line.substring(1).trim();
                currentList.add(new QA(currentQuestion, resposta));
                currentQuestion = null;
            }
        }

        // adicionar último tópico ao JSON
        if (currentTopic != null) {
            Map<String, List<QA>> obj = new LinkedHashMap<>();
            obj.put(currentTopic, currentList);
            listaTopicos.add(obj);
        }

        // Jackson: gerar JSON bonito (pretty print)
        ObjectMapper mapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
        String json = mapper.writeValueAsString(listaTopicos);

        Files.write(Paths.get("resultado.json"), json.getBytes());

        System.out.println("JSON gerado com sucesso!");
    }
}
