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
                        break;
                }

                produtoService.incrementarEstoque(
                        produto.getId(),
                        identificadorVariacao,
                        produto.getCategoria()
                );

                reserva.setStatus(EStatusReserva.EXPIRADA);
                reserva.setMotivoAnalise("Expirada automaticamente por não retirada no prazo.");
                reservaRepository.save(reserva);

                String motivo = "<p>Sua reserva expirou pois o prazo de retirada não foi cumprido. O produto retornou ao nosso estoque.</p>";
                emailService.notificarAlunoStatusReserva(
                        reserva.getUsuario().getEmail(),
                        produto.getNome(),
                        "EXPIRADA",
                        motivo
                );

                log.info("Reserva {} expirada com sucesso. Estoque do produto {} incrementado.", reserva.getId(), produto.getId());

            } catch (Exception e) {
                log.error("Erro ao expirar a reserva {}: {}", reserva.getId(), e.getMessage(), e);
            }
        }
        log.info("Tarefa de expiração de reservas concluída.");
    }
}