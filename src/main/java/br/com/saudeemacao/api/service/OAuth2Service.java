package br.com.saudeemacao.api.service;

import br.com.saudeemacao.api.model.EPerfil;
import br.com.saudeemacao.api.model.EPlano;
import br.com.saudeemacao.api.model.Usuario;
import br.com.saudeemacao.api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Map;

@Service
public class OAuth2Service extends DefaultOAuth2UserService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        Map<String, Object> attributes = oAuth2User.getAttributes();
        String email = (String) attributes.get("email");

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseGet(() -> {
                    // Se o usuário não existe, crie uma nova conta
                    Usuario novoUsuario = new Usuario();
                    novoUsuario.setEmail(email);
                    novoUsuario.setNome((String) attributes.get("name"));
                    novoUsuario.setFotoPerfil((String) attributes.get("picture"));
                    // Defina um perfil e plano padrão para o novo usuário
                    novoUsuario.setPerfil(EPerfil.ALUNO);
                    novoUsuario.setPlano(EPlano.GRATUITO);
                    // Salve o novo usuário no banco de dados
                    return usuarioRepository.save(novoUsuario);
                });

        return oAuth2User; // Retorne o objeto OAuth2User para o Spring Security
    }
}