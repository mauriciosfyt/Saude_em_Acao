package br.com.saudeemacao.api.model;

import br.com.saudeemacao.api.model.EnumUsuario.ENivelAtividade;
import br.com.saudeemacao.api.model.EnumUsuario.EPerfil;
import br.com.saudeemacao.api.model.EnumUsuario.EPlano;
import br.com.saudeemacao.api.model.EnumUsuario.EStatus;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "usuarios")
public class Usuario implements UserDetails {

    @Id
    private String id;

    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
    private String nome;

    @NotBlank(message = "Email é obrigatório")
    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@(.+)$", message = "Email inválido")
    @Indexed(unique = true)
    private String email;

    @NotBlank(message = "CPF é obrigatório")
    @Indexed(unique = true, sparse = true)
    private String cpf;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).*$",
            message = "A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial"
    )
    private String senha;

    @NotBlank(message = "Telefone é obrigatório")
    @Indexed(unique = true, sparse = true)
    private String telefone;

    private String fotoPerfil;

    @NotNull(message = "Perfil é obrigatório")
    private EPerfil perfil;

    private EPlano plano;

    private LocalDateTime dataUltimoTreino;

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

    private EStatus statusPlano;
    private LocalDateTime dataInicioPlano;
    private LocalDateTime dataVencimentoPlano;

    public void setPlano(EPlano plano) {
        if (this.perfil != EPerfil.ALUNO && plano != null) {
            throw new IllegalArgumentException("Plano só é permitido para alunos");
        }
        this.plano = plano;

        if (plano != EPlano.GOLD) {
            this.idade = null;
            this.peso = null;
            this.altura = null;
            this.objetivo = null;
            this.nivelAtividade = null;
            this.statusPlano = null;
            this.dataInicioPlano = null;
            this.dataVencimentoPlano = null;
        }
    }

    public LocalDateTime getDataCadastro() {
        if (this.id == null) {
            return null;
        }
        Date timestamp = new ObjectId(this.id).getDate();
        return Instant.ofEpochMilli(timestamp.getTime())
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + perfil.name()));
    }

    @Override
    public String getPassword() {
        return senha;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }



    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}