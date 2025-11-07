package br.com.saudeemacao.api.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class TokenSolicitacaoDTO {
    @NotBlank(message = "{email.notblank}")
    @Email(message = "{email.invalid}")
    private String email;

    @NotBlank(message = "{senha.notblank}")
    @Size(min = 6, message = "{senha.min.size}")
    private String senha;
}