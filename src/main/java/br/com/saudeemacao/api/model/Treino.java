package br.com.saudeemacao.api.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Document(collection = "treinos")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Treino {
    @Id
    private String id;
    private String nomeDoTreino;
    private String alunoId;
    private String professorId;
    private List<Exercicio> exercicios;
}