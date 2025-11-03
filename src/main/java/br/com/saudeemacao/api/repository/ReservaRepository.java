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

    // Para buscar as reservas de um usuário
    List<Reserva> findByUsuarioId(String usuarioId);

    // Para o admin filtrar por status
    List<Reserva> findByStatus(EStatusReserva status);

    // Usado pelo serviço agendado para encontrar reservas aprovadas
    // cuja data de retirada já passou.
    List<Reserva> findByStatusAndDataRetiradaBefore(EStatusReserva status, LocalDateTime data);

    // Para verificar o limite de reservas ativas de um aluno
    long countByUsuarioIdAndStatusIn(String usuarioId, Collection<EStatusReserva> statuses);

    // Para as estatísticas do dashboard do admin
    long countByStatus(EStatusReserva status);
    long countByStatusAndDataAnaliseAfter(EStatusReserva status, LocalDateTime data);

    /**
     * Encontra todas as reservas com um determinado status (ex: APROVADA)
     * dentro de um intervalo de datas de ANÁLISE.
     */
    List<Reserva> findByStatusAndDataAnaliseBetween(EStatusReserva status, LocalDateTime inicio, LocalDateTime fim);

    /**
     * NOVO MÉTODO (CORREÇÃO PARA O DASHBOARD):
     * Encontra todas as reservas com um determinado status (CONCLUIDA)
     * dentro de um intervalo de datas de CONCLUSÃO.
     */
    List<Reserva> findByStatusAndDataConclusaoBetween(EStatusReserva status, LocalDateTime inicio, LocalDateTime fim);


    /**
     * Agregação para contar reservas por produto e ranquear os mais populares.
     * Retorna uma lista de mapas, onde cada mapa contém "produtoId" e "total".
     */
    @Aggregation(pipeline = {
            "{ $group: { _id: '$produto', total: { $sum: 1 } } }",
            "{ $sort: { total: -1 } }",
            "{ $limit: 10 }", // Limita aos 10 produtos mais populares
            "{ $project: { produtoId: '$_id', total: 1, _id: 0 } }"
    })
    List<Map<String, Object>> findProdutosMaisReservados();
}