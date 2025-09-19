package br.com.saudeemacao.api.config;

import br.com.saudeemacao.api.model.Usuario;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.IndexOperations;

import jakarta.annotation.PostConstruct;

@Configuration
public class MongoConfig {

    private final MongoTemplate mongoTemplate;

    public MongoConfig(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @PostConstruct
    public void initIndexes() {
        IndexOperations indexOps = mongoTemplate.indexOps(Usuario.class);

        // REMOVIDA a criação de índices para email, cpf e telefone,
        // pois eles já são gerenciados pela anotação @Indexed na classe Usuario.

        // MANTIDO: Índice para perfil (pois não tem anotação @Indexed no modelo)
        indexOps.ensureIndex(new Index().on("perfil", org.springframework.data.domain.Sort.Direction.ASC));
    }
}