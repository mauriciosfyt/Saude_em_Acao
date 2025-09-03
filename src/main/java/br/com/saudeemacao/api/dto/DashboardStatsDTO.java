// src/main/java/br.com.saudeemacao.api/dto/DashboardStatsDTO.java

package br.com.saudeemacao.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalAlunos;
    private Map<String, Long> contagemPorPlano;
    // ALTERAÇÃO: De long para Map para agrupar por categoria.
    private Map<String, Long> estoquePorCategoria;
    private long totalReservas;
    private Map<String, Long> reservasPorProduto;
}