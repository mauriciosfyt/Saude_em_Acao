package br.com.saudeemacao.api.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import br.com.saudeemacao.api.model.HistoricoTreino;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface HistoricoTreinoRepository extends MongoRepository<HistoricoTreino, String> {
    List<HistoricoTreino> findByAlunoIdAndDataConclusaoAfter(String alunoId, LocalDate data);
}