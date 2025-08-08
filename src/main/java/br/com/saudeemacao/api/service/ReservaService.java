// src/main/java/br/com/saudeemacao/api/service/ReservaService.java
package br.com.saudeemacao.api.service;

import br.com.saudeemacao.api.dto.ReservaSolicitacaoDTO;
import br.com.saudeemacao.api.dto.ReservaStatsDTO;
import br.com.saudeemacao.api.exception.RecursoNaoEncontradoException;
import br.com.saudeemacao.api.model.*;
import br.com.saudeemacao.api.repository.ReservaRepository;
import br.com.saudeemacao.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private static final int MAX_RESERVAS_ATIVAS = 3;

    private final ReservaRepository reservaRepository;
    private final ProdutoService produtoService;
    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;
    private final UsuarioService usuarioService;

    public Reserva solicitarReserva(ReservaSolicitacaoDTO dto, UserDetails userDetails) {
        Usuario usuario = usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado."));

        List<EStatusReserva> statusAtivos = Arrays.asList(EStatusReserva.PENDENTE, EStatusReserva.APROVADA);
        long reservasAtivas = reservaRepository.countByUsuarioIdAndStatusIn(usuario.getId(), statusAtivos);

        if (reservasAtivas >= MAX_RESERVAS_ATIVAS) {
            throw new IllegalStateException("Você atingiu o limite de " + MAX_RESERVAS_ATIVAS + " reservas ativas. Por favor, finalize ou cancele uma reserva existente antes de solicitar uma nova.");
        }

        Produto produto = produtoService.getById(dto.getProdutoId());
        produtoService.decrementarEstoque(produto.getId(), dto.getTamanho());

        Reserva novaReserva = Reserva.builder()
                .usuario(usuario)
                .produto(produto)
                .tamanho(dto.getTamanho() != null ? Produto.Tamanho.valueOf(dto.getTamanho().toUpperCase()) : null)
                .status(EStatusReserva.PENDENTE)
                .dataSolicitacao(LocalDateTime.now())
                .build();

        reservaRepository.save(novaReserva);

        List<Usuario> admins = usuarioService.buscarTodosAdmins();
        for (Usuario admin : admins) {
            emailService.notificarAdminNovaReserva(admin.getEmail(), usuario.getNome(), produto.getNome());
        }

        return novaReserva;
    }

    public Reserva aprovarReserva(String id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Reserva não encontrada."));

        if (reserva.getStatus() != EStatusReserva.PENDENTE) {
            throw new IllegalStateException("Apenas reservas pendentes podem ser aprovadas.");
        }

        reserva.setStatus(EStatusReserva.APROVADA);
        reserva.setDataAnalise(LocalDateTime.now());
        reservaRepository.save(reserva);

        emailService.notificarAlunoStatusReserva(reserva.getUsuario().getEmail(), reserva.getProduto().getNome(), "APROVADA", "<p>Seu produto está separado e aguardando a retirada!</p>");

        return reserva;
    }

    public Reserva rejeitarReserva(String id, String motivo) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Reserva não encontrada."));

        if (reserva.getStatus() != EStatusReserva.PENDENTE) {
            throw new IllegalStateException("Apenas reservas pendentes podem ser rejeitadas.");
        }

        reserva.setStatus(EStatusReserva.REJEITADA);
        reserva.setDataAnalise(LocalDateTime.now());
        reserva.setMotivoAnalise(motivo);
        reservaRepository.save(reserva);

        produtoService.incrementarEstoque(reserva.getProduto().getId(), reserva.getTamanho() != null ? reserva.getTamanho().name() : null);

        String motivoHtml = String.format("<p>Motivo: <em>%s</em></p>", motivo);
        emailService.notificarAlunoStatusReserva(reserva.getUsuario().getEmail(), reserva.getProduto().getNome(), "REJEITADA", motivoHtml);

        return reserva;
    }

    public void cancelarReserva(String id, UserDetails userDetails) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Reserva não encontrada."));

        Usuario usuarioLogado = usuarioRepository.findByEmail(userDetails.getUsername()).get();

        boolean isOwner = reserva.getUsuario().getId().equals(usuarioLogado.getId());
        boolean isAdmin = usuarioLogado.getPerfil() == EPerfil.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new SecurityException("Você não tem permissão para cancelar esta reserva.");
        }

        if (reserva.getStatus() == EStatusReserva.APROVADA || reserva.getStatus() == EStatusReserva.PENDENTE) {
            produtoService.incrementarEstoque(reserva.getProduto().getId(), reserva.getTamanho() != null ? reserva.getTamanho().name() : null);
        }

        reserva.setStatus(EStatusReserva.CANCELADA);
        reservaRepository.save(reserva);
    }

    public List<Reserva> buscarMinhasReservas(UserDetails userDetails) {
        Usuario usuario = usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado."));
        return reservaRepository.findByUsuarioId(usuario.getId());
    }

    public List<Reserva> buscarTodasAsReservas(EStatusReserva status) {
        if (status != null) {
            return reservaRepository.findByStatus(status);
        }
        return reservaRepository.findAll();
    }

    public ReservaStatsDTO getDashboardStats() {
        long pendentes = reservaRepository.countByStatus(EStatusReserva.PENDENTE);
        long aprovadas = reservaRepository.countByStatus(EStatusReserva.APROVADA);
        long canceladas = reservaRepository.countByStatus(EStatusReserva.CANCELADA) + reservaRepository.countByStatus(EStatusReserva.EXPIRADA);

        LocalDateTime hojeInicioDoDia = LocalDateTime.now().with(LocalTime.MIN);
        long aprovadasHoje = reservaRepository.countByStatusAndDataAnaliseAfter(EStatusReserva.APROVADA, hojeInicioDoDia);

        return new ReservaStatsDTO(pendentes, aprovadas, aprovadasHoje, canceladas);
    }
}