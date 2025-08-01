package br.com.saudeemacao.api.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "tokens_acesso")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenAcesso {
    @Id
    private String id;

    private String token;
    private String email;
    private LocalDateTime criadoEm;
    private LocalDateTime expiraEm;
    private boolean usado;
}