package br.com.saudeemacao.api.model;

import br.com.saudeemacao.api.model.EnumProduto.ECategoria;
import br.com.saudeemacao.api.model.EnumProduto.ESabor;
import br.com.saudeemacao.api.model.EnumProduto.ETamanho;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "produtos")
public class Produto {
    @Id
    private String id;

    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 1, max = 100, message = "Nome deve ter entre 1 e 100 caracteres")
    private String nome;

    @NotBlank(message = "Descrição é obrigatória")
    @Size(min = 1, max = 200, message = "Descrição deve ter entre 1 e 200 caracteres")
    private String descricao;

    @NotNull(message = "Preço é obrigatório")
    @Positive(message = "Preço deve ser maior que zero")
    private Double preco;

    private Double precoPromocional;
    private LocalDateTime dataInicioPromocao;
    private LocalDateTime dataFimPromocao;

    @NotBlank(message = "Imagem é obrigatória")
    private String img;

    @NotNull(message = "Categoria é obrigatória")
    private ECategoria categoria;

    @PositiveOrZero(message = "Estoque não pode ser negativo")
    private Integer estoquePadrao;

    private Map<ETamanho, Integer> estoquePorTamanho;
    private Map<ESabor, Integer> estoquePorSabor;

    // Método auxiliar para obter o estoque total, se necessário
    public Integer getEstoqueTotal() {
        if (categoria == null) {
            return 0;
        }
        switch (categoria) {
            case CAMISETAS:
                return estoquePorTamanho != null ? estoquePorTamanho.values().stream().mapToInt(Integer::intValue).sum() : 0;
            case CREATINA:
            case WHEY_PROTEIN:
                return estoquePorSabor != null ? estoquePorSabor.values().stream().mapToInt(Integer::intValue).sum() : 0;
            case VITAMINAS:
                return estoquePadrao != null ? estoquePadrao : 0;
            default:
                return 0;
        }
    }
}