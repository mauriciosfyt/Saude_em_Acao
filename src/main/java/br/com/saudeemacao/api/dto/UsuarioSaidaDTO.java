package br.com.saudeemacao.api.dto;

import br.com.saudeemacao.api.model.EnumUsuario.ENivelAtividade;
import br.com.saudeemacao.api.model.EnumUsuario.EPerfil;
import br.com.saudeemacao.api.model.EnumUsuario.EPlano;
import org.springframework.data.annotation.Id;

public record UsuarioSaidaDTO(
        @Id String id,
        String nome,
        String email,
        String cpf,
        String telefone,
        String fotoPerfil,
        EPerfil perfil,
        EPlano plano,
        Integer idade,
        Integer peso,
        Double altura,
        String objetivo,
        ENivelAtividade nivelAtividade
) {
}