// src/main/java/br.com.saudeemacao.api/model/Reserva.java

package br.com.saudeemacao.api.model;

import br.com.saudeemacao.api.model.EnumProduto.ESabor;
import br.com.saudeemacao.api.model.EnumProduto.ETamanho;
import br.com.saudeemacao.api.model.EnumReserva.EStatusReserva;
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

    // Campos para identificar a variação do produto reservado
    private ETamanho tamanho; // Para produtos de categoria CAMISETAS
    private ESabor sabor;     // Para produtos de categoria CREATINA, WHEY_PROTEIN

    private EStatusReserva status;

    private LocalDateTime dataSolicitacao;
    private LocalDateTime dataAnalise;

    /**
     * NOVO CAMPO:
     * Armazena a data e hora limite para a retirada do produto.
     * Se o usuário não retirar até esta data, a reserva é cancelada.
     */
    private LocalDateTime dataRetirada;

    /**
     * NOVO CAMPO:
     * Armazena a data e hora exatas em que a reserva foi concluída (retirada).
     * Este campo será usado para os filtros de vendas no dashboard.
     */
    private LocalDateTime dataConclusao;

    private String motivoAnalise;
}