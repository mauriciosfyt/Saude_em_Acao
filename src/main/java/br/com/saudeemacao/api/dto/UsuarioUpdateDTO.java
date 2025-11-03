package br.com.saudeemacao.api.dto;

import br.com.saudeemacao.api.model.EnumUsuario.ENivelAtividade;
import br.com.saudeemacao.api.model.EnumUsuario.EPlano;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;


@Data
public class UsuarioUpdateDTO {

    @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
    private String nome;

    @Pattern(
            regexp = "^[A-Za-z0-9+_.-]+@(gmail\\.com|hotmail\\.com|outlook\\.com|yahoo\\.com|icloud\\.com|uol\\.com\\.br|bol\\.com\\.br|live\\.com)$",
            message = "Email inválido. Use um email real (ex: @gmail.com, @hotmail.com, etc.)."
    )
    private String email;

    private String cpf;

    @Pattern(regexp = "^119\\d{8}$", message = "Aceitamos apenas números de telefone com DDD 11 (São Paulo).")
    private String telefone;

    @Size(min = 6, message = "A senha deve ter pelo menos 6 caracteres, com uma letra maiúscula, uma minúscula, um número e um símbolo.")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).*$",
            message = "A senha deve ter pelo menos 6 caracteres, com uma letra maiúscula, uma minúscula, um número e um símbolo."
    )
    private String senha;

    private EPlano plano;

    private MultipartFile fotoPerfil;

    @Min(value = 14, message = "A idade deve ser entre 14 e 100 anos.")
    @Max(value = 100, message = "A idade deve ser entre 14 e 100 anos.")
    private Integer idade;

    @Min(value = 20, message = "O peso deve estar entre 20 kg e 300 kg.")
    @Max(value = 300, message = "O peso deve estar entre 20 kg e 300 kg.")
    private Integer peso;

    @DecimalMin(value = "1.0", message = "A altura deve estar entre 1 e 3 metros.")
    @DecimalMax(value = "3.0", message = "A altura deve estar entre 1 e 3 metros.")
    private Double altura;

    @Size(min = 5, max = 200, message = "O campo objetivo deve ter entre 5 e 200 caracteres.")
    private String objetivo;

    private ENivelAtividade nivelAtividade;
}