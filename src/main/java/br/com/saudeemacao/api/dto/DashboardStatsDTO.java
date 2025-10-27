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
    // Métricas existentes
    private long totalAlunos;
    private Map<String, Long> contagemPorPlano;
    private Map<String, Long> estoquePorCategoria;

    // NOVAS MÉTRICAS DE VENDAS
    private double totalVendasGerais; // Total em R$
    private Map<String, Long> totalVendasPorProduto; // Total em unidades por produto
}