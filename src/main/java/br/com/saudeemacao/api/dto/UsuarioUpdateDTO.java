package br.com.saudeemacao.api.dto;

import br.com.saudeemacao.api.model.EPlano;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UsuarioUpdateDTO {

    @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
    private String nome;

    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@(.+)$", message = "Email inválido")
    private String email;

    private String cpf;

    private String telefone;

    @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres")
    private String senha;

    private EPlano plano;

    private MultipartFile fotoPerfil;
}