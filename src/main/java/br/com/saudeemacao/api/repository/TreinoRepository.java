package br.com.saudeemacao.api.repository;

import br.com.saudeemacao.api.model.Treino;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TreinoRepository extends MongoRepository<Treino, String> {

    List<Treino> findByResponsavelId(String responsavelId);

    List<Treino> findByNomeContainingIgnoreCase(String nome);
    List<Treino> findByTipoDeTreinoContainingIgnoreCase(String tipo);
}