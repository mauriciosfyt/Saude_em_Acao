package br.com.saudeemacao.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DefinirNovaSenhaDTO {

    @NotBlank(message = "A nova senha é obrigatória.")
    @Size(min = 6, message = "A senha deve ter pelo menos 6 caracteres, com uma letra maiúscula, uma minúscula, um número e um símbolo.")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).*$",
            message = "A senha deve ter pelo menos 6 caracteres, com uma letra maiúscula, uma minúscula, um número e um símbolo."
    )
    private String novaSenha;
}