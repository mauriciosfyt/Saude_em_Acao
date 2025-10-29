package br.com.saudeemacao.api.dto;

import br.com.saudeemacao.api.model.EnumUsuario.EPerfil;
import br.com.saudeemacao.api.model.EnumUsuario.EPlano;
import br.com.saudeemacao.api.model.EnumUsuario.ENivelAtividade;

public record UsuarioSaidaDTO(
        String nome,
        String email,
        String cpf,
        String telefone,
        String fotoPerfil,
        EPerfil perfil,
        EPlano plano,

        // NOVOS CAMPOS
        Integer idade,
        Integer peso,
        Integer altura,
        String objetivo,
        ENivelAtividade nivelAtividade
) {
}