package br.com.saudeemacao.api.dto;
import br.com.saudeemacao.api.model.EnumTreino.ENivel;
import br.com.saudeemacao.api.model.EnumUsuario.*;

public record UsuarioSaidaDTO(
        String id,
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
        ENivel nivelAtividade, // Voltou ao original
        boolean possuiTreino // Voltou ao original
) {}