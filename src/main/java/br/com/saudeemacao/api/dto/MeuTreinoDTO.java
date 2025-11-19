package br.com.saudeemacao.api.dto;

import br.com.saudeemacao.api.model.EnumTreino.EDiaDaSemana;
import br.com.saudeemacao.api.model.Exercicio;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeuTreinoDTO {

    private String nomeTreino;
    private String nomeProfessor;
    private Map<EDiaDaSemana, List<Exercicio>> exerciciosPorDia;

}