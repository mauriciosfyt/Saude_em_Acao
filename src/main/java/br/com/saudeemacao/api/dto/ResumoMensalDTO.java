package br.com.saudeemacao.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResumoMensalDTO {
    private String mes;
    private long totalExercicios;
}