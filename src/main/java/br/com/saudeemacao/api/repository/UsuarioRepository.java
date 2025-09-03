package br.com.saudeemacao.api.repository;

import br.com.saudeemacao.api.model.EPerfil; // Garanta que este import existe
import br.com.saudeemacao.api.model.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UsuarioRepository extends MongoRepository<Usuario, String> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);

    // MÉTODO ADICIONADO PARA O DASHBOARD
    long countByPerfil(EPerfil perfil);
}