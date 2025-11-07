package br.com.saudeemacao.api.controller;

import br.com.saudeemacao.api.dto.AlunoCreateDTO;
import br.com.saudeemacao.api.dto.PlanoGoldDetalhesDTO;
import br.com.saudeemacao.api.dto.ProfessorCreateDTO;
import br.com.saudeemacao.api.dto.UsuarioCreateDTO;
import br.com.saudeemacao.api.dto.UsuarioPerfilDTO;
import br.com.saudeemacao.api.dto.UsuarioSaidaDTO;
import br.com.saudeemacao.api.dto.UsuarioUpdateDTO;
import br.com.saudeemacao.api.model.EnumUsuario.EPerfil;
import br.com.saudeemacao.api.model.Usuario;
import br.com.saudeemacao.api.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

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

    @GetMapping("/aluno/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<UsuarioSaidaDTO> buscarAlunoPorId(@PathVariable String id) {
        UsuarioSaidaDTO aluno = usuarioService.buscarUsuarioDTOPorIdEPerfil(id, EPerfil.ALUNO);
        return ResponseEntity.ok(aluno);
    }

    @PutMapping("/aluno/{id}")
    @PreAuthorize("hasRole('ADMIN') or @usuarioService.podeAtualizarPerfil(#id, authentication.principal)")
    public ResponseEntity<Usuario> atualizarAluno(
            @PathVariable String id,
            @Valid @ModelAttribute UsuarioUpdateDTO dto) throws IOException {
        return ResponseEntity.ok(usuarioService.atualizarUsuario(id, dto, EPerfil.ALUNO));
    }

    @DeleteMapping("/aluno/{id}")
    public ResponseEntity<Void> excluirAluno(@PathVariable String id) {
        usuarioService.excluirPorId(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/professor")
    public ResponseEntity<Usuario> criarProfessor(@Valid @ModelAttribute ProfessorCreateDTO dto) throws IOException {
        Usuario usuario = usuarioService.criarProfessor(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
    }

    @GetMapping("/professor")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR') or @usuarioService.isUsuarioGold(authentication.principal.username)")
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

    @GetMapping("/professor/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR') or @usuarioService.isUsuarioGold(authentication.principal.username)")
    public ResponseEntity<UsuarioSaidaDTO> buscarProfessorPorId(@PathVariable String id) {
        UsuarioSaidaDTO professor = usuarioService.buscarUsuarioDTOPorIdEPerfil(id, EPerfil.PROFESSOR);
        return ResponseEntity.ok(professor);
    }

    @PutMapping("/professor/{id}")
    public ResponseEntity<Usuario> atualizarProfessor(
            @PathVariable String id,
            @Valid @ModelAttribute UsuarioUpdateDTO dto) throws IOException {
        return ResponseEntity.ok(usuarioService.atualizarUsuario(id, dto, EPerfil.PROFESSOR));
    }

    @DeleteMapping("/professor/{id}")
    public ResponseEntity<Void> excluirProfessor(@PathVariable String id) {
        usuarioService.excluirPorId(id);
        return ResponseEntity.noContent().build();
    }

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

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> excluirAdmin(@PathVariable String id) {
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

    @GetMapping("/meu-plano/detalhes")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<PlanoGoldDetalhesDTO> getDetalhesPlanoGold(@AuthenticationPrincipal UserDetails userDetails) {
        PlanoGoldDetalhesDTO detalhesDTO = usuarioService.buscarDetalhesPlanoGold(userDetails);
        return ResponseEntity.ok(detalhesDTO);
    }

    @PostMapping("/aluno/{id}/renovar-plano")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PlanoGoldDetalhesDTO> renovarPlano(@PathVariable String id) {
        PlanoGoldDetalhesDTO detalhesAtualizados = usuarioService.renovarPlanoGoldPorAdmin(id);
        return ResponseEntity.ok(detalhesAtualizados);
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> excluirMinhaConta(@AuthenticationPrincipal UserDetails userDetails) {
        usuarioService.excluirPorEmail(userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}