package br.com.saudeemacao.api.controller;

import br.com.saudeemacao.api.model.Mensagem;
import br.com.saudeemacao.api.repository.MensagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private MensagemRepository mensagemRepository;

    @MessageMapping("/chat.sendMessage/{chatId}")
    @SendTo("/topic/chat/{chatId}")
    @PreAuthorize("isAuthenticated()")
    public Mensagem sendMessage(@DestinationVariable String chatId, @Payload Mensagem mensagem) {
        mensagem.setChatId(chatId);
        mensagemRepository.save(mensagem);
        return mensagem;
    }
}