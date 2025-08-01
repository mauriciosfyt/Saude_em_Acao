// UsuarioSaidaDTO.java (updated)
package br.com.saudeemacao.api.dto;

import br.com.saudeemacao.api.model.EPerfil;
import br.com.saudeemacao.api.model.EPlano;

public record UsuarioSaidaDTO(
        String nome,
        String email,
        String cpf,
        String telefone,
        String fotoPerfil,
        EPerfil perfil,
        EPlano plano) {
}