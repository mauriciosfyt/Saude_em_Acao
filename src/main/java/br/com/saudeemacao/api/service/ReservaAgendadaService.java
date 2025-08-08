// src/main/java/br/com/saudeemacao/api/service/ReservaAgendadaService.java (NOVO ARQUIVO)
package br.com.saudeemacao.api.service;

import br.com.saudeemacao.api.model.EStatusReserva;
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

    // Roda todo dia às 03:00 da manhã
    @Scheduled(cron = "0 0 3 * * *")
    public void expirarReservasAntigas() {
        log.info("Iniciando tarefa agendada: Expirar Reservas Antigas...");

        // Define o limite de tempo (ex: 7 dias atrás)
        LocalDateTime limiteExpiracao = LocalDateTime.now().minusDays(7);

        // Busca todas as reservas que foram APROVADAS antes da data limite
        List<Reserva> reservasParaExpirar = reservaRepository.findByStatusAndDataAnaliseBefore(
                EStatusReserva.APROVADA,
                limiteExpiracao
        );

        if (reservasParaExpirar.isEmpty()) {
            log.info("Nenhuma reserva para expirar encontrada.");
            return;
        }

        log.info("{} reservas encontradas para expiração.", reservasParaExpirar.size());

        for (Reserva reserva : reservasParaExpirar) {
            try {
                // Devolve o item ao estoque
                produtoService.incrementarEstoque(
                        reserva.getProduto().getId(),
                        reserva.getTamanho() != null ? reserva.getTamanho().name() : null
                );

                // Atualiza o status da reserva
                reserva.setStatus(EStatusReserva.EXPIRADA);
                reservaRepository.save(reserva);

                // Notifica o aluno
                String motivo = "<p>Sua reserva expirou pois o prazo de retirada de 7 dias foi excedido. O produto retornou ao nosso estoque.</p>";
                emailService.notificarAlunoStatusReserva(
                        reserva.getUsuario().getEmail(),
                        reserva.getProduto().getNome(),
                        "EXPIRADA",
                        motivo
                );

                log.info("Reserva {} expirada com sucesso.", reserva.getId());

            } catch (Exception e) {
                log.error("Erro ao expirar a reserva {}: {}", reserva.getId(), e.getMessage());
            }
        }
        log.info("Tarefa de expiração de reservas concluída.");
    }
}