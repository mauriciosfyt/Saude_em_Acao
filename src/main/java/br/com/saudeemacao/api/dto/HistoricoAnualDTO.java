package br.com.saudeemacao.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HistoricoAnualDTO {
    private int ano;
    private int totalExerciciosNoAno;
    private List<ResumoMensalDTO> resumoMensal;
    private List<ExercicioRealizadoDetalheDTO> historicoDetalhado;
}