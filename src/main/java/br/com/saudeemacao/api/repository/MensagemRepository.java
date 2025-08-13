package br.com.saudeemacao.api.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import br.com.saudeemacao.api.model.Mensagem;

@Repository
public interface MensagemRepository extends MongoRepository<Mensagem, String> {
    List<Mensagem> findByChatId(String chatId);
}