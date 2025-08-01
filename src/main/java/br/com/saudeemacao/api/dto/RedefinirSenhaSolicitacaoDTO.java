package br.com.saudeemacao.api.dto;

import lombok.Data;
import jakarta.validation.constraints.Email; // Importar para validação de e-mail
import jakarta.validation.constraints.NotBlank; // Importar para garantir que não seja vazio

@Data
public class RedefinirSenhaSolicitacaoDTO {
    @NotBlank(message = "{email.notblank}")
    @Email(message = "{email.invalid}")
    private String email;
}