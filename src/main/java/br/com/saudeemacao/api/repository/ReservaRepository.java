// src/main/java/br/com/saudeemacao/api/repository/ReservaRepository.java

package br.com.saudeemacao.api.repository;

import br.com.saudeemacao.api.model.EStatusReserva;
import br.com.saudeemacao.api.model.Reserva;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Repository
public interface ReservaRepository extends MongoRepository<Reserva, String> {

    // Para buscar as reservas de um usuário
    List<Reserva> findByUsuarioId(String usuarioId);

    // Para o admin filtrar por status
    List<Reserva> findByStatus(EStatusReserva status);

    // --- MÉTODOS ADICIONADOS PARA AS MELHORIAS ---

    /**
     * NOVO MÉTODO:
     * Usado pelo serviço agendado para encontrar reservas aprovadas
     * cuja data de retirada já passou.
     */
    List<Reserva> findByStatusAndDataRetiradaBefore(EStatusReserva status, LocalDateTime data);

    // 2. Para verificar o limite de reservas ativas de um aluno
    long countByUsuarioIdAndStatusIn(String usuarioId, Collection<EStatusReserva> statuses);

    // 3. Para as estatísticas do dashboard do admin
    long countByStatus(EStatusReserva status);
    long countByStatusAndDataAnaliseAfter(EStatusReserva status, LocalDateTime data);
}