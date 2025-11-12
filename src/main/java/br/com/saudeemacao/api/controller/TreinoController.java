package br.com.saudeemacao.api.controller;

import br.com.saudeemacao.api.dto.TreinoDTO;
import br.com.saudeemacao.api.dto.TreinoMetricasDTO;
import br.com.saudeemacao.api.model.HistoricoTreino;
import br.com.saudeemacao.api.model.Treino;
import br.com.saudeemacao.api.service.TreinoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/treinos")
@RequiredArgsConstructor
@Tag(name = "Treinos", description = "Endpoints para criação e gerenciamento de treinos e acompanhamento de desempenho.")
public class TreinoController {

    private final TreinoService treinoService;

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Cria um novo treino", description = "Cria um novo plano de treino. Requer perfil de ADMIN ou PROFESSOR.")
    @ApiResponse(responseCode = "201", description = "Treino criado com sucesso.")
    @ApiResponse(responseCode = "403", description = "Acesso negado.", content = @Content)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<Treino> criarTreino(@Valid @ModelAttribute TreinoDTO dto, @Parameter(hidden = true) @AuthenticationPrincipal UserDetails userDetails) {
        Treino novoTreino = treinoService.criarTreino(dto, userDetails);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoTreino);
    }

    @Operation(summary = "Busca um treino por ID", description = "Endpoint público para retornar os detalhes de um treino específico.")
    @ApiResponse(responseCode = "200", description = "Treino encontrado.")
    @ApiResponse(responseCode = "404", description = "Treino não encontrado.", content = @Content)
    @GetMapping("/{id}")
    public ResponseEntity<Treino> buscarPorId(@Parameter(description = "ID do treino") @PathVariable String id) {
        return ResponseEntity.ok(treinoService.buscarPorId(id));
    }

    @Operation(summary = "Lista todos os treinos ou filtra", description = "Endpoint público que retorna uma lista de treinos, com filtros opcionais.")
    @ApiResponse(responseCode = "200", description = "Treinos listados com sucesso.")
    @GetMapping
    public ResponseEntity<List<Treino>> buscarTodos(
            @Parameter(description = "Filtra treinos pelo nome.") @RequestParam(required = false) String nome,
            @Parameter(description = "Filtra treinos pelo tipo.") @RequestParam(required = false) String tipo,
            @Parameter(description = "Filtra treinos pelo ID do professor responsável.") @RequestParam(required = false) String responsavelId) {

        if (nome != null && !nome.isBlank()) {
            return ResponseEntity.ok(treinoService.buscarPorNome(nome));
        }
        if (tipo != null && !tipo.isBlank()) {
            return ResponseEntity.ok(treinoService.buscarPorTipo(tipo));
        }
        if (responsavelId != null && !responsavelId.isBlank()) {
            return ResponseEntity.ok(treinoService.buscarPorResponsavel(responsavelId));
        }

        return ResponseEntity.ok(treinoService.buscarTodos());
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Atualiza um treino existente", description = "Atualiza os dados de um treino. Requer perfil de ADMIN ou PROFESSOR (se for o criador do treino).")
    @ApiResponse(responseCode = "200", description = "Treino atualizado com sucesso.")
    @ApiResponse(responseCode = "403", description = "Acesso negado.", content = @Content)
    @ApiResponse(responseCode = "404", description = "Treino não encontrado.", content = @Content)
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<Treino> atualizarTreino(@Parameter(description = "ID do treino") @PathVariable String id, @Valid @ModelAttribute TreinoDTO dto, @Parameter(hidden = true) @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(treinoService.atualizarTreino(id, dto, userDetails));
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Deleta um treino", description = "Remove um treino do sistema. Requer perfil de ADMIN ou PROFESSOR (se for o criador do treino).")
    @ApiResponse(responseCode = "204", description = "Treino deletado com sucesso.")
    @ApiResponse(responseCode = "403", description = "Acesso negado.", content = @Content)
    @ApiResponse(responseCode = "404", description = "Treino não encontrado.", content = @Content)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<Void> deletarTreino(@Parameter(description = "ID do treino") @PathVariable String id, @Parameter(hidden = true) @AuthenticationPrincipal UserDetails userDetails) {
        treinoService.deletarTreino(id, userDetails);
        return ResponseEntity.noContent().build();
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Registra a realização de um treino", description = "Cria um registro no histórico do aluno indicando que ele completou um treino. Requer perfil de ALUNO.")
    @ApiResponse(responseCode = "201", description = "Registro de treino criado com sucesso.")
    @ApiResponse(responseCode = "403", description = "Acesso negado.", content = @Content)
    @PostMapping("/{id}/realizar")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<HistoricoTreino> registrarTreinoRealizado(
            @Parameter(description = "ID do treino realizado") @PathVariable String id,
            @Parameter(hidden = true) @AuthenticationPrincipal UserDetails userDetails) {
        HistoricoTreino historico = treinoService.registrarTreinoRealizado(id, userDetails);
        return ResponseEntity.status(HttpStatus.CREATED).body(historico);
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Busca o desempenho semanal do aluno", description = "Retorna o histórico de treinos do aluno na semana corrente. Requer perfil de ALUNO.")
    @ApiResponse(responseCode = "200", description = "Desempenho retornado com sucesso.")
    @ApiResponse(responseCode = "403", description = "Acesso negado.", content = @Content)
    @GetMapping("/desempenho-semanal")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<List<HistoricoTreino>> getDesempenhoSemanal(
            @Parameter(hidden = true) @AuthenticationPrincipal UserDetails userDetails) {
        List<HistoricoTreino> desempenho = treinoService.buscarDesempenhoSemanal(userDetails);
        return ResponseEntity.ok(desempenho);
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Busca as métricas de treino do aluno", description = "Retorna métricas consolidadas de treino (treinos no mês, dias consecutivos, etc.). Requer perfil de ALUNO com plano GOLD.")
    @ApiResponse(responseCode = "200", description = "Métricas retornadas com sucesso.")
    @ApiResponse(responseCode = "403", description = "Acesso negado (requer plano Gold).", content = @Content)
    @GetMapping("/minhas-metricas")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<TreinoMetricasDTO> getMinhasMetricas(
            @Parameter(hidden = true) @AuthenticationPrincipal UserDetails userDetails) {
        TreinoMetricasDTO metricas = treinoService.getMetricasDeTreino(userDetails);
        return ResponseEntity.ok(metricas);
    }
}