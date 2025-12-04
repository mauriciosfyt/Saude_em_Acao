package br.com.saudeemacao.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExercicioRealizadoDetalheDTO {
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    private LocalDateTime dataRealizacao;
    private String nomeTreino;
    private String diaDaSemana;
    private String nomeExercicio;
    private Integer series;
    private Integer repeticoes;
    private Integer carga;
}