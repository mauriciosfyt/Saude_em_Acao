package br.com.saudeemacao.api.repository;

import br.com.saudeemacao.api.model.HistoricoTreino;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HistoricoTreinoRepository extends MongoRepository<HistoricoTreino, String> {

    // Busca o histórico de um aluno específico dentro de um período
    List<HistoricoTreino> findByAlunoIdAndDataRealizacaoBetween(String alunoId, LocalDateTime inicio, LocalDateTime fim);
}