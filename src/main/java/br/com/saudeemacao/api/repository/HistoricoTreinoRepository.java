package br.com.saudeemacao.api.repository;

import br.com.saudeemacao.api.model.HistoricoTreino;
import org.springframework.data.domain.Pageable; // Importar
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HistoricoTreinoRepository extends MongoRepository<HistoricoTreino, String> {

    // Método que já existia
    List<HistoricoTreino> findByAlunoIdAndDataRealizacaoBetween(String alunoId, LocalDateTime inicio, LocalDateTime fim);

    // =================================================================
    // === MÉTODOS ADICIONADOS PARA O PAINEL DE MÉTRICAS DO PLANO GOLD ======
    // =================================================================

    /**
     * NOVO MÉTODO (CORREÇÃO):
     * Conta de forma otimizada a quantidade de treinos de um aluno em um intervalo de datas.
     * Usado para calcular os treinos no mês atual.
     */
    long countByAlunoIdAndDataRealizacaoBetween(String alunoId, LocalDateTime inicio, LocalDateTime fim);

    /**
     * NOVO MÉTODO (CORREÇÃO):
     * Conta o total de treinos já realizados por um aluno.
     */
    long countByAlunoId(String alunoId);

    /**
     * NOVO MÉTODO:
     * Busca o histórico de treinos de um aluno, ordenado pela data mais recente.
     * Essencial para o cálculo de dias consecutivos.
     */
    List<HistoricoTreino> findByAlunoIdOrderByDataRealizacaoDesc(String alunoId);

    /**
     * ======================= MODIFICAÇÃO AQUI =======================
     * NOVO MÉTODO (CORREÇÃO DE PERFORMANCE):
     * Busca os históricos de treino mais recentes de um aluno, limitado pelo Pageable.
     * Essencial para o cálculo otimizado de dias consecutivos.
     * ================================================================
     */
    List<HistoricoTreino> findByAlunoIdOrderByDataRealizacaoDesc(String alunoId, Pageable pageable);
}