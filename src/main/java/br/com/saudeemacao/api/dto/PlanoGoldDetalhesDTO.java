package br.com.saudeemacao.api.dto;

import br.com.saudeemacao.api.model.EnumUsuario.EPlano;
import br.com.saudeemacao.api.model.EnumUsuario.EStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanoGoldDetalhesDTO {

    private EStatus statusPlano;
    private EPlano tipoPlano;
    private LocalDateTime dataRenovacao;
    private LocalDateTime dataVencimento;
    private LocalDateTime dataInicioAcademia;
    private String duracaoAcademia;
}