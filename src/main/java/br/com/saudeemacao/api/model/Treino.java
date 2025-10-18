package br.com.saudeemacao.api.model;

import br.com.saudeemacao.api.model.EnumTreino.ENivel;
import br.com.saudeemacao.api.model.EnumTreino.ESexo;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "treinos")
public class Treino {

    @Id
    private String id;

    @NotBlank(message = "O nome do treino é obrigatório.")
    private String nome;

    @NotNull
    @DBRef
    private Usuario responsavel;

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

    @NotEmpty(message = "O treino deve conter pelo menos um exercício.")
    private List<Exercicio> exercicios;
}