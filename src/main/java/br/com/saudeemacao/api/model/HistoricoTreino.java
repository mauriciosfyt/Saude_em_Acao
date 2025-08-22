package br.com.saudeemacao.api.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.util.Map;

@Document(collection = "historicos_treino")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class HistoricoTreino {
    @Id
    private String id;
    private String alunoId;
    private String treinoId;
    private String nomeDoTreino;
    private LocalDate dataConclusao;
    private int duracaoEmMinutos;
    private Map<String, String> observacoes;
}