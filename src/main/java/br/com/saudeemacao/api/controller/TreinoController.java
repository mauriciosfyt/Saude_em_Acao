package br.com.saudeemacao.api.controller;

import br.com.saudeemacao.api.model.HistoricoTreino;
import br.com.saudeemacao.api.model.Treino;
import br.com.saudeemacao.api.model.Usuario;
import br.com.saudeemacao.api.repository.HistoricoTreinoRepository;
import br.com.saudeemacao.api.repository.TreinoRepository;
import br.com.saudeemacao.api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/treino")
public class TreinoController {

    @Autowired
    private TreinoRepository treinoRepository;

    @Autowired
    private HistoricoTreinoRepository historicoTreinoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<Treino> criarTreino(@RequestBody Treino treino) {
        Treino novoTreino = treinoRepository.save(treino);
        return ResponseEntity.ok(novoTreino);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<Treino> atualizarTreino(@PathVariable String id, @RequestBody Treino treino) {
        treino.setId(id);
        Treino treinoAtualizado = treinoRepository.save(treino);
        return ResponseEntity.ok(treinoAtualizado);
    }

    @GetMapping("/meu-treino/{alunoId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Treino> buscarTreinoPorAluno(@PathVariable String alunoId) {
        Optional<Treino> treino = treinoRepository.findByAlunoId(alunoId);
        return treino.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/finalizar")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<HistoricoTreino> finalizarTreino(@RequestBody HistoricoTreino historico) {
        HistoricoTreino historicoSalvo = historicoTreinoRepository.save(historico);

        Usuario usuario = usuarioRepository.findById(historico.getAlunoId()).orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        usuario.setDataUltimoTreino(historico.getDataConclusao());

        LocalDate umaSemanaAtras = LocalDate.now().minusDays(7);
        long treinosNaSemana = historicoTreinoRepository.findByAlunoIdAndDataConclusaoAfter(historico.getAlunoId(), umaSemanaAtras).size();
        usuario.setTreinosFeitosNaSemana((int) treinosNaSemana);

        usuarioRepository.save(usuario);

        return ResponseEntity.ok(historicoSalvo);
    }

    @GetMapping("/historico/{alunoId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<HistoricoTreino>> buscarHistorico(@PathVariable String alunoId) {
        List<HistoricoTreino> historico = historicoTreinoRepository.findByAlunoIdAndDataConclusaoAfter(alunoId, LocalDate.now().minusDays(365));
        return ResponseEntity.ok(historico);
    }
}