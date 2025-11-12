package br.com.saudeemacao.api.controller;

import br.com.saudeemacao.api.dto.*;
import br.com.saudeemacao.api.model.EnumUsuario.EPerfil;
import br.com.saudeemacao.api.model.Usuario;
import br.com.saudeemacao.api.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Usuários", description = "Endpoints para gerenciamento de Alunos, Professores e Admins.")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // == ALUNOS ==
    @Operation(summary = "Cria um novo Aluno (Auto-cadastro)", description = "Endpoint público para um novo usuário se cadastrar como aluno.")
    @ApiResponse(responseCode = "201", description = "Aluno criado com sucesso.")
    @ApiResponse(responseCode = "400", description = "Dados inválidos ou e-mail/CPF/telefone já cadastrado.", content = @Content)
    @PostMapping(value = "/aluno", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Usuario> criarAluno(@Valid @ModelAttribute AlunoCreateDTO dto) throws IOException {
        Usuario usuario = usuarioService.criarAluno(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Lista Alunos (Paginado)", description = "Retorna uma lista paginada de alunos. Requer perfil de ADMIN ou PROFESSOR.")
    @ApiResponse(responseCode = "200", description = "Alunos listados com sucesso.")
    @GetMapping("/aluno")
    public ResponseEntity<List<UsuarioSaidaDTO>> listarAlunos(
            @Parameter(description = "Número da página (inicia em 0)") @RequestParam(defaultValue = "0") int pag,
            @Parameter(description = "Quantidade de itens por página") @RequestParam(defaultValue = "10") int qtd,
            @Parameter(description = "Filtro por nome do aluno") @RequestParam(required = false) String nome) {
        PageRequest pageRequest = PageRequest.of(pag, qtd);
        if (nome != null && !nome.isBlank()) {
            return ResponseEntity.ok(usuarioService.buscarPorPerfilENome(EPerfil.ALUNO, nome, pageRequest));
        }
        return ResponseEntity.ok(usuarioService.buscarPorPerfil(EPerfil.ALUNO, pageRequest));
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Busca um Aluno por ID", description = "Retorna os detalhes de um aluno específico. Requer perfil de ADMIN ou PROFESSOR.")
    @ApiResponse(responseCode = "200", description = "Aluno encontrado.")
    @ApiResponse(responseCode = "404", description = "Aluno não encontrado.", content = @Content)
    @GetMapping("/aluno/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<UsuarioSaidaDTO> buscarAlunoPorId(@Parameter(description = "ID do aluno") @PathVariable String id) {
        UsuarioSaidaDTO aluno = usuarioService.buscarUsuarioDTOPorIdEPerfil(id, EPerfil.ALUNO);
        return ResponseEntity.ok(aluno);
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Atualiza um Aluno", description = "Atualiza os dados de um aluno. Permissão para ADMIN ou para o próprio aluno, se ele tiver plano GOLD.")
    @ApiResponse(responseCode = "200", description = "Aluno atualizado com sucesso.")
    @ApiResponse(responseCode = "404", description = "Aluno não encontrado.", content = @Content)
    @PutMapping(value = "/aluno/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN') or @usuarioService.podeAtualizarPerfil(#id, authentication.principal)")
    public ResponseEntity<Usuario> atualizarAluno(
            @Parameter(description = "ID do aluno") @PathVariable String id,
            @Valid @ModelAttribute UsuarioUpdateDTO dto) throws IOException {
        return ResponseEntity.ok(usuarioService.atualizarUsuario(id, dto, EPerfil.ALUNO));
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Exclui um Aluno", description = "Remove um aluno do sistema. Requer perfil de ADMIN.")
    @ApiResponse(responseCode = "204", description = "Aluno excluído com sucesso.")
    @ApiResponse(responseCode = "404", description = "Aluno não encontrado.", content = @Content)
    @DeleteMapping("/aluno/{id}")
    public ResponseEntity<Void> excluirAluno(@Parameter(description = "ID do aluno") @PathVariable String id) {
        usuarioService.excluirPorId(id);
        return ResponseEntity.noContent().build();
    }

    // == PROFESSORES ==
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Cria um novo Professor", description = "Cria um novo usuário com perfil de professor. Requer perfil de ADMIN.")
    @ApiResponse(responseCode = "201", description = "Professor criado com sucesso.")
    @ApiResponse(responseCode = "400", description = "Dados inválidos ou e-mail/CPF/telefone já cadastrado.", content = @Content)
    @PostMapping(value = "/professor", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Usuario> criarProfessor(@Valid @ModelAttribute ProfessorCreateDTO dto) throws IOException {
        Usuario usuario = usuarioService.criarProfessor(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Lista Professores (Paginado)", description = "Retorna uma lista paginada de professores. Acesso para ADMIN, PROFESSOR ou ALUNO com plano GOLD.")
    @ApiResponse(responseCode = "200", description = "Professores listados com sucesso.")
    @GetMapping("/professor")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR') or @usuarioService.isUsuarioGold(authentication.principal.username)")
    public ResponseEntity<List<UsuarioSaidaDTO>> listarProfessores(
            @Parameter(description = "Número da página (inicia em 0)") @RequestParam(defaultValue = "0") int pag,
            @Parameter(description = "Quantidade de itens por página") @RequestParam(defaultValue = "10") int qtd,
            @Parameter(description = "Filtro por nome do professor") @RequestParam(required = false) String nome) {
        PageRequest pageRequest = PageRequest.of(pag, qtd);
        if (nome != null && !nome.isBlank()) {
            return ResponseEntity.ok(usuarioService.buscarPorPerfilENome(EPerfil.PROFESSOR, nome, pageRequest));
        }
        return ResponseEntity.ok(usuarioService.buscarPorPerfil(EPerfil.PROFESSOR, pageRequest));
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Busca um Professor por ID", description = "Retorna os detalhes de um professor. Acesso para ADMIN, PROFESSOR ou ALUNO com plano GOLD.")
    @ApiResponse(responseCode = "200", description = "Professor encontrado.")
    @ApiResponse(responseCode = "404", description = "Professor não encontrado.", content = @Content)
    @GetMapping("/professor/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR') or @usuarioService.isUsuarioGold(authentication.principal.username)")
    public ResponseEntity<UsuarioSaidaDTO> buscarProfessorPorId(@Parameter(description = "ID do professor") @PathVariable String id) {
        UsuarioSaidaDTO professor = usuarioService.buscarUsuarioDTOPorIdEPerfil(id, EPerfil.PROFESSOR);
        return ResponseEntity.ok(professor);
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Atualiza um Professor", description = "Atualiza os dados de um professor. Requer perfil de ADMIN.")
    @ApiResponse(responseCode = "200", description = "Professor atualizado com sucesso.")
    @ApiResponse(responseCode = "404", description = "Professor não encontrado.", content = @Content)
    @PutMapping(value = "/professor/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Usuario> atualizarProfessor(
            @Parameter(description = "ID do professor") @PathVariable String id,
            @Valid @ModelAttribute UsuarioUpdateDTO dto) throws IOException {
        return ResponseEntity.ok(usuarioService.atualizarUsuario(id, dto, EPerfil.PROFESSOR));
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Exclui um Professor", description = "Remove um professor do sistema. Requer perfil de ADMIN.")
    @ApiResponse(responseCode = "204", description = "Professor excluído com sucesso.")
    @ApiResponse(responseCode = "404", description = "Professor não encontrado.", content = @Content)
    @DeleteMapping("/professor/{id}")
    public ResponseEntity<Void> excluirProfessor(@Parameter(description = "ID do professor") @PathVariable String id) {
        usuarioService.excluirPorId(id);
        return ResponseEntity.noContent().build();
    }

    // == ADMINS ==
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Cria um novo Admin", description = "Cria um novo usuário com perfil de administrador. Requer perfil de ADMIN.")
    @ApiResponse(responseCode = "201", description = "Admin criado com sucesso.")
    @PostMapping("/admin")
    public ResponseEntity<Usuario> criarAdmin(@Valid @RequestBody UsuarioCreateDTO dto) {
        Usuario usuario = usuarioService.criarAdmin(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Lista Admins (Paginado)", description = "Retorna uma lista paginada de administradores. Requer perfil de ADMIN.")
    @ApiResponse(responseCode = "200", description = "Admins listados com sucesso.")
    @GetMapping("/admin")
    public ResponseEntity<List<UsuarioSaidaDTO>> listarAdmins(
            @Parameter(description = "Número da página (inicia em 0)") @RequestParam(defaultValue = "0") int pag,
            @Parameter(description = "Quantidade de itens por página") @RequestParam(defaultValue = "10") int qtd) {
        return ResponseEntity.ok(usuarioService.buscarPorPerfil(EPerfil.ADMIN, PageRequest.of(pag, qtd)));
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Atualiza um Admin", description = "Atualiza os dados de um administrador. Requer perfil de ADMIN.")
    @ApiResponse(responseCode = "200", description = "Admin atualizado com sucesso.")
    @ApiResponse(responseCode = "404", description = "Admin não encontrado.", content = @Content)
    @PutMapping("/admin/{id}")
    public ResponseEntity<Usuario> atualizarAdmin(
            @Parameter(description = "ID do admin") @PathVariable String id,
            @Valid @RequestBody UsuarioUpdateDTO dto) throws IOException {
        return ResponseEntity.ok(usuarioService.atualizarUsuario(id, dto, EPerfil.ADMIN));
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Exclui um Admin", description = "Remove um administrador do sistema. Requer perfil de ADMIN.")
    @ApiResponse(responseCode = "204", description = "Admin excluído com sucesso.")
    @ApiResponse(responseCode = "404", description = "Admin não encontrado.", content = @Content)
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> excluirAdmin(@Parameter(description = "ID do admin") @PathVariable String id) {
        usuarioService.excluirPorId(id);
        return ResponseEntity.noContent().build();
    }

    // == ROTAS DO USUÁRIO LOGADO ==
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Busca os dados do perfil do usuário logado", description = "Retorna os detalhes do perfil do usuário autenticado.")
    @ApiResponse(responseCode = "200", description = "Perfil retornado com sucesso.")
    @GetMapping("/meu-perfil")
    public ResponseEntity<?> getMeuPerfil(@Parameter(hidden = true) @AuthenticationPrincipal UserDetails userDetails) {
        try {
            UsuarioPerfilDTO perfilDTO = usuarioService.buscarPerfilDoUsuarioLogado(userDetails);
            return ResponseEntity.ok(perfilDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Busca detalhes do plano Gold do aluno logado", description = "Retorna detalhes sobre o plano Gold do aluno. Requer perfil de ALUNO com plano GOLD.")
    @ApiResponse(responseCode = "200", description = "Detalhes do plano retornados com sucesso.")
    @ApiResponse(responseCode = "403", description = "Acesso negado (requer plano Gold).", content = @Content)
    @GetMapping("/meu-plano/detalhes")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<PlanoGoldDetalhesDTO> getDetalhesPlanoGold(@Parameter(hidden = true) @AuthenticationPrincipal UserDetails userDetails) {
        PlanoGoldDetalhesDTO detalhesDTO = usuarioService.buscarDetalhesPlanoGold(userDetails);
        return ResponseEntity.ok(detalhesDTO);
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Renova o plano Gold de um aluno", description = "Estende a data de vencimento do plano Gold de um aluno por mais um mês. Requer perfil de ADMIN.")
    @ApiResponse(responseCode = "200", description = "Plano renovado com sucesso.")
    @ApiResponse(responseCode = "404", description = "Aluno não encontrado.", content = @Content)
    @PostMapping("/aluno/{id}/renovar-plano")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PlanoGoldDetalhesDTO> renovarPlano(@Parameter(description = "ID do aluno") @PathVariable String id) {
        PlanoGoldDetalhesDTO detalhesAtualizados = usuarioService.renovarPlanoGoldPorAdmin(id);
        return ResponseEntity.ok(detalhesAtualizados);
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Exclui a própria conta", description = "Remove permanentemente a conta do usuário autenticado do sistema.")
    @ApiResponse(responseCode = "204", description = "Conta excluída com sucesso.")
    @DeleteMapping("/me")
    public ResponseEntity<Void> excluirMinhaConta(@Parameter(hidden = true) @AuthenticationPrincipal UserDetails userDetails) {
        usuarioService.excluirPorEmail(userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}