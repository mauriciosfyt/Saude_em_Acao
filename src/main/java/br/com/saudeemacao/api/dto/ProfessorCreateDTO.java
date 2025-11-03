package br.com.saudeemacao.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.web.multipart.MultipartFile;

@Data
@EqualsAndHashCode(callSuper = true)
public class ProfessorCreateDTO extends UsuarioCreateDTO {

    @NotBlank(message = "CPF é obrigatório")
    private String cpf;

    @NotBlank(message = "Telefone é obrigatório")
    @Pattern(regexp = "^119\\d{8}$", message = "Aceitamos apenas números de telefone com DDD 11 (São Paulo).")
    private String telefone;

    private MultipartFile fotoPerfil;
}