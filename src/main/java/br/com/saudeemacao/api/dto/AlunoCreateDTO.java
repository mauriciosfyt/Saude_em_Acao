package br.com.saudeemacao.api.dto;

import br.com.saudeemacao.api.model.EnumUsuario.ENivelAtividade;
import br.com.saudeemacao.api.model.EnumUsuario.EPlano;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.web.multipart.MultipartFile;

@Data
@EqualsAndHashCode(callSuper = true)
public class AlunoCreateDTO extends UsuarioCreateDTO {

    @NotBlank(message = "CPF é obrigatório")
    private String cpf;

    @NotBlank(message = "Telefone é obrigatório")
    private String telefone;

    @NotNull(message = "Plano é obrigatório")
    private EPlano plano;

    private MultipartFile fotoPerfil;

    // =================================================================
    // === NOVOS CAMPOS - Opcionais no DTO, mas validados no serviço
    // === se o plano for GOLD.
    // =================================================================

    private Integer idade;
    private Integer peso;
    private Integer altura;
    private String objetivo;
    private ENivelAtividade nivelAtividade;
}