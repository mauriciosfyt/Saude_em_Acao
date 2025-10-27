package br.com.saudeemacao.api.repository;

import br.com.saudeemacao.api.model.Produto;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProdutoRepository extends MongoRepository<Produto, String> {

    // NOVO MÉTODO: Busca produtos cujo nome contém a string fornecida, ignorando maiúsculas/minúsculas.
    List<Produto> findByNomeContainingIgnoreCase(String nome);
}