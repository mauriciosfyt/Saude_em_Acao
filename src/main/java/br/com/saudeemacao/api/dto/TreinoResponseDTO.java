package br.com.saudeemacao.api.dto;

import br.com.saudeemacao.api.model.EnumTreino.EDiaDaSemana;
import br.com.saudeemacao.api.model.EnumTreino.ENivel;
import br.com.saudeemacao.api.model.EnumTreino.ESexo;
import br.com.saudeemacao.api.model.Exercicio;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TreinoResponseDTO {

    private String id;
    private String nome;
    private String tipoDeTreino;
    private ENivel nivel;
    private ESexo sexo;
    private Integer idadeMinima;
    private Integer idadeMaxima;
    private ResponsavelDTO responsavel; // Campo alterado para o DTO específico
    private Map<EDiaDaSemana, List<Exercicio>> exerciciosPorDia;

}