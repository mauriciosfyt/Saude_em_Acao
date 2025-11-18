package br.com.saudeemacao.api.controller;

import br.com.saudeemacao.api.model.Mensagem;
import br.com.saudeemacao.api.repository.MensagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*") // Permite acesso do React Native
public class ChatRestController {

    @Autowired
    private MensagemRepository mensagemRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping("/historico/{chatId}")
    public ResponseEntity<List<Mensagem>> getChatHistory(@PathVariable String chatId) {
        List<Mensagem> mensagens = mensagemRepository.findByChatId(chatId);
        return ResponseEntity.ok(mensagens);
    }

    @PostMapping("/enviar")
    public ResponseEntity<Mensagem> enviarMensagem(@RequestBody Mensagem mensagem) {
        // Define a data de envio se não vier do front
        if (mensagem.getDataEnvio() == null) {
            mensagem.setDataEnvio(LocalDateTime.now());
        }
        Mensagem mensagemSalva = mensagemRepository.save(mensagem);

        notificarWebSocket(mensagemSalva);

        return ResponseEntity.ok(mensagemSalva);
    }

    @PutMapping("/editar/{id}")
    public ResponseEntity<Mensagem> editarMensagem(@PathVariable String id, @RequestBody Mensagem novaInfo) {
        return mensagemRepository.findById(id)
                .map(msg -> {
                    msg.setConteudo(novaInfo.getConteudo());

                    Mensagem atualizada = mensagemRepository.save(msg);
                    notificarWebSocket(atualizada); // Envia a versão atualizada

                    return ResponseEntity.ok(atualizada);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<Void> deletarMensagem(@PathVariable String id) {
        return mensagemRepository.findById(id)
                .map(msg -> {
                    String chatId = msg.getChatId();
                    mensagemRepository.delete(msg);

                    msg.setConteudo(null);
                    if (chatId != null) {
                        messagingTemplate.convertAndSend("/topic/chat/" + chatId, msg);
                    }

                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private void notificarWebSocket(Mensagem mensagem) {
        if (mensagem.getChatId() != null) {
            try {
                messagingTemplate.convertAndSend("/topic/chat/" + mensagem.getChatId(), mensagem);
            } catch (Exception e) {
                System.err.println("Erro ao notificar WebSocket: " + e.getMessage());
            }
        }
    }
}