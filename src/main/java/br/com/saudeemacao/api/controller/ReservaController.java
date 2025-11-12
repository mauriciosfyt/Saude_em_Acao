package br.com.saudeemacao.api.controller;

import br.com.saudeemacao.api.dto.ReservaAnaliseDTO;
import br.com.saudeemacao.api.dto.ReservaSolicitacaoDTO;
import br.com.saudeemacao.api.dto.ReservaStatsDTO;
import br.com.saudeemacao.api.model.EnumReserva.EStatusReserva;
import br.com.saudeemacao.api.model.Reserva;
import br.com.saudeemacao.api.service.ReservaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Reservas", description = "Endpoints para solicitação e gerenciamento de reservas de produtos.")
public class ReservaController {

    private final ReservaService reservaService;

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Solicita uma nova reserva", description = "Cria uma nova solicitação de reserva para um produto. Requer perfil de ALUNO.")
    @ApiResponse(responseCode = "201", description = "Reserva solicitada com sucesso.")
    @ApiResponse(responseCode = "400", description = "Dados da solicitação inválidos ou limite de reservas atingido.", content = @Content)
    @ApiResponse(responseCode = "403", description = "Acesso negado.", content = @Content)
    @PostMapping
    public ResponseEntity<Reserva> solicitarReserva(@Valid @RequestBody ReservaSolicitacaoDTO dto, @Parameter(hidden = true) @AuthenticationPrincipal UserDetails userDetails) {
        Reserva reserva = reservaService.solicitarReserva(dto, userDetails);
        return ResponseEntity.status(HttpStatus.CREATED).body(reserva);
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Busca as reservas do usuário logado", description = "Retorna uma lista de todas as reservas feitas pelo usuário autenticado. Requer perfil de ALUNO.")
    @ApiResponse(responseCode = "200", description = "Reservas encontradas.")
    @ApiResponse(responseCode = "403", description = "Acesso negado.", content = @Content)
    @GetMapping("/minhas")
    public ResponseEntity<List<Reserva>> getMinhasReservas(@Parameter(hidden = true) @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(reservaService.buscarMinhasReservas(userDetails));
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Busca todas as reservas do sistema", description = "Retorna todas as reservas, podendo filtrar por status. Requer perfil de ADMIN.")
    @ApiResponse(responseCode = "200", description = "Reservas encontradas.")
    @ApiResponse(responseCode = "403", description = "Acesso negado.", content = @Content)
    @GetMapping
    public ResponseEntity<List<Reserva>> getTodasAsReservas(
            @Parameter(description = "Filtra as reservas por um status específico.")
            @RequestParam(required = false) EStatusReserva status) {
        return ResponseEntity.ok(reservaService.buscarTodasAsReservas(status));
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Obtém estatísticas de reservas", description = "Retorna estatísticas sobre as reservas (pendentes, aprovadas, etc.). Requer perfil de ADMIN.")
    @ApiResponse(responseCode = "200", description = "Estatísticas retornadas com sucesso.")
    @ApiResponse(responseCode = "403", description = "Acesso negado.", content = @Content)
    @GetMapping("/stats")
    public ResponseEntity<ReservaStatsDTO> getStats() {
        return ResponseEntity.ok(reservaService.getDashboardStats());
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Aprova uma reserva pendente", description = "Altera o status de uma reserva de PENDENTE para APROVADA. Requer perfil de ADMIN.")
    @ApiResponse(responseCode = "200", description = "Reserva aprovada com sucesso.")
    @ApiResponse(responseCode = "400", description = "Reserva não está pendente.", content = @Content)
    @ApiResponse(responseCode = "403", description = "Acesso negado.", content = @Content)
    @PatchMapping("/{id}/aprovar")
    public ResponseEntity<Reserva> aprovarReserva(@Parameter(description = "ID da reserva") @PathVariable String id) {
        return ResponseEntity.ok(reservaService.aprovarReserva(id));
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Rejeita uma reserva pendente", description = "Altera o status de uma reserva de PENDENTE para REJEITADA. Requer perfil de ADMIN.")
    @ApiResponse(responseCode = "200", description = "Reserva rejeitada com sucesso.")
    @ApiResponse(responseCode = "400", description = "Reserva não está pendente.", content = @Content)
    @ApiResponse(responseCode = "403", description = "Acesso negado.", content = @Content)
    @PatchMapping("/{id}/rejeitar")
    public ResponseEntity<Reserva> rejeitarReserva(@Parameter(description = "ID da reserva") @PathVariable String id, @RequestBody(required = false) ReservaAnaliseDTO dto) {
        String motivo = (dto != null && dto.getMotivo() != null && !dto.getMotivo().isBlank())
                ? dto.getMotivo()
                : "A solicitação não pôde ser atendida no momento.";
        return ResponseEntity.ok(reservaService.rejeitarReserva(id, motivo));
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Conclui uma reserva aprovada", description = "Altera o status de uma reserva de APROVADA para CONCLUIDA (retirada pelo aluno). Requer perfil de ADMIN.")
    @ApiResponse(responseCode = "200", description = "Reserva concluída com sucesso.")
    @ApiResponse(responseCode = "400", description = "Reserva não está aprovada.", content = @Content)
    @ApiResponse(responseCode = "403", description = "Acesso negado.", content = @Content)
    @PatchMapping("/{id}/concluir")
    public ResponseEntity<Reserva> concluirReserva(@Parameter(description = "ID da reserva") @PathVariable String id) {
        return ResponseEntity.ok(reservaService.concluirReserva(id));
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Cancela uma reserva", description = "Permite que um ALUNO cancele a própria reserva ou que um ADMIN cancele qualquer reserva.")
    @ApiResponse(responseCode = "204", description = "Reserva cancelada com sucesso.")
    @ApiResponse(responseCode = "403", description = "Acesso negado.", content = @Content)
    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelarReserva(@Parameter(description = "ID da reserva") @PathVariable String id, @Parameter(hidden = true) @AuthenticationPrincipal UserDetails userDetails) {
        reservaService.cancelarReserva(id, userDetails);
        return ResponseEntity.noContent().build();
    }
}