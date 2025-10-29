// src/main/java/br/com.saudeemacao.api/service/ReservaAgendadaService.java

package br.com.saudeemacao.api.service;

import br.com.saudeemacao.api.model.EnumReserva.EStatusReserva;
import br.com.saudeemacao.api.model.Produto;
import br.com.saudeemacao.api.model.Reserva;
import br.com.saudeemacao.api.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservaAgendadaService {

    private static final Logger log = LoggerFactory.getLogger(ReservaAgendadaService.class);
    private final ReservaRepository reservaRepository;
    private final ProdutoService produtoService;
    private final EmailService emailService;

    /**
     * LÓGICA COMPLETAMENTE ATUALIZADA:
     * Roda todo dia às 03:00 da manhã para verificar e cancelar reservas que foram aprovadas
     * mas não foram retiradas até a data limite (`dataRetirada`).
     */
    @Scheduled(cron = "0 0 3 * * *")
    public void cancelarReservasNaoRetiradas() {
        log.info("Iniciando tarefa agendada: Cancelar Reservas Não Retiradas...");

        // Busca todas as reservas que estão APROVADAS e cuja data de retirada já passou.
        List<Reserva> reservasParaCancelar = reservaRepository.findByStatusAndDataRetiradaBefore(
                EStatusReserva.APROVADA,
                LocalDateTime.now()
        );

        if (reservasParaCancelar.isEmpty()) {
            log.info("Nenhuma reserva para cancelar por não retirada foi encontrada.");
            return;
        }

        log.info("{} reservas encontradas para cancelamento.", reservasParaCancelar.size());

        for (Reserva reserva : reservasParaCancelar) {
            try {
                Produto produto = reserva.getProduto();
                String identificadorVariacao = null;

                // Determina a variação correta para devolver o item ao estoque
                switch (produto.getCategoria()) {
                    case CAMISETAS:
                        if (reserva.getTamanho() != null) {
                            identificadorVariacao = reserva.getTamanho().name();
                        }
                        break;
                    case CREATINA:
                    case WHEY_PROTEIN:
                        if (reserva.getSabor() != null) {
                            identificadorVariacao = reserva.getSabor().name();
                        }
                        break;
                    case VITAMINAS:
                        // Não precisa de identificador de variação
                        break;
                }

                // 1. Devolve o item ao estoque com os parâmetros corretos
                produtoService.incrementarEstoque(
                        produto.getId(),
                        identificadorVariacao,
                        produto.getCategoria()
                );

                // 2. Atualiza o status da reserva para CANCELADA
                reserva.setStatus(EStatusReserva.CANCELADA);
                reserva.setMotivoAnalise("Cancelada automaticamente por não retirada no prazo.");
                reservaRepository.save(reserva);

                // 3. Notifica o aluno sobre o cancelamento
                String motivo = "<p>Sua reserva foi cancelada pois o prazo de retirada expirou. O produto retornou ao nosso estoque.</p>";
                emailService.notificarAlunoStatusReserva(
                        reserva.getUsuario().getEmail(),
                        produto.getNome(),
                        "CANCELADA",
                        motivo
                );

                log.info("Reserva {} cancelada com sucesso. Estoque do produto {} incrementado.", reserva.getId(), produto.getId());

            } catch (Exception e) {
                // Loga o erro, mas continua o loop para não impedir que outras reservas sejam processadas
                log.error("Erro ao cancelar a reserva {}: {}", reserva.getId(), e.getMessage(), e);
            }
        }
        log.info("Tarefa de cancelamento de reservas concluída.");
    }
}