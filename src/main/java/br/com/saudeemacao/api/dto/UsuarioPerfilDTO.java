// UsuarioPerfilDTO.java (updated)
package br.com.saudeemacao.api.dto;

import br.com.saudeemacao.api.model.EPerfil;
import br.com.saudeemacao.api.model.EPlano;
import br.com.saudeemacao.api.model.Usuario;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioPerfilDTO {
    private String nome;
    private String email;
    private String cpf;
    private String telefone;
    private String fotoPerfil;
    private EPerfil perfil;
    private EPlano plano;
    private LocalDateTime dataUltimoTreino;


    public UsuarioPerfilDTO(Usuario usuario) {
        this.nome = usuario.getNome();
        this.email = usuario.getEmail();
        this.cpf = usuario.getCpf();
        this.telefone = usuario.getTelefone();
        this.fotoPerfil = usuario.getFotoPerfil();
        this.perfil = usuario.getPerfil();
        this.plano = usuario.getPlano();
        this.dataUltimoTreino = usuario.getDataUltimoTreino();
    }
}