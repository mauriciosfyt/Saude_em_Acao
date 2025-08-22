package br.com.saudeemacao.api.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import br.com.saudeemacao.api.model.Treino;
import java.util.Optional;

@Repository
public interface TreinoRepository extends MongoRepository<Treino, String> {
    Optional<Treino> findByAlunoId(String alunoId);
}