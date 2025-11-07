package br.com.saudeemacao.api.repository;

import br.com.saudeemacao.api.model.EnumReserva.EStatusReserva;
import br.com.saudeemacao.api.model.Reserva;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@Repository
public interface ReservaRepository extends MongoRepository<Reserva, String> {

    List<Reserva> findByUsuarioId(String usuarioId);

    List<Reserva> findByStatus(EStatusReserva status);

    List<Reserva> findByStatusAndDataRetiradaBefore(EStatusReserva status, LocalDateTime data);

    long countByUsuarioIdAndStatusIn(String usuarioId, Collection<EStatusReserva> statuses);


    long countByStatus(EStatusReserva status);
    long countByStatusAndDataAnaliseAfter(EStatusReserva status, LocalDateTime data);

    List<Reserva> findByStatusAndDataAnaliseBetween(EStatusReserva status, LocalDateTime inicio, LocalDateTime fim);

    List<Reserva> findByStatusAndDataConclusaoBetween(EStatusReserva status, LocalDateTime inicio, LocalDateTime fim);

    @Aggregation(pipeline = {
            "{ $group: { _id: '$produto', total: { $sum: 1 } } }",
            "{ $sort: { total: -1 } }",
            "{ $limit: 10 }", // Limita aos 10 produtos mais populares
            "{ $project: { produtoId: '$_id', total: 1, _id: 0 } }"
    })
    List<Map<String, Object>> findProdutosMaisReservados();
}