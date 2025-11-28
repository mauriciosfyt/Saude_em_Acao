package br.com.saudeemacao.api.controller;

import br.com.saudeemacao.api.dto.*;
import br.com.saudeemacao.api.model.EnumUsuario.EPerfil;
import br.com.saudeemacao.api.model.Usuario;
import br.com.saudeemacao.api.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // == ALUNOS ==
    @PostMapping(value = "/aluno", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
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

    @PutMapping(value = "/aluno/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
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

    @GetMapping("/meus-treinos")
    @PreAuthorize("hasRole('ALUNO') and @usuarioService.isUsuarioGold(authentication.principal.username)")
    public ResponseEntity<List<MeuTreinoDTO>> getMeusTreinos(@AuthenticationPrincipal UserDetails userDetails) {
        List<MeuTreinoDTO> treinos = usuarioService.buscarMeusTreinosAtribuidos(userDetails);
        return ResponseEntity.ok(treinos);
    }

    // == PROFESSORES ==
    @PostMapping(value = "/professor", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
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

    @PutMapping(value = "/professor/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
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

    @PatchMapping("/aluno/{alunoId}/treino")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<Void> atribuirTreino(
            @PathVariable String alunoId,
            @Valid @RequestBody AtribuirTreinoDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) {

        usuarioService.atribuirTreinoParaAluno(alunoId, dto.getTreinoId(), userDetails);
        return ResponseEntity.noContent().build();
    }

    // == ADMINS ==
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

    // == ROTAS DO USUÁRIO LOGADO ==
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

}