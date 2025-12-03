package br.com.saudeemacao.api.dto;

import br.com.saudeemacao.api.model.EnumTreino.EDiaDaSemana;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TreinoRealizadoDTO {

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss") // Formata a data para ficar legível
    private LocalDateTime dataRealizacao;

    private EDiaDaSemana dia;
}