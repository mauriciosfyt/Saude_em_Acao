package br.com.saudeemacao.api.dto;

import br.com.saudeemacao.api.model.EnumUsuario.ENivelAtividade;
import br.com.saudeemacao.api.model.EnumUsuario.EPerfil;
import br.com.saudeemacao.api.model.EnumUsuario.EPlano;

public record UsuarioSaidaDTO(
        String nome,
        String email,
        String cpf,
        String telefone,
        String fotoPerfil,
        EPerfil perfil,
        EPlano plano,
        Integer idade,
        Integer peso,
        Double altura, // <-- ALTERAÇÃO AQUI: De Integer para Double
        String objetivo,
        ENivelAtividade nivelAtividade
) {
}