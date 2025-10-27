package br.com.saudeemacao.api.controller;

import br.com.saudeemacao.api.dto.*;
import br.com.saudeemacao.api.model.EPerfil;
import br.com.saudeemacao.api.model.Usuario;
import br.com.saudeemacao.api.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // ROTAS PARA ALUNOS
    @PostMapping("/aluno")
    public ResponseEntity<Usuario> criarAluno(@Valid @ModelAttribute AlunoCreateDTO dto) throws IOException {
        Usuario usuario = usuarioService.criarAluno(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
    }

    @GetMapping("/aluno")
    public ResponseEntity<List<UsuarioSaidaDTO>> listarAlunos(
            @RequestParam(defaultValue = "0") int pag,
            @RequestParam(defaultValue = "10") int qtd,
            @RequestParam(required = false) String nome) {
        PageRequest pageRequest = PageRequest.of(pag, qtd);
        if (nome != null && !nome.isBlank()) {
            return ResponseEntity.ok(usuarioService.buscarPorPerfilENome(EPerfil.ALUNO, nome, pageRequest));
        }
        return ResponseEntity.ok(usuarioService.buscarPorPerfil(EPerfil.ALUNO, pageRequest));
    }

    @PutMapping("/aluno/{id}")
    public ResponseEntity<Usuario> atualizarAluno(
            @PathVariable String id,
            @Valid @ModelAttribute UsuarioUpdateDTO dto) throws IOException {
        return ResponseEntity.ok(usuarioService.atualizarUsuario(id, dto, EPerfil.ALUNO));
    }

    /**
     * NOVO MÉTODO ADICIONADO
     */
    @DeleteMapping("/aluno/{id}")
    public ResponseEntity<Void> excluirAluno(@PathVariable String id) {
        usuarioService.excluirPorId(id);
        return ResponseEntity.noContent().build();
    }

    // ROTAS PARA PROFESSORES
    @PostMapping("/professor")
    public ResponseEntity<Usuario> criarProfessor(@Valid @ModelAttribute ProfessorCreateDTO dto) throws IOException {
        Usuario usuario = usuarioService.criarProfessor(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
    }

    @GetMapping("/professor")
    public ResponseEntity<List<UsuarioSaidaDTO>> listarProfessores(
            @RequestParam(defaultValue = "0") int pag,
            @RequestParam(defaultValue = "10") int qtd,
            @RequestParam(required = false) String nome) {
        PageRequest pageRequest = PageRequest.of(pag, qtd);
        if (nome != null && !nome.isBlank()) {
            return ResponseEntity.ok(usuarioService.buscarPorPerfilENome(EPerfil.PROFESSOR, nome, pageRequest));
        }
        return ResponseEntity.ok(usuarioService.buscarPorPerfil(EPerfil.PROFESSOR, pageRequest));
    }

    @PutMapping("/professor/{id}")
    public ResponseEntity<Usuario> atualizarProfessor(
            @PathVariable String id,
            @Valid @ModelAttribute UsuarioUpdateDTO dto) throws IOException {
        return ResponseEntity.ok(usuarioService.atualizarUsuario(id, dto, EPerfil.PROFESSOR));
    }

    /**
     * NOVO MÉTODO ADICIONADO
     */
    @DeleteMapping("/professor/{id}")
    public ResponseEntity<Void> excluirProfessor(@PathVariable String id) {
        usuarioService.excluirPorId(id);
        return ResponseEntity.noContent().build();
    }

    // ROTAS PARA ADMINS
    @PostMapping("/admin")
    public ResponseEntity<Usuario> criarAdmin(@Valid @RequestBody UsuarioCreateDTO dto) {
        Usuario usuario = usuarioService.criarAdmin(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
    }

    @GetMapping("/admin")
    public ResponseEntity<List<UsuarioSaidaDTO>> listarAdmins(
            @RequestParam(defaultValue = "0") int pag,
            @RequestParam(defaultValue = "10") int qtd) {
        return ResponseEntity.ok(usuarioService.buscarPorPerfil(EPerfil.ADMIN, PageRequest.of(pag, qtd)));
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<Usuario> atualizarAdmin(
            @PathVariable String id,
            @Valid @RequestBody UsuarioUpdateDTO dto) throws IOException {
        return ResponseEntity.ok(usuarioService.atualizarUsuario(id, dto, EPerfil.ADMIN));
    }

    /**
     * NOVO MÉTODO ADICIONADO
     */
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> excluirAdmin(@PathVariable String id) {
        usuarioService.excluirPorId(id);
        return ResponseEntity.noContent().build();
    }

    // ROTAS DE AUTOATENDIMENTO
    @GetMapping("/meu-perfil")
    public ResponseEntity<?> getMeuPerfil(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            UsuarioPerfilDTO perfilDTO = usuarioService.buscarPerfilDoUsuarioLogado(userDetails);
            return ResponseEntity.ok(perfilDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> excluirMinhaConta(@AuthenticationPrincipal UserDetails userDetails) {
        usuarioService.excluirPorEmail(userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}