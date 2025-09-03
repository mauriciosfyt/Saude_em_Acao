// src/main/java/br.com.saudeemacao.api/security/oauth2/CustomAuthenticationSuccessHandler.java

package br.com.saudeemacao.api.security.oauth2;

import br.com.saudeemacao.api.model.EPerfil;
import br.com.saudeemacao.api.model.EPlano;
import br.com.saudeemacao.api.model.Usuario;
import br.com.saudeemacao.api.repository.UsuarioRepository;
import br.com.saudeemacao.api.service.LoginService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.UUID;

@Component
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    // URL para a qual o front-end será redirecionado com o token
    // Idealmente, viria de um arquivo de propriedades: @Value("${app.oauth2.redirect-uri}")
    private final String frontendRedirectUrl = "http://localhost:3000/auth/callback";

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private LoginService loginService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

        String email = oauth2User.getAttribute("email");
        String nome = oauth2User.getAttribute("name");
        String fotoPerfil = oauth2User.getAttribute("picture");

        // Verifica se o usuário já existe, senão, cria um novo
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseGet(() -> {
                    Usuario novoUsuario = new Usuario();
                    novoUsuario.setEmail(email);
                    novoUsuario.setNome(nome);
                    novoUsuario.setFotoPerfil(fotoPerfil);
                    novoUsuario.setPerfil(EPerfil.ALUNO); // Perfil padrão para novos usuários
                    novoUsuario.setPlano(EPlano.BASICO); // Plano padrão

                    // A senha não será usada para login, mas o campo não pode ser nulo.
                    // Geramos uma senha aleatória e segura.
                    novoUsuario.setSenha(passwordEncoder.encode(UUID.randomUUID().toString()));

                    return usuarioRepository.save(novoUsuario);
                });

        // Gera o token JWT para o usuário encontrado ou recém-criado
        String token = loginService.gerarToken(usuario);

        // Constrói a URL de redirecionamento para o front-end com o token como parâmetro
        String redirectUrl = UriComponentsBuilder.fromUriString(frontendRedirectUrl)
                .queryParam("token", token)
                .build().toUriString();

        response.sendRedirect(redirectUrl);
    }
}