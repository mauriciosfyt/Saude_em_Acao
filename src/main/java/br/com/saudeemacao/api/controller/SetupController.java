package br.com.saudeemacao.api.controller;

import br.com.saudeemacao.api.model.EPerfil;
import br.com.saudeemacao.api.model.Usuario;
import br.com.saudeemacao.api.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/setup")
public class SetupController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/admin")
    public ResponseEntity<String> criarAdmin() {
        Usuario admin = new Usuario();
        admin.setNome("Admin");
        admin.setEmail("saudeemacao.academia@gmail.com");
        admin.setSenha(passwordEncoder.encode("Saude@2025"));
        admin.setPerfil(EPerfil.ADMIN);

        usuarioService.gravar(admin);
        return ResponseEntity.ok("Admin criado com sucesso!");
    }
}