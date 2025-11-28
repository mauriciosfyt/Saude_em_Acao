package br.com.saudeemacao.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AtribuirTreinoDTO {

    @NotBlank(message = "O ID do treino é obrigatório.")
    private String treinoId;
}