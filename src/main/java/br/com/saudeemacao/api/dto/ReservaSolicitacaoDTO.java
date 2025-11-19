package br.com.saudeemacao.api.dto;

import br.com.saudeemacao.api.model.EnumProduto.ECategoria;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReservaSolicitacaoDTO {

    @NotBlank(message = "O ID do produto é obrigatório.")
    private String produtoId;

    @NotNull(message = "A categoria do produto é obrigatória.")
    private ECategoria categoriaProduto;

    private String tamanho;
    private String sabor;

    @NotNull(message = "A quantidade é obrigatória.")
    @Min(value = 1, message = "A quantidade mínima para reserva é 1.")
    @Max(value = 5, message = "A quantidade máxima para reserva é 5.")
    private Integer quantidade;
}