package br.com.saudeemacao.api.controller;

import br.com.saudeemacao.api.model.Mensagem;
import br.com.saudeemacao.api.repository.MensagemRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@Tag(name = "Chat", description = "Endpoints REST para funcionalidades de suporte ao chat, como buscar histórico de mensagens.")
@CrossOrigin(origins = "*")
public class ChatRestController {

    @Autowired
    private MensagemRepository mensagemRepository;

    @SecurityRequirement(name = "bearerAuth")
    @Operation(
            summary = "Busca o histórico de mensagens de um chat",
            description = "Recupera todas as mensagens salvas para um determinado ID de chat. Requer autenticação."
    )
    @ApiResponse(
            responseCode = "200",
            description = "Histórico de mensagens retornado com sucesso.",
            content = @Content(
                    mediaType = "application/json",
                    array = @ArraySchema(schema = @Schema(implementation = Mensagem.class))
            )
    )
    @GetMapping("/historico/{chatId}")
    public ResponseEntity<List<Mensagem>> getChatHistory(
            @Parameter(description = "ID único do chat para o qual o histórico será recuperado.", required = true, example = "aluno123-professor456")
            @PathVariable String chatId) {
        List<Mensagem> mensagens = mensagemRepository.findByChatId(chatId);
        return ResponseEntity.ok(mensagens);
    }
}