package br.com.saudeemacao.api.controller;

import br.com.saudeemacao.api.dto.ReservaAnaliseDTO;
import br.com.saudeemacao.api.dto.ReservaSolicitacaoDTO;
import br.com.saudeemacao.api.dto.ReservaStatsDTO;
import br.com.saudeemacao.api.model.EStatusReserva;
import br.com.saudeemacao.api.model.Reserva;
import br.com.saudeemacao.api.service.ReservaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@RequiredArgsConstructor
public class ReservaController {

    private final ReservaService reservaService;

    @PostMapping
    public ResponseEntity<Reserva> solicitarReserva(@Valid @RequestBody ReservaSolicitacaoDTO dto, @AuthenticationPrincipal UserDetails userDetails) {
        Reserva reserva = reservaService.solicitarReserva(dto, userDetails);
        return ResponseEntity.status(HttpStatus.CREATED).body(reserva);
    }

    @GetMapping("/minhas")
    public ResponseEntity<List<Reserva>> getMinhasReservas(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(reservaService.buscarMinhasReservas(userDetails));
    }

    @GetMapping
    public ResponseEntity<List<Reserva>> getTodasAsReservas(@RequestParam(required = false) EStatusReserva status) {
        return ResponseEntity.ok(reservaService.buscarTodasAsReservas(status));
    }

    @GetMapping("/stats")
    public ResponseEntity<ReservaStatsDTO> getStats() {
        return ResponseEntity.ok(reservaService.getDashboardStats());
    }

    @PatchMapping("/{id}/aprovar")
    public ResponseEntity<Reserva> aprovarReserva(@PathVariable String id) {
        return ResponseEntity.ok(reservaService.aprovarReserva(id));
    }

    @PatchMapping("/{id}/rejeitar")
    public ResponseEntity<Reserva> rejeitarReserva(@PathVariable String id, @RequestBody(required = false) ReservaAnaliseDTO dto) {
        String motivo = (dto != null && dto.getMotivo() != null && !dto.getMotivo().isBlank())
                ? dto.getMotivo()
                : "A solicitação não pôde ser atendida no momento.";
        return ResponseEntity.ok(reservaService.rejeitarReserva(id, motivo));
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelarReserva(@PathVariable String id, @AuthenticationPrincipal UserDetails userDetails) {
        reservaService.cancelarReserva(id, userDetails);
        return ResponseEntity.noContent().build();
    }
}