// src/main/java/br/com/saudeemacao/api/model/Reserva.java
package br.com.saudeemacao.api.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "reservas")
public class Reserva {

    @Id
    private String id;

    @DBRef
    private Usuario usuario;

    @DBRef
    private Produto produto;

    private Produto.Tamanho tamanho;

    private EStatusReserva status;

    private LocalDateTime dataSolicitacao;
    private LocalDateTime dataAnalise;

    private String motivoAnalise; // <-- CAMPO ADICIONADO
}