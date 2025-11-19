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

    private ETamanho tamanho;
    private ESabor sabor;

    private Integer quantidade;

    private EStatusReserva status;

    private LocalDateTime dataSolicitacao;
    private LocalDateTime dataAnalise;

    private LocalDateTime dataRetirada;

    private LocalDateTime dataConclusao;

    private String motivoAnalise;
}