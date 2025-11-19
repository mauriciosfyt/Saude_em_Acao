package br.com.saudeemacao.api.dto;

import br.com.saudeemacao.api.model.EnumTreino.EDiaDaSemana;
import br.com.saudeemacao.api.model.EnumTreino.ENivel;
import br.com.saudeemacao.api.model.EnumTreino.ESexo;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Data
public class TreinoDTO {

    @NotBlank(message = "O nome do treino é obrigatório.")
    private String nome;

    @NotBlank(message = "O tipo de treino é obrigatório.")
    private String tipoDeTreino;

    @NotNull(message = "O nível do treino é obrigatório.")
    private ENivel nivel;

    @NotNull(message = "O sexo alvo do treino é obrigatório.")
    private ESexo sexo;

    @NotNull(message = "A idade mínima é obrigatória.")
    @Positive(message = "A idade mínima deve ser um valor positivo.")
    private Integer idadeMinima;

    @NotNull(message = "A idade máxima é obrigatória.")
    @Positive(message = "A idade máxima deve ser um valor positivo.")
    private Integer idadeMaxima;

    @Valid
    @NotEmpty(message = "O treino deve conter exercícios para pelo menos um dia da semana.")
    private Map<EDiaDaSemana, List<ExercicioDTO>> exerciciosPorDia;


    public TreinoDTO() {
        this.exerciciosPorDia = new EnumMap<>(EDiaDaSemana.class);
        for (EDiaDaSemana dia : EDiaDaSemana.values()) {
            this.exerciciosPorDia.put(dia, new ArrayList<>());
        }
    }

    @AssertTrue(message = "A idade máxima não pode ser menor que a idade mínima.")
    private boolean isIdadeValida() {
        if (this.idadeMinima == null || this.idadeMaxima == null) {
            return true;
        }
        return this.idadeMaxima >= this.idadeMinima;
    }
}