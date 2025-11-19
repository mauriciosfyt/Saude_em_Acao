package br.com.saudeemacao.api.dto;

import br.com.saudeemacao.api.model.EnumTreino.ESexo;
import br.com.saudeemacao.api.model.EnumUsuario.ENivelAtividade;
import br.com.saudeemacao.api.model.EnumUsuario.EPlano;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.web.multipart.MultipartFile;

@Data
@EqualsAndHashCode(callSuper = true)
public class AlunoCreateDTO extends UsuarioCreateDTO {

    @NotBlank(message = "CPF é obrigatório")
    private String cpf;

    @NotBlank(message = "Telefone é obrigatório")
    @Pattern(regexp = "^119\\d{8}$", message = "Aceitamos apenas números de telefone com DDD 11 (São Paulo).")
    private String telefone;

    @NotNull(message = "Plano é obrigatório")
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

    private ESexo sexo;
}