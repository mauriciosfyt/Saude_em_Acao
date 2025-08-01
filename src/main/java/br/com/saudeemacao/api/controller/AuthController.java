// AuthController.java (updated)
package br.com.saudeemacao.api.controller;

import br.com.saudeemacao.api.dto.TokenSolicitacaoDTO;
import br.com.saudeemacao.api.dto.TokenLoginDTO;
import br.com.saudeemacao.api.dto.RedefinirSenhaSolicitacaoDTO;
import br.com.saudeemacao.api.dto.RedefinirSenhaConfirmacaoDTO;
import br.com.saudeemacao.api.model.TokenAcesso;
import br.com.saudeemacao.api.model.Usuario;
import br.com.saudeemacao.api.repository.UsuarioRepository;
import br.com.saudeemacao.api.service.TokenAcessoService;
import br.com.saudeemacao.api.service.EmailService;
import br.com.saudeemacao.api.service.UsuarioService;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private TokenAcessoService tokenAcessoService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UsuarioService usuarioService;

    @Value("${spring.security.jwt.secret}")
    private String chaveSecreta;

    private final String jwtIssuer = "API SaudeEmAcao";

    @PostMapping("/solicitar-token")
    public ResponseEntity<String> solicitarToken(@Valid @RequestBody TokenSolicitacaoDTO dto) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(dto.getEmail());
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Usuário não encontrado.");
        }

        Usuario usuario = usuarioOpt.get();

        if (!passwordEncoder.matches(dto.getSenha(), usuario.getSenha())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Senha incorreta.");
        }

        try {
            TokenAcesso tokenAcesso = tokenAcessoService.gerarToken(dto.getEmail());
            emailService.enviarToken(dto.getEmail(), tokenAcesso.getToken());
            return ResponseEntity.ok("Token enviado para o email.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao enviar token: " + e.getMessage());
        }
    }

    @PostMapping("/login-token")
    public ResponseEntity<String> loginComToken(@Valid @RequestBody TokenLoginDTO dto) {
        Optional<TokenAcesso> tokenOpt = tokenAcessoService.validarToken(dto.getToken());
        if (tokenOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token inválido ou expirado (o token dura apenas 15 minutos e deve ser reenviado para o e-mail cadastrado no sistema).");
        }
        TokenAcesso tokenAcesso = tokenOpt.get();
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(tokenAcesso.getEmail());
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Usuário associado ao token não encontrado.");
        }
        Usuario usuario = usuarioOpt.get();
        tokenAcessoService.marcarComoUsado(tokenAcesso);

        try {
            Algorithm algorithm = Algorithm.HMAC256(chaveSecreta);
            String tokenJwt = JWT.create()
                    .withIssuer(jwtIssuer)
                    .withSubject(usuario.getEmail())
                    .withClaim("perfil", usuario.getPerfil().name())
                    .withClaim("id", usuario.getId())
                    .withExpiresAt(Instant.now().plus(3600, ChronoUnit.SECONDS))
                    .sign(algorithm);

            return ResponseEntity.ok(tokenJwt);

        } catch (JWTCreationException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao gerar JWT após login com token de acesso: " + e.getMessage());
        }
    }

    @PostMapping("/esqueci-senha/solicitar")
    public ResponseEntity<String> solicitarRedefinicaoSenha(@Valid @RequestBody RedefinirSenhaSolicitacaoDTO dto) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(dto.getEmail());
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Se o e-mail estiver cadastrado, um token de redefinição de senha será enviado.");
        }

        try {
            TokenAcesso tokenAcesso = tokenAcessoService.gerarToken(dto.getEmail());
            emailService.enviarToken(dto.getEmail(), tokenAcesso.getToken());
            return ResponseEntity.ok("Se o e-mail estiver cadastrado, um token de redefinição de senha será enviado.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao enviar token de redefinição de senha: " + e.getMessage());
        }
    }

    @PostMapping("/esqueci-senha/confirmar")
    public ResponseEntity<String> confirmarRedefinicaoSenha(@Valid @RequestBody RedefinirSenhaConfirmacaoDTO dto) {
        Optional<TokenAcesso> tokenOpt = tokenAcessoService.validarToken(dto.getToken());
        if (tokenOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token de redefinição de senha inválido ou expirado.");
        }

        TokenAcesso tokenAcesso = tokenOpt.get();
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(tokenAcesso.getEmail());
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Usuário associado ao token não encontrado.");
        }

        Usuario usuario = usuarioOpt.get();

        try {
            tokenAcessoService.marcarComoUsado(tokenAcesso);
            usuarioService.atualizarSenha(usuario.getEmail(), dto.getNovaSenha());
            return ResponseEntity.ok("Senha redefinida com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao redefinir a senha: " + e.getMessage());
        }
    }
}