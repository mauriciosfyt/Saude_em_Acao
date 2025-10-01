package br.com.saudeemacao.api.dto;

import br.com.saudeemacao.api.model.EPlano;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.web.multipart.MultipartFile;

@Data
@EqualsAndHashCode(callSuper = true) // Importante para herança
public class AlunoCreateDTO extends UsuarioCreateDTO {

    @NotBlank(message = "CPF é obrigatório")
    private String cpf;

    @NotBlank(message = "Telefone é obrigatório")
    private String telefone;

    @NotNull(message = "Plano é obrigatório")
    private EPlano plano;

    @NotNull(message = "Foto de perfil é obrigatória")
    private MultipartFile fotoPerfil;
}