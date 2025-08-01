package br.com.saudeemacao.api.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class RedefinirSenhaConfirmacaoDTO {
    @NotBlank(message = "{token.notblank}")
    private String token; // Token de acesso enviado por e-mail

    @NotBlank(message = "{senha.notblank}")
    @Size(min = 6, message = "{senha.min.size}")
    private String novaSenha; // A nova senha que o usuário deseja definir
}