package br.com.saudeemacao.api.controller;

import br.com.saudeemacao.api.dto.*;
import br.com.saudeemacao.api.model.TokenAcesso;
import br.com.saudeemacao.api.model.Usuario;
import br.com.saudeemacao.api.repository.UsuarioRepository;
import br.com.saudeemacao.api.service.EmailService;
import br.com.saudeemacao.api.service.TokenAcessoService;
import br.com.saudeemacao.api.service.UsuarioService;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticação", description = "Endpoints para autenticação, gerenciamento de acesso e recuperação de senha.")
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


    @Operation(
            summary = "Etapa 1: Solicitar um token de acesso por e-mail",
            description = "Valida o e-mail e senha do usuário. Se as credenciais estiverem corretas, gera e envia um token de acesso de 5 dígitos (válido por 15 minutos) para o e-mail cadastrado."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Token enviado com sucesso para o e-mail."),
            @ApiResponse(responseCode = "400", description = "Usuário não encontrado.", content = @Content),
            @ApiResponse(responseCode = "401", description = "Senha incorreta.", content = @Content),
            @ApiResponse(responseCode = "500", description = "Erro interno ao tentar enviar o token.", content = @Content)
    })
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

    @Operation(
            summary = "Etapa 2: Realizar login com o token de acesso",
            description = "Valida o token de acesso recebido por e-mail e, se for válido, retorna um token JWT (válido por 1 hora) para ser usado na autenticação das rotas protegidas da API."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login bem-sucedido. Retorna o token JWT.",
                    content = @Content(mediaType = "text/plain", examples = @ExampleObject(value = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."))),
            @ApiResponse(responseCode = "400", description = "Token inválido, expirado ou usuário associado não encontrado.", content = @Content),
            @ApiResponse(responseCode = "500", description = "Erro interno ao gerar o token JWT.", content = @Content)
    })
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

    @Operation(
            summary = "Recuperação (Etapa 1): Solicitar token para redefinir senha",
            description = "Verifica se o e-mail fornecido existe no sistema. Se existir, envia um token de redefinição de senha para o e-mail."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Token de redefinição de senha enviado para o seu e-mail."),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado com o e-mail fornecido.", content = @Content)
    })
    @PostMapping("/esqueci-senha/solicitar")
    public ResponseEntity<String> solicitarRedefinicaoSenha(@Valid @RequestBody RedefinirSenhaSolicitacaoDTO dto) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(dto.getEmail());

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Usuário não encontrado com o e-mail fornecido.");
        }

        try {
            TokenAcesso tokenAcesso = tokenAcessoService.gerarToken(dto.getEmail());
            emailService.enviarTokenRedefinicaoSenha(dto.getEmail(), tokenAcesso.getToken());

            return ResponseEntity.ok("Token de redefinição de senha enviado para o seu e-mail.");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao enviar token de redefinição de senha: " + e.getMessage());
        }
    }

    @Operation(
            summary = "Recuperação (Etapa 2): Validar código de redefinição",
            description = "Verifica se o código recebido por e-mail é válido e não expirou. Se for válido, retorna o próprio código para ser usado na próxima etapa."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Código válido.", content = @Content(mediaType = "application/json", schema = @Schema(example = "{\"codigo\": \"ABC12\"}"))),
            @ApiResponse(responseCode = "400", description = "Código inválido ou expirado.", content = @Content)
    })
    @PostMapping("/esqueci-senha/validar-codigo")
    public ResponseEntity<?> validarCodigo(@RequestBody Map<String, String> payload) {
        String codigo = payload.get("codigo");
        if (codigo == null || codigo.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("erro", "O campo 'codigo' é obrigatório."));
        }

        boolean isTokenValid = tokenAcessoService.validarToken(codigo).isPresent();

        if (isTokenValid) {
            return ResponseEntity.ok(Map.of("codigo", codigo));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("erro", "Código inválido ou expirado."));
        }
    }

    @Operation(
            summary = "Recuperação (Etapa 3): Definir a nova senha",
            description = "Usa o código validado da etapa anterior para autorizar a alteração da senha do usuário."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Senha redefinida com sucesso!"),
            @ApiResponse(responseCode = "400", description = "Código de redefinição inválido, expirado ou já utilizado.", content = @Content)
    })
    @PostMapping("/esqueci-senha/redefinir/{codigo}")
    public ResponseEntity<String> redefinirSenha(
            @Parameter(description = "O código validado na etapa anterior.", required = true, example = "ABC12") @PathVariable String codigo,
            @Valid @RequestBody DefinirNovaSenhaDTO dto) {

        Optional<TokenAcesso> tokenOpt = tokenAcessoService.validarToken(codigo);
        if (tokenOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Código de redefinição inválido, expirado ou já utilizado.");
        }

        TokenAcesso tokenAcesso = tokenOpt.get();
        try {
            usuarioService.atualizarSenha(tokenAcesso.getEmail(), dto.getNovaSenha());
            tokenAcessoService.marcarComoUsado(tokenAcesso);
            return ResponseEntity.ok("Senha redefinida com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao redefinir a senha: " + e.getMessage());
        }
    }
}