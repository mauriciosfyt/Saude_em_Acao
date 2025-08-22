package br.com.saudeemacao.api.dto;

import br.com.saudeemacao.api.model.Exercicio;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class TreinoDto {
    @NotBlank(message = "O nome do treino é obrigatório")
    private String nomeDoTreino;

    @NotBlank(message = "O ID do aluno é obrigatório")
    private String alunoId;

    @NotNull(message = "A lista de exercícios não pode ser nula")
    private List<Exercicio> exercicios;
}