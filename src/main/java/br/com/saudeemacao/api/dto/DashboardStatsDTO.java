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
    private Map<String, Long> estoquePorCategoria;
    private double totalVendasGerais;
    private Map<String, Long> totalVendasPorProduto;
    private long produtosReservados;
    private long produtosAtivos;
    private long totalProdutosVendidos;
    private long produtosAguardandoRetirada;
}