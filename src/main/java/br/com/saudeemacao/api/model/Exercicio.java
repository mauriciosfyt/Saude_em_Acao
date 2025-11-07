package br.com.saudeemacao.api.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Exercicio {

    @NotBlank(message = "O nome do exercício é obrigatório.")
    private String nome;

    @NotNull(message = "O número de séries é obrigatório.")
    @Positive(message = "O número de séries deve ser positivo.")
    private Integer series;

    @NotNull(message = "O número de repetições é obrigatório.")
    @Positive(message = "O número de repetições deve ser positivo.")
    private Integer repeticoes;

    @NotNull(message = "A carga é obrigatória.")
    @Positive(message = "A carga deve ser um valor positivo.")
    private Integer carga;

    @NotNull(message = "O intervalo de descanso é obrigatório.")
    private LocalTime intervalo;

    private String observacao;

    @URL(message = "O campo 'img' deve ser uma URL válida.")
    private String img;
}