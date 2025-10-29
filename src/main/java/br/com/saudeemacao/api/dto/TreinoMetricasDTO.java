package br.com.saudeemacao.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TreinoMetricasDTO {

    private long treinosRealizadosMesAtual;
    private LocalDateTime dataUltimoTreino;
    private long totalTreinosCompletos;
    private int diasAtivosConsecutivos;
}