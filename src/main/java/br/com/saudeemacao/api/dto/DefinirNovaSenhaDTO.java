package br.com.saudeemacao.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * NOVO DTO:
 * Utilizado na etapa final do fluxo de redefinição de senha.
 * Contém apenas o campo da nova senha.
 */
@Data
public class DefinirNovaSenhaDTO {
    @NotBlank(message = "A nova senha é obrigatória.")
    @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres.")
    private String novaSenha;
}