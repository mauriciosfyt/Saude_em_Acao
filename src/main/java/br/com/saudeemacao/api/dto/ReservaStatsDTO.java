// src/main/java/br/com/saudeemacao/api/dto/ReservaStatsDTO.java
package br.com.saudeemacao.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservaStatsDTO {
    private long totalPendentes;
    private long totalAprovadas;
    private long aprovadasHoje;
    private long totalCanceladas; // Este campo inclui reservas canceladas e expiradas
}