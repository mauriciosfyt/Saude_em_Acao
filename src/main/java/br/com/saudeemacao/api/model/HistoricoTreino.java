package br.com.saudeemacao.api.model;

import br.com.saudeemacao.api.model.EnumTreino.EDiaDaSemana;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "historico_treinos")
public class HistoricoTreino {

    @Id
    private String id;

    @DBRef
    private Usuario aluno;

    @DBRef
    private Treino treino;

    private LocalDateTime dataRealizacao;

    private EDiaDaSemana diaDaSemanaConcluido;
}