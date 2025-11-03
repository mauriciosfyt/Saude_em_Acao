package br.com.saudeemacao.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UsuarioCreateDTO {

    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
    private String nome;

    @NotBlank(message = "Email é obrigatório")
    @Pattern(
            regexp = "^[A-Za-z0-9+_.-]+@(gmail\\.com|hotmail\\.com|outlook\\.com|yahoo\\.com|icloud\\.com|uol\\.com\\.br|bol\\.com\\.br|live\\.com)$",
            message = "Email inválido. Use um email real (ex: @gmail.com, @hotmail.com, etc.)."
    )
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, message = "A senha deve ter pelo menos 6 caracteres, com uma letra maiúscula, uma minúscula, um número e um símbolo.")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).*$",
            message = "A senha deve ter pelo menos 6 caracteres, com uma letra maiúscula, uma minúscula, um número e um símbolo."
    )
    private String senha;
}