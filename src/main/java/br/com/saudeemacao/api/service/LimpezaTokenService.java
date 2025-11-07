package br.com.saudeemacao.api.service;

import br.com.saudeemacao.api.repository.TokenAcessoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class LimpezaTokenService {

    private static final Logger log = LoggerFactory.getLogger(LimpezaTokenService.class);

    @Autowired
    private TokenAcessoRepository tokenAcessoRepository;

    @Scheduled(cron = "0 0 0 * * *")
    public void limparTokensAntigos() {
        log.info("Iniciando limpeza de tokens antigos...");
        LocalDateTime agora = LocalDateTime.now();

        try {
            tokenAcessoRepository.deleteByExpiraEmBeforeOrUsadoTrue(agora);
            log.info("Limpeza de tokens concluída com sucesso.");
        } catch (Exception e) {
            log.error("Erro ao limpar tokens antigos: {}", e.getMessage());
        }
    }

    // Método adicional para limpeza manual se necessário
    public void limparTokensExpiradosManualmente() {
        log.info("Iniciando limpeza manual de tokens...");
        limparTokensAntigos();
    }
}