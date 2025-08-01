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
        admin.setEmail("feliperottnerrodrigues@gmail.com");
        admin.setCpf("539.799.528-27");
        admin.setSenha(new BCryptPasswordEncoder().encode("Corinthians13@&"));
        admin.setTelefone("(11) 91349-2849");
        admin.setPerfil(EPerfil.ADMIN);
        admin.setPlano(EPlano.PREMIUM);

        usuarioService.gravar(admin);
        return ResponseEntity.ok("Admin criado com sucesso!");
    }
}