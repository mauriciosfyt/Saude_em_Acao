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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.IOException; // Import adicionado
import java.util.List;

@RestController
@RequestMapping("/api")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // ROTAS PARA ALUNOS
    @PostMapping("/aluno")
    public ResponseEntity<Usuario> criarAluno(@Valid @ModelAttribute AlunoCreateDTO dto) throws IOException { // "throws IOException" adicionado
        Usuario usuario = usuarioService.criarAluno(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
    }

    @GetMapping("/aluno")
    public ResponseEntity<List<UsuarioSaidaDTO>> listarAlunos(
            @RequestParam(defaultValue = "0") int pag,
            @RequestParam(defaultValue = "10") int qtd) {
        return ResponseEntity.ok(usuarioService.buscarPorPerfil(EPerfil.ALUNO, PageRequest.of(pag, qtd)));
    }

    @PutMapping("/aluno/{id}")
    public ResponseEntity<Usuario> atualizarAluno(
            @PathVariable String id,
            @Valid @ModelAttribute UsuarioUpdateDTO dto) throws IOException { // "throws IOException" adicionado
        return ResponseEntity.ok(usuarioService.atualizarUsuario(id, dto, EPerfil.ALUNO));
    }

    // ROTAS PARA PROFESSORES
    @PostMapping("/professor")
    public ResponseEntity<Usuario> criarProfessor(@Valid @ModelAttribute ProfessorCreateDTO dto) throws IOException { // "throws IOException" adicionado
        Usuario usuario = usuarioService.criarProfessor(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
    }

    @GetMapping("/professor")
    public ResponseEntity<List<UsuarioSaidaDTO>> listarProfessores(
            @RequestParam(defaultValue = "0") int pag,
            @RequestParam(defaultValue = "10") int qtd) {
        return ResponseEntity.ok(usuarioService.buscarPorPerfil(EPerfil.PROFESSOR, PageRequest.of(pag, qtd)));
    }

    @PutMapping("/professor/{id}")
    public ResponseEntity<Usuario> atualizarProfessor(
            @PathVariable String id,
            @Valid @ModelAttribute UsuarioUpdateDTO dto) throws IOException { // "throws IOException" adicionado
        return ResponseEntity.ok(usuarioService.atualizarUsuario(id, dto, EPerfil.PROFESSOR));
    }

    // ROTAS PARA ADMINS
    @PostMapping("/admin")
    public ResponseEntity<Usuario> criarAdmin(@Valid @RequestBody UsuarioCreateDTO dto) { // Alterado aqui
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
            @Valid @RequestBody UsuarioUpdateDTO dto) throws IOException { // "throws IOException" adicionado
        return ResponseEntity.ok(usuarioService.atualizarUsuario(id, dto, EPerfil.ADMIN));
    }

    // ROTAS GERAIS
    @GetMapping("/usuario/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable String id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    @DeleteMapping("/usuario/{id}")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        usuarioService.excluirPorId(id);
        return ResponseEntity.noContent().build();
    }

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