package br.com.saudeemacao.api.repository;

import br.com.saudeemacao.api.model.EnumUsuario.EPerfil;
import br.com.saudeemacao.api.model.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends MongoRepository<Usuario, String> {

    Optional<Usuario> findByEmail(String email);

    Optional<Usuario> findByCpf(String cpf);

    Optional<Usuario> findByTelefone(String telefone);

    boolean existsByEmail(String email);

    boolean existsByCpf(String cpf);

    boolean existsByTelefone(String telefone);

    @Query("{ 'perfil': ?0 }")
    List<Usuario> findByPerfil(EPerfil perfil);

    List<Usuario> findByPerfilAndNomeContainingIgnoreCase(EPerfil perfil, String nome);

    long countByPerfil(EPerfil perfil);
}