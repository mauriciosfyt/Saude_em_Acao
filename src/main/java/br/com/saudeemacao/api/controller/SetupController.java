// SetupController.java (updated)
package br.com.saudeemacao.api.controller;

import br.com.saudeemacao.api.model.EPerfil;
import br.com.saudeemacao.api.model.EPlano;
import br.com.saudeemacao.api.model.Usuario;
import br.com.saudeemacao.api.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/setup")
public class SetupController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/admin")
    public ResponseEntity<String> criarAdmin() {
        Usuario admin = new Usuario();
        admin.setNome("Admin");
        admin.setEmail("saudeemacao.academia@gmail.com");
        admin.setCpf("123.456.789-27");
        admin.setSenha(new BCryptPasswordEncoder().encode("Saude@2025"));
        admin.setTelefone("(11) 91349-2849");
        admin.setPerfil(EPerfil.ADMIN);
        admin.setPlano(EPlano.GOLD);

        usuarioService.gravar(admin);
        return ResponseEntity.ok("Admin criado com sucesso!");
    }
}