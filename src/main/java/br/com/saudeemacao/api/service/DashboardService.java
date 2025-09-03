// src/main/java/br.com.saudeemacao.api/service/DashboardService.java

package br.com.saudeemacao.api.service;

import br.com.saudeemacao.api.dto.DashboardStatsDTO;
import br.com.saudeemacao.api.model.EPerfil;
import br.com.saudeemacao.api.model.Produto;
import br.com.saudeemacao.api.repository.ProdutoRepository;
import br.com.saudeemacao.api.repository.ReservaRepository;
import br.com.saudeemacao.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UsuarioRepository usuarioRepository;
    private final ProdutoRepository produtoRepository;
    private final ReservaRepository reservaRepository;

    public DashboardStatsDTO getDashboardStats() {

        // 1. Total de alunos cadastrados
        long totalAlunos = usuarioRepository.countByPerfil(EPerfil.ALUNO);

        // 2. Quantidade de pessoas em cada plano
        Map<String, Long> contagemPorPlano = getContagemPorPlano();

        // 3. Total de produtos em estoque por categoria (ATUALIZADO)
        Map<String, Long> estoquePorCategoria = getEstoquePorCategoria();

        // 4. Total de reservas realizadas
        long totalReservas = reservaRepository.count();

        // 5. Quantidade de reservas por produto
        Map<String, Long> reservasPorProduto = getReservasPorProduto();

        // Monta o DTO de resposta
        return DashboardStatsDTO.builder()
                .totalAlunos(totalAlunos)
                .contagemPorPlano(contagemPorPlano)
                .estoquePorCategoria(estoquePorCategoria) // Campo atualizado
                .totalReservas(totalReservas)
                .reservasPorProduto(reservasPorProduto)
                .build();
    }

    private Map<String, Long> getContagemPorPlano() {
        // Agrupa todos os usuários pelo nome do plano e conta as ocorrências.
        return usuarioRepository.findAll().stream()
                .filter(u -> u.getPlano() != null)
                .collect(Collectors.groupingBy(u -> u.getPlano().name(), Collectors.counting()));
    }

    /**
     * MÉTODO ATUALIZADO:
     * Calcula o estoque total de produtos para cada categoria.
     */
    private Map<String, Long> getEstoquePorCategoria() {
        return produtoRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        produto -> produto.getCategoria().name(),
                        Collectors.summingLong(Produto::getEstoqueTotal)
                ));
    }

    private Map<String, Long> getReservasPorProduto() {
        // Agrupa todas as reservas pelo nome do produto e conta as ocorrências.
        return reservaRepository.findAll().stream()
                .filter(reserva -> reserva.getProduto() != null && reserva.getProduto().getNome() != null)
                .collect(Collectors.groupingBy(
                        reserva -> reserva.getProduto().getNome(),
                        Collectors.counting()
                ));
    }
}