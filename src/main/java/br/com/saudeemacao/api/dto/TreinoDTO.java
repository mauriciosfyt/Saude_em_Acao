package br.com.saudeemacao.api.dto;

import br.com.saudeemacao.api.model.EnumTreino.ENivel;
import br.com.saudeemacao.api.model.EnumTreino.ESexo;
import br.com.saudeemacao.api.model.Exercicio;
import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.List;

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

    @NotNull(message = "A frequência semanal é obrigatória.")
    @Min(value = 1, message = "A frequência semanal deve ser de no mínimo 1 vez.")
    @Max(value = 7, message = "A frequência semanal deve ser de no máximo 7 vezes.")
    private Integer frequenciaSemanal;

    @NotNull(message = "A idade mínima é obrigatória.")
    @Positive(message = "A idade mínima deve ser um valor positivo.")
    private Integer idadeMinima;

    @NotNull(message = "A idade máxima é obrigatória.")
    @Positive(message = "A idade máxima deve ser um valor positivo.")
    private Integer idadeMaxima;

    @Valid
    @NotEmpty(message = "O treino deve conter pelo menos um exercício.")
    private List<Exercicio> exercicios;

    @AssertTrue(message = "A idade máxima não pode ser menor que a idade mínima.")
    private boolean isIdadeValida() {
        if (this.idadeMinima == null || this.idadeMaxima == null) {
            return true;
        }
        return this.idadeMaxima >= this.idadeMinima;
    }
}