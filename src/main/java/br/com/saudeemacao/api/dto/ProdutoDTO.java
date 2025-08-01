// ProdutoDTO.java
package br.com.saudeemacao.api.dto;

import br.com.saudeemacao.api.model.Produto.Tamanho;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Data
public class ProdutoDTO {

    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 1, max = 100, message = "Nome deve ter entre 1 e 100 caracteres")
    private String nome;

    @NotBlank(message = "Descrição é obrigatória")
    @Size(min = 1, max = 200, message = "Descrição deve ter entre 1 e 200 caracteres")
    private String descricao;

    @NotNull(message = "Preço é obrigatório")
    @Positive(message = "Preço deve ser maior que zero")
    private Double preco;

    @PositiveOrZero(message = "Estoque não pode ser negativo")
    private Integer estoque;

    private Map<String, Integer> estoquePorTamanho;

    @NotNull(message = "Imagem é obrigatória")
    private MultipartFile img;
}