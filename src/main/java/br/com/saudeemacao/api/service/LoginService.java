// src/main/java/br.com.saudeemacao.api/service/LoginService.java

package br.com.saudeemacao.api.service;

import br.com.saudeemacao.api.model.Usuario;
import br.com.saudeemacao.api.repository.UsuarioRepository;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class LoginService implements UserDetailsService {

    @Value("${spring.security.jwt.secret}")
    private String chaveSecreta;

    private final String jwtIssuer = "API SaudeEmAcao";

    @Autowired
    private UsuarioRepository usuarioRepository;

    public String autenticar(Usuario usuario,
                             AuthenticationManager authenticationManager) {
        UsernamePasswordAuthenticationToken upat = new UsernamePasswordAuthenticationToken(usuario.getEmail(),
                usuario.getSenha());

        Authentication usuarioLogado = authenticationManager.authenticate(upat);
        return gerarToken((Usuario) usuarioLogado.getPrincipal());
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado!"));
    }

    /**
     * ALTERADO: Visibilidade de 'private' para 'public' para ser usado pelo handler do OAuth2.
     */
    public String gerarToken(Usuario usuario) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(chaveSecreta);

            String token = JWT.create()
                    .withIssuer(jwtIssuer)
                    .withSubject(usuario.getEmail())
                    .withExpiresAt(Instant.now().plus(3600, ChronoUnit.SECONDS))
                    .sign(algorithm);
            return token;

        } catch (JWTCreationException e) {
            throw new RuntimeException("Erro ao gerar token JWT: " + e.getMessage(), e);
        }
    }

    public String validaToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(chaveSecreta);
            return JWT.require(algorithm)
                    .withIssuer(jwtIssuer)
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException e) {
            System.err.println("Falha na validação do token: " + e.getMessage());
            throw new RuntimeException("Token inválido ou expirado.");
        } catch (IllegalArgumentException e) {
            System.err.println("Token em formato inválido ou chave secreta nula/vazia: " + e.getMessage());
            throw new RuntimeException("Erro de validação de token.");
        }
    }
}