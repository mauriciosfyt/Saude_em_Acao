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
    private LocalDateTime dataRenovacao; // Data em que o plano será renovado
    private LocalDateTime dataVencimento; // Data de expiração do plano atual
    private LocalDateTime dataInicioAcademia; // Data de cadastro do usuário
    private String duracaoAcademia; // Tempo total na academia (ex: "1 ano, 2 meses e 5 dias")
}