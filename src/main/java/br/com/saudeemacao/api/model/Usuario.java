package br.com.saudeemacao.api.model;

import br.com.saudeemacao.api.model.EnumUsuario.ENivelAtividade;
import br.com.saudeemacao.api.model.EnumUsuario.EPerfil;
import br.com.saudeemacao.api.model.EnumUsuario.EPlano;
import br.com.saudeemacao.api.model.EnumUsuario.EStatus;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId; // Importação necessária
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

    // ... (campos existentes: nome, email, cpf, etc.) ...
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
    @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres")
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

    private EPlano plano; // Apenas para ALUNO

    private LocalDateTime dataUltimoTreino;

    // ... (Campos do plano Gold: idade, peso, altura, etc.) ...
    @Min(value = 14, message = "A idade mínima para o plano Gold é 14 anos.")
    @Max(value = 100, message = "A idade máxima para o plano Gold é 100 anos.")
    private Integer idade;

    @Min(value = 25, message = "O peso mínimo deve ser 25 kg.")
    @Max(value = 700, message = "O peso máximo deve ser 700 kg.")
    private Integer peso; // Em kg

    @Min(value = 100, message = "A altura mínima deve ser 100 cm.")
    @Max(value = 230, message = "A altura máxima deve ser 230 cm.")
    private Integer altura; // Em cm

    @Size(max = 300, message = "O objetivo deve ter no máximo 300 caracteres.")
    private String objetivo;

    private ENivelAtividade nivelAtividade;

    // =================================================================
    // === NOVOS CAMPOS - PARA O PAINEL DE DETALHES DO PLANO GOLD =====
    // =================================================================

    private EStatus statusPlano;
    private LocalDateTime dataInicioPlano;
    private LocalDateTime dataVencimentoPlano;


    /**
     * LÓGICA ATUALIZADA:
     * Garante que o plano só pode ser atribuído a ALUNOS.
     * Se o plano for alterado para um que não seja GOLD, todos os campos
     * específicos do plano GOLD são limpos para manter a consistência dos dados.
     */
    public void setPlano(EPlano plano) {
        if (this.perfil != EPerfil.ALUNO && plano != null) {
            throw new IllegalArgumentException("Plano só é permitido para alunos");
        }
        this.plano = plano;

        if (plano != EPlano.GOLD) {
            // Limpa dados de perfil
            this.idade = null;
            this.peso = null;
            this.altura = null;
            this.objetivo = null;
            this.nivelAtividade = null;
            // Limpa dados de status do plano
            this.statusPlano = null;
            this.dataInicioPlano = null;
            this.dataVencimentoPlano = null;
        }
    }

    /**
     * NOVO MÉTODO:
     * Calcula a data de cadastro (início na academia) a partir do ObjectId do MongoDB.
     * O ObjectId contém um timestamp de sua criação.
     * @return LocalDateTime da data de criação do usuário.
     */
    public LocalDateTime getDataCadastro() {
        if (this.id == null) {
            return null;
        }
        Date timestamp = new ObjectId(this.id).getDate();
        return Instant.ofEpochMilli(timestamp.getTime())
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
    }


    // ... (restante da classe UserDetails) ...
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