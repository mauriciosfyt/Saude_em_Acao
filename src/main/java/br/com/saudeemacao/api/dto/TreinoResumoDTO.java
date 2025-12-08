package br.com.saudeemacao.api.dto;

import br.com.saudeemacao.api.model.EnumTreino.ENivel;

public record TreinoResumoDTO(
        String id,
        String nome,
        String tipoDeTreino,
        ENivel nivel,
        String nomeResponsavel
) {}