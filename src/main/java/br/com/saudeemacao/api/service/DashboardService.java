package br.com.saudeemacao.api.service;

import br.com.saudeemacao.api.dto.DashboardStatsDTO;
import br.com.saudeemacao.api.model.EnumReserva.EStatusReserva;
import br.com.saudeemacao.api.model.EnumUsuario.EPerfil;
import br.com.saudeemacao.api.model.Produto;
import br.com.saudeemacao.api.model.Reserva;
import br.com.saudeemacao.api.repository.ProdutoRepository;
import br.com.saudeemacao.api.repository.ReservaRepository;
import br.com.saudeemacao.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UsuarioRepository usuarioRepository;
    private final ProdutoRepository produtoRepository;
    private final ReservaRepository reservaRepository;

    public DashboardStatsDTO getDashboardStats(Integer ano) {
        // Define o ano corrente se nenhum for fornecido
        int anoParaFiltro = (ano != null && ano > 2000) ? ano : Year.now().getValue();

        // Define o intervalo de datas para o ano especificado
        LocalDateTime inicioDoAno = LocalDateTime.of(anoParaFiltro, 1, 1, 0, 0, 0);
        LocalDateTime fimDoAno = LocalDateTime.of(anoParaFiltro, 12, 31, 23, 59, 59);

        // 1. Métricas gerais (não dependem do ano)
        long totalAlunos = usuarioRepository.countByPerfil(EPerfil.ALUNO);
        Map<String, Long> contagemPorPlano = getContagemPorPlano();
        Map<String, Long> estoquePorCategoria = getEstoquePorCategoria();

        // 2. Busca as vendas (reservas CONCLUÍDAS) no ano especificado, filtrando pela DATA DE CONCLUSÃO
        List<Reserva> vendasDoAno = reservaRepository.findByStatusAndDataConclusaoBetween(
                EStatusReserva.CONCLUIDA, inicioDoAno, fimDoAno
        );

        // 3. Calcula as métricas de vendas com base nos dados corrigidos
        double totalVendasGerais = calcularTotalVendas(vendasDoAno);
        Map<String, Long> vendasPorProduto = getVendasPorProduto(vendasDoAno);

        // Monta o DTO de resposta
        return DashboardStatsDTO.builder()
                .totalAlunos(totalAlunos)
                .contagemPorPlano(contagemPorPlano)
                .estoquePorCategoria(estoquePorCategoria)
                .totalVendasGerais(totalVendasGerais)
                .totalVendasPorProduto(vendasPorProduto)
                .build();
    }

    private double calcularTotalVendas(List<Reserva> vendas) {
        return vendas.stream()
                .filter(v -> v.getProduto() != null && v.getProduto().getPreco() != null)
                .mapToDouble(v -> v.getProduto().getPreco())
                .sum();
    }

    private Map<String, Long> getVendasPorProduto(List<Reserva> vendas) {
        return vendas.stream()
                .filter(reserva -> reserva.getProduto() != null && reserva.getProduto().getNome() != null)
                .collect(Collectors.groupingBy(
                        reserva -> reserva.getProduto().getNome(),
                        Collectors.counting()
                ));
    }

    private Map<String, Long> getContagemPorPlano() {
        // Agrupa todos os usuários pelo nome do plano e conta as ocorrências.
        return usuarioRepository.findAll().stream()
                .filter(u -> u.getPlano() != null)
                .collect(Collectors.groupingBy(u -> u.getPlano().name(), Collectors.counting()));
    }

    private Map<String, Long> getEstoquePorCategoria() {
        return produtoRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        produto -> produto.getCategoria().name(),
                        Collectors.summingLong(Produto::getEstoqueTotal)
                ));
    }
}