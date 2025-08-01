// UsuarioEntradaDTO.java (updated)
package br.com.saudeemacao.api.dto;

import br.com.saudeemacao.api.model.EPerfil;
import br.com.saudeemacao.api.model.EPlano;
import br.com.saudeemacao.api.model.Usuario;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record UsuarioEntradaDTO(
        @NotBlank(message = "Nome é obrigatório")
        String nome,
        @NotBlank(message = "Email é obrigatório")
        @Pattern(regexp = "^[A-Za-z0-9+_.-]+@(.+)$", message = "Email inválido")
        String email,
        @NotBlank(message = "CPF é obrigatório")
        @Pattern(regexp = "^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$", message = "CPF inválido")
        String cpf,
        @NotBlank(message = "Senha é obrigatória")
        String senha,
        @NotBlank(message = "Telefone é obrigatório")
        String telefone,
        String fotoPerfil,
        @NotNull(message = "Perfil é obrigatório")
        EPerfil perfil,
        @NotNull(message = "Plano é obrigatório")
        EPlano plano) {

    public Usuario toUsuario() {
        Usuario u = new Usuario();
        u.setNome(nome);
        u.setEmail(email);
        u.setCpf(cpf);
        u.setSenha(senha);
        u.setTelefone(telefone);
        u.setFotoPerfil(fotoPerfil);
        u.setPerfil(perfil);
        u.setPlano(plano);
        return u;
    }
}