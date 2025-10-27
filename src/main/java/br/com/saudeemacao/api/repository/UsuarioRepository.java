package br.com.saudeemacao.api.repository;

import br.com.saudeemacao.api.model.EPerfil;
import br.com.saudeemacao.api.model.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface UsuarioRepository extends MongoRepository<Usuario, String> {

    Optional<Usuario> findByEmail(String email);

    Optional<Usuario> findByCpf(String cpf);

    Optional<Usuario> findByTelefone(String telefone);

    boolean existsByEmail(String email);

    boolean existsByCpf(String cpf);

    boolean existsByTelefone(String telefone);

    @Query("{ 'perfil': ?0 }")
    Page<Usuario> findByPerfil(EPerfil perfil, Pageable pageable);

    // NOVO MÉTODO: Busca usuários por perfil e nome (contendo, case-insensitive).
    Page<Usuario> findByPerfilAndNomeContainingIgnoreCase(EPerfil perfil, String nome, Pageable pageable);

    long countByPerfil(EPerfil perfil);
}