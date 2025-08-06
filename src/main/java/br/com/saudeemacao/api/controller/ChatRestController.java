package br.com.saudeemacao.api.controller;

import br.com.saudeemacao.api.model.Mensagem;
import br.com.saudeemacao.api.repository.MensagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatRestController {

    @Autowired
    private MensagemRepository mensagemRepository;

    @GetMapping("/historico/{chatId}")
    public ResponseEntity<List<Mensagem>> getChatHistory(@PathVariable String chatId) {
        List<Mensagem> mensagens = mensagemRepository.findByChatId(chatId);
        return ResponseEntity.ok(mensagens);
    }
}