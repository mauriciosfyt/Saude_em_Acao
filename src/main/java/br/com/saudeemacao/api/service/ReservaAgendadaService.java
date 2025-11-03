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
     * LÓGICA ATUALIZADA:
     * Roda todo dia às 03:00 da manhã para verificar e expirar reservas que foram aprovadas
     * mas não foram retiradas até a data limite (`dataRetirada`).
     */
    @Scheduled(cron = "0 0 10 * * *")
    public void cancelarReservasNaoRetiradas() {
        log.info("Iniciando tarefa agendada: Expirar Reservas Não Retiradas...");

        List<Reserva> reservasParaExpirar = reservaRepository.findByStatusAndDataRetiradaBefore(
                EStatusReserva.APROVADA,
                LocalDateTime.now()
        );

        if (reservasParaExpirar.isEmpty()) {
            log.info("Nenhuma reserva para expirar por não retirada foi encontrada.");
            return;
        }

        log.info("{} reservas encontradas para expiração.", reservasParaExpirar.size());

        for (Reserva reserva : reservasParaExpirar) {
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

                // 2. Atualiza o status da reserva para EXPIRADA
                reserva.setStatus(EStatusReserva.EXPIRADA);
                reserva.setMotivoAnalise("Expirada automaticamente por não retirada no prazo.");
                reservaRepository.save(reserva);

                // 3. Notifica o aluno sobre a expiração
                String motivo = "<p>Sua reserva expirou pois o prazo de retirada não foi cumprido. O produto retornou ao nosso estoque.</p>";
                emailService.notificarAlunoStatusReserva(
                        reserva.getUsuario().getEmail(),
                        produto.getNome(),
                        "EXPIRADA",
                        motivo
                );

                log.info("Reserva {} expirada com sucesso. Estoque do produto {} incrementado.", reserva.getId(), produto.getId());

            } catch (Exception e) {
                // Loga o erro, mas continua o loop para não impedir que outras reservas sejam processadas
                log.error("Erro ao expirar a reserva {}: {}", reserva.getId(), e.getMessage(), e);
            }
        }
        log.info("Tarefa de expiração de reservas concluída.");
    }
}