package br.com.saudeemacao.api.controller;

import br.com.saudeemacao.api.dto.TreinoDTO;
import br.com.saudeemacao.api.model.Treino;
import br.com.saudeemacao.api.service.TreinoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/treinos")
@RequiredArgsConstructor
public class TreinoController {

    private final TreinoService treinoService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<Treino> criarTreino(@Valid @RequestBody TreinoDTO dto, @AuthenticationPrincipal UserDetails userDetails) {
        Treino novoTreino = treinoService.criarTreino(dto, userDetails);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoTreino);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Treino> buscarPorId(@PathVariable String id) {
        return ResponseEntity.ok(treinoService.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<Treino>> buscarTodos() {
        return ResponseEntity.ok(treinoService.buscarTodos());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<Treino> atualizarTreino(@PathVariable String id, @Valid @RequestBody TreinoDTO dto, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(treinoService.atualizarTreino(id, dto, userDetails));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<Void> deletarTreino(@PathVariable String id, @AuthenticationPrincipal UserDetails userDetails) {
        treinoService.deletarTreino(id, userDetails);
        return ResponseEntity.noContent().build();
    }
}