package br.com.saudeemacao.api.controller;

import br.com.saudeemacao.api.dto.DashboardStatsDTO;
import br.com.saudeemacao.api.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Endpoints para visualização de estatísticas gerais da aplicação.")
public class DashboardController {

    private final DashboardService dashboardService;

    @SecurityRequirement(name = "bearerAuth")
    @Operation(
            summary = "Obtém estatísticas consolidadas",
            description = "Retorna dados consolidados para o dashboard principal, como total de alunos, contagem por plano, estoque e vendas. Acesso restrito a ADMIN. Pode ser filtrado por ano."
    )
    @ApiResponse(responseCode = "200", description = "Estatísticas retornadas com sucesso.",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = DashboardStatsDTO.class)))
    @ApiResponse(responseCode = "403", description = "Acesso negado.", content = @Content)
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats(
            @Parameter(description = "Ano para filtrar as estatísticas de vendas. Se não for fornecido, usa o ano atual.", example = "2024")
            @RequestParam(required = false) Integer ano) {
        DashboardStatsDTO stats = dashboardService.getDashboardStats(ano);
        return ResponseEntity.ok(stats);
    }
}