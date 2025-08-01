// UsuarioController.java (updated)
package br.com.saudeemacao.api.controller;

import br.com.saudeemacao.api.dto.UsuarioSaidaDTO;
import br.com.saudeemacao.api.dto.UsuarioPerfilDTO;
import br.com.saudeemacao.api.model.Usuario;
import br.com.saudeemacao.api.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {
    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<UsuarioSaidaDTO>> buscartodos(@RequestParam int pag, @RequestParam int qtd) {
        return ResponseEntity.ok(usuarioService.buscarTodos(PageRequest.of(pag, qtd)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable String id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Usuario> cadastrar(@RequestBody Usuario u) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.gravar(u));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> alterar(@PathVariable String id, @RequestBody Usuario u) {
        return ResponseEntity.ok(usuarioService.alterar(id, u));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Usuario> excluir(@PathVariable String id) {
        usuarioService.excluirPorId(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/meu-perfil")
    public ResponseEntity<?> getMeuPerfil() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Não autenticado.");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) principal;
            try {
                UsuarioPerfilDTO perfilDTO = usuarioService.buscarPerfilDoUsuarioLogado(userDetails);
                return ResponseEntity.ok(perfilDTO);
            } catch (RuntimeException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro inesperado ao obter principal.");
        }
    }
}