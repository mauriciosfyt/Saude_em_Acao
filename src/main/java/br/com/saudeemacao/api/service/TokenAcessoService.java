package br.com.saudeemacao.api.service;

import br.com.saudeemacao.api.model.TokenAcesso;
import br.com.saudeemacao.api.repository.TokenAcessoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.security.SecureRandom;

@Service
public class TokenAcessoService {

    @Autowired
    private TokenAcessoRepository repo;

    // Caracteres permitidos no token (letras maiúsculas e números)
    private static final String CARACTERES_PERMITIDOS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom random = new SecureRandom();

    private String gerarTokenAlfanumericoDe6Digitos() {
        StringBuilder token = new StringBuilder(6);
        for (int i = 0; i < 6; i++) {
            // Seleciona um caractere aleatório da lista de caracteres permitidos
            int index = random.nextInt(CARACTERES_PERMITIDOS.length());
            token.append(CARACTERES_PERMITIDOS.charAt(index));
        }
        return token.toString();
    }

    public TokenAcesso gerarToken(String email) {
        String token = gerarTokenAlfanumericoDe6Digitos();

        LocalDateTime agora = LocalDateTime.now();
        LocalDateTime expiraEm = agora.plusMinutes(15);

        TokenAcesso tokenAcesso = TokenAcesso.builder()
                .token(token)
                .email(email)
                .criadoEm(agora)
                .expiraEm(expiraEm)
                .usado(false)
                .build();
        repo.save(tokenAcesso);
        return tokenAcesso;
    }

    // Os demais métodos permanecem iguais
    public Optional<TokenAcesso> validarToken(String token) {
        Optional<TokenAcesso> opt = repo.findByTokenAndUsadoFalse(token);
        if (opt.isPresent() && opt.get().getExpiraEm().isAfter(LocalDateTime.now())) {
            return opt;
        }
        return Optional.empty();
    }

    public void marcarComoUsado(TokenAcesso tokenAcesso) {
        tokenAcesso.setUsado(true);
        repo.save(tokenAcesso);
    }
}