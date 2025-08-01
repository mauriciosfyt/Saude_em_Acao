package br.com.saudeemacao.api.repository;

import br.com.saudeemacao.api.model.TokenAcesso;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface TokenAcessoRepository extends MongoRepository<TokenAcesso, String> {
    Optional<TokenAcesso> findByTokenAndUsadoFalse(String token);

    @Query("{ 'email': ?0, 'expiraEm': { $lt: ?1 } }")
    void deleteByEmailAndExpiraEmBefore(String email, LocalDateTime data);

    @Query("{ $or: [ { 'expiraEm': { $lt: ?0 } }, { 'usado': true } ] }")
    void deleteByExpiraEmBeforeOrUsadoTrue(LocalDateTime agora);
}