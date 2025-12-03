package br.com.saudeemacao.api.controller;

import br.com.saudeemacao.api.dto.*;
import br.com.saudeemacao.api.model.HistoricoTreino;
import br.com.saudeemacao.api.model.Treino;
import br.com.saudeemacao.api.service.TreinoService;
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
public class TreinoController {

    private final TreinoService treinoService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<TreinoResponseDTO> criarTreino(@Valid @ModelAttribute TreinoDTO dto, @AuthenticationPrincipal UserDetails userDetails) {
        Treino novoTreino = treinoService.criarTreino(dto, userDetails);
        // Converte a entidade para o DTO de resposta antes de enviar
        TreinoResponseDTO responseDTO = treinoService.toResponseDTO(novoTreino);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Treino> buscarPorId(@PathVariable String id) {
        return ResponseEntity.ok(treinoService.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<Treino>> buscarTodos(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String responsavelId) {

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

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<TreinoResponseDTO> atualizarTreino(@PathVariable String id, @Valid @ModelAttribute TreinoDTO dto, @AuthenticationPrincipal UserDetails userDetails) {
        Treino treinoAtualizado = treinoService.atualizarTreino(id, dto, userDetails);
        // Converte a entidade para o DTO de resposta antes de enviar
        TreinoResponseDTO responseDTO = treinoService.toResponseDTO(treinoAtualizado);
        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<Void> deletarTreino(@PathVariable String id, @AuthenticationPrincipal UserDetails userDetails) {
        treinoService.deletarTreino(id, userDetails);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/realizar")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<TreinoRealizadoDTO> registrarTreinoRealizado(
            @AuthenticationPrincipal UserDetails userDetails) {

        HistoricoTreino historico = treinoService.registrarTreinoRealizado(userDetails);

        TreinoRealizadoDTO response = new TreinoRealizadoDTO(
                historico.getDataRealizacao(),
                historico.getDiaDaSemanaConcluido()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/desempenho-semanal")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<List<DesempenhoSemanalDTO>> getDesempenhoSemanal(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<DesempenhoSemanalDTO> desempenho = treinoService.buscarDesempenhoSemanal(userDetails);
        return ResponseEntity.ok(desempenho);
    }

    @GetMapping("/minhas-metricas")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<TreinoMetricasDTO> getMinhasMetricas(
            @AuthenticationPrincipal UserDetails userDetails) {
        TreinoMetricasDTO metricas = treinoService.getMetricasDeTreino(userDetails);
        return ResponseEntity.ok(metricas);
    }
}