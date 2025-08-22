package br.com.saudeemacao.api.model;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

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
    @NotBlank(message = "Imagem é obrigatória")
    private String img;

    // --- NOVOS CAMPOS PARA ATENDER AOS REQUISITOS ---
    private ESabor sabor;
    private TipoProduto tipo;

    @PositiveOrZero(message = "Estoque não pode ser negativo")
    private Integer estoque;
    private Map<Tamanho, Integer> estoquePorTamanho;

    public enum Tamanho {
        PP, P, M, G, GG, XG, XGG
    }

    public enum TipoProduto {
        COMTAMANHO, SEMTAMANHO, SUPLEMENTO, VESTUARIO
    }

    public Integer getEstoqueTotal() {
        if (tipo == TipoProduto.COMTAMANHO || tipo == TipoProduto.VESTUARIO) {
            return estoquePorTamanho != null ?
                    estoquePorTamanho.values().stream().mapToInt(Integer::intValue).sum() :
                    0;
        } else {
            return estoque != null ? estoque : 0;
        }
    }
}