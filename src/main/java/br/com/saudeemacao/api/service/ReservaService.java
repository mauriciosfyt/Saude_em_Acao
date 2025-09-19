package br.com.saudeemacao.api.service;

import br.com.saudeemacao.api.dto.ReservaSolicitacaoDTO;
import br.com.saudeemacao.api.dto.ReservaStatsDTO;
import br.com.saudeemacao.api.exception.RecursoNaoEncontradoException;
import br.com.saudeemacao.api.model.*;
import br.com.saudeemacao.api.model.EnumProduto.ESabor;
import br.com.saudeemacao.api.model.EnumProduto.ETamanho;
import br.com.saudeemacao.api.repository.ReservaRepository;
import br.com.saudeemacao.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
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

        String identificadorVariacao = null;
        ETamanho tamanho = null;
        ESabor sabor = null;

        switch (produto.getCategoria()) {
            case CAMISETAS:
                if (dto.getTamanho() == null || dto.getTamanho().isBlank()) {
                    throw new IllegalArgumentException("Tamanho é obrigatório para produtos da categoria CAMISETAS.");
                }
                tamanho = ETamanho.valueOf(dto.getTamanho().toUpperCase());
                identificadorVariacao = dto.getTamanho();
                break;
            case CREATINA:
            case WHEY_PROTEIN:
                if (dto.getSabor() == null || dto.getSabor().isBlank()) {
                    throw new IllegalArgumentException("Sabor é obrigatório para produtos da categoria " + produto.getCategoria() + ".");
                }
                sabor = ESabor.valueOf(dto.getSabor().toUpperCase());
                identificadorVariacao = dto.getSabor();
                break;
            case VITAMINAS:
                break;
            default:
                throw new IllegalArgumentException("Categoria de produto desconhecida ou sem variação esperada.");
        }

        produtoService.decrementarEstoque(produto.getId(), identificadorVariacao, produto.getCategoria());

        Reserva novaReserva = Reserva.builder()
                .usuario(usuario)
                .produto(produto)
                .tamanho(tamanho)
                .sabor(sabor)
                .status(EStatusReserva.PENDENTE)
                .dataSolicitacao(LocalDateTime.now())
                .build();

        reservaRepository.save(novaReserva);

        // **** CORREÇÃO APLICADA AQUI ****
        // O método correto é "buscarTodosAdmins"
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
        reserva.setDataRetirada(LocalDateTime.now().plusDays(3).with(LocalTime.MAX));
        reservaRepository.save(reserva);

        String dataFormatada = reserva.getDataRetirada().toLocalDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        String mensagemEmail = String.format(
                "<p>Seu produto está separado e aguardando a retirada! Você tem até o final do dia %s para buscá-lo.</p>",
                dataFormatada
        );
        emailService.notificarAlunoStatusReserva(reserva.getUsuario().getEmail(), reserva.getProduto().getNome(), "APROVADA", mensagemEmail);

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

        String identificadorVariacao = null;
        if (reserva.getTamanho() != null) {
            identificadorVariacao = reserva.getTamanho().name();
        } else if (reserva.getSabor() != null) {
            identificadorVariacao = reserva.getSabor().name();
        }

        produtoService.incrementarEstoque(reserva.getProduto().getId(), identificadorVariacao, reserva.getProduto().getCategoria());

        String motivoHtml = String.format("<p>Motivo: <em>%s</em></p>", motivo);
        emailService.notificarAlunoStatusReserva(reserva.getUsuario().getEmail(), reserva.getProduto().getNome(), "REJEITADA", motivoHtml);

        return reserva;
    }

    public void cancelarReserva(String id, UserDetails userDetails) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Reserva não encontrada."));

        Usuario usuarioLogado = usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário logado não encontrado."));

        boolean isOwner = reserva.getUsuario().getId().equals(usuarioLogado.getId());
        boolean isAdmin = usuarioLogado.getPerfil() == EPerfil.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new SecurityException("Você não tem permissão para cancelar esta reserva.");
        }

        if (reserva.getStatus() == EStatusReserva.APROVADA || reserva.getStatus() == EStatusReserva.PENDENTE) {
            String identificadorVariacao = null;
            if (reserva.getTamanho() != null) {
                identificadorVariacao = reserva.getTamanho().name();
            } else if (reserva.getSabor() != null) {
                identificadorVariacao = reserva.getSabor().name();
            }
            produtoService.incrementarEstoque(reserva.getProduto().getId(), identificadorVariacao, reserva.getProduto().getCategoria());
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