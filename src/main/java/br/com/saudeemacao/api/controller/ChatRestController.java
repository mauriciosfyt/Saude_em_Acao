package br.com.saudeemacao.api.controller;

import br.com.saudeemacao.api.model.EnumUsuario.EPerfil;
import br.com.saudeemacao.api.model.Mensagem;
import br.com.saudeemacao.api.model.Usuario;
import br.com.saudeemacao.api.repository.MensagemRepository;
import br.com.saudeemacao.api.repository.UsuarioRepository;
import br.com.saudeemacao.api.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @GetMapping("/historico/{chatId}")
    public ResponseEntity<List<Mensagem>> getChatHistory(@PathVariable String chatId) {
        List<Mensagem> mensagens = mensagemRepository.findByChatId(chatId);
        return ResponseEntity.ok(mensagens);
    }

    @PostMapping("/enviar-imagem")
    public ResponseEntity<?> enviarImagem(
            @RequestParam("file") MultipartFile file,
            @RequestParam("usuarioId") String usuarioId,
            @RequestParam("chatId") String chatId,
            @RequestParam(value = "legenda", required = false) String legenda
    ) {
        try {
            Usuario usuario = usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            if (usuario.getPerfil() != EPerfil.ADMIN) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Apenas administradores têm permissão para enviar imagens no chat.");
            }

            String urlImagem = cloudinaryService.uploadFile(file);

            Mensagem mensagem = new Mensagem();
            mensagem.setUsuario(usuarioId);
            mensagem.setChatId(chatId);
            mensagem.setConteudo(legenda);
            mensagem.setImagemUrl(urlImagem);
            mensagem.setDataEnvio(LocalDateTime.now());

            Mensagem mensagemSalva = mensagemRepository.save(mensagem);

            notificarWebSocket(mensagemSalva);

            return ResponseEntity.ok(mensagemSalva);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao fazer upload da imagem: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao processar envio: " + e.getMessage());
        }
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
                    // Opcional: Você pode querer remover a imagem do Cloudinary aqui também se desejar
                    // mas por segurança do histórico, geralmente mantemos ou apagamos apenas do banco.

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