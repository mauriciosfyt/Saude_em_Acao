package br.com.saudeemacao.api.dto;

import br.com.saudeemacao.api.model.EnumProduto.ECategoria;
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
}