package br.com.saudeemacao.api.repository;

import br.com.saudeemacao.api.model.EPerfil;
import br.com.saudeemacao.api.model.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UsuarioRepository extends MongoRepository<Usuario, String> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);
    boolean existsByTelefone(String telefone); // NOVO MÉTODO

    long countByPerfil(EPerfil perfil);
}