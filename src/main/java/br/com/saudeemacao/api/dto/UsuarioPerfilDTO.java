package br.com.saudeemacao.api.dto;

import br.com.saudeemacao.api.model.Usuario;
import br.com.saudeemacao.api.model.EnumUsuario.ENivelAtividade;
import br.com.saudeemacao.api.model.EnumUsuario.EPerfil;
import br.com.saudeemacao.api.model.EnumUsuario.EPlano;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    private Integer idade;
    private Integer peso;
    private Double altura; // <-- ALTERAÇÃO AQUI: De Integer para Double
    private String objetivo;
    private ENivelAtividade nivelAtividade;


    public UsuarioPerfilDTO(Usuario usuario) {
        this.nome = usuario.getNome();
        this.email = usuario.getEmail();
        this.cpf = usuario.getCpf();
        this.telefone = usuario.getTelefone();
        this.fotoPerfil = usuario.getFotoPerfil();
        this.perfil = usuario.getPerfil();
        this.plano = usuario.getPlano();
        this.dataUltimoTreino = usuario.getDataUltimoTreino();

        if (usuario.getPlano() == EPlano.GOLD) {
            this.idade = usuario.getIdade();
            this.peso = usuario.getPeso();
            this.altura = usuario.getAltura(); // Agora esta linha funciona corretamente
            this.objetivo = usuario.getObjetivo();
            this.nivelAtividade = usuario.getNivelAtividade();
        }
    }
}