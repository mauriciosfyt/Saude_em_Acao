package br.com.saudeemacao.api.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime; // Importante para a data funcionar

@Document(collection = "mensagens")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Mensagem {

    @Id
    private String id;
    private String usuario;
    private String conteudo;
    private String imagemUrl;
    private String chatId;
    private LocalDateTime dataEnvio;
}