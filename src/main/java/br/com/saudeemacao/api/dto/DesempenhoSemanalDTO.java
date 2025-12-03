package br.com.saudeemacao.api.dto;

import br.com.saudeemacao.api.model.EnumTreino.EDiaDaSemana;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DesempenhoSemanalDTO {
    private EDiaDaSemana dia;
    private boolean realizado;
}