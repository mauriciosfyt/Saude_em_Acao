// src/main/java/br/com/saudeemacao/api/dto/ReservaSolicitacaoDTO.java
package br.com.saudeemacao.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReservaSolicitacaoDTO {

    @NotBlank(message = "O ID do produto é obrigatório.")
    private String produtoId;

    // Opcional, mas necessário para produtos com variação de tamanho
    private String tamanho;
}