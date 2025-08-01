// ProdutoRepository.java
package br.com.saudeemacao.api.repository;

import br.com.saudeemacao.api.model.Produto;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProdutoRepository extends MongoRepository<Produto, String> {
    List<Produto> findByTipo(Produto.TipoProduto tipo);
}