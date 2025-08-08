// src/main/java/br/com/saudeemacao/api/service/UsuarioService.java
package br.com.saudeemacao.api.service;

import br.com.saudeemacao.api.dto.UsuarioSaidaDTO;
import br.com.saudeemacao.api.dto.UsuarioPerfilDTO;
import br.com.saudeemacao.api.model.EPerfil;
import br.com.saudeemacao.api.model.Usuario;
import br.com.saudeemacao.api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioService {
    @Autowired
    UsuarioRepository repo;

    @Autowired
    PasswordEncoder cripto;

    public Usuario gravar(Usuario u) {
        if (repo.existsByEmail(u.getEmail()))
            throw new RuntimeException("Email já existe!");
        if (repo.existsByCpf(u.getCpf()))
            throw new RuntimeException("CPF já cadastrado!");

        try {
            u.setSenha(cripto.encode(u.getSenha()));
            return repo.save(u);
        } catch (Exception e) {
            throw new RuntimeException("Erro nos valores enviados para usuário!");
        }
    }

    public Usuario alterar(String id, Usuario u) {
        try {
            if (id == null)
                throw new RuntimeException("Id não pode ser nulo!");

            if (u == null)
                throw new RuntimeException("Erro nos valores enviados para usuário!");

            Usuario usuarioExistente = repo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Usuário Inexistente!"));

            usuarioExistente.setNome(u.getNome());
            usuarioExistente.setEmail(u.getEmail());
            usuarioExistente.setCpf(u.getCpf());
            usuarioExistente.setTelefone(u.getTelefone());
            usuarioExistente.setFotoPerfil(u.getFotoPerfil());
            usuarioExistente.setPerfil(u.getPerfil());
            usuarioExistente.setPlano(u.getPlano());

            if (u.getSenha() != null && !u.getSenha().isEmpty()) {
                usuarioExistente.setSenha(cripto.encode(u.getSenha()));
            }

            return repo.save(usuarioExistente);
        } catch (Exception e) {
            throw new RuntimeException("Erro:" + e.getMessage());
        }
    }

    public Usuario buscarPorId(String id) {
        if (id == null)
            throw new RuntimeException("Id não pode ser nulo!");

        return repo.findById(id).orElseThrow(() -> new RuntimeException("Usuário Inexistente!"));
    }

    public List<UsuarioSaidaDTO> buscarTodos(PageRequest pageable) {
        List<Usuario> lista = repo.findAll(pageable).getContent();
        List<UsuarioSaidaDTO> lstDTO = new ArrayList<>();

        for (Usuario usuario : lista) {
            lstDTO.add(new UsuarioSaidaDTO(
                    usuario.getNome(),
                    usuario.getEmail(),
                    usuario.getCpf(),
                    usuario.getTelefone(),
                    usuario.getFotoPerfil(),
                    usuario.getPerfil(),
                    usuario.getPlano()
            ));
        }

        return lstDTO;
    }

    public void excluirPorId(String id) {
        if (id == null)
            throw new RuntimeException("Id não pode ser nulo!");

        if (!repo.existsById(id))
            throw new RuntimeException("Usuário Inexistente!");

        repo.deleteById(id);

        if (repo.existsById(id))
            throw new RuntimeException("Não foi possível excluir o usuário!");
    }

    public Optional<Usuario> buscarPorEmail(String email) {
        return repo.findByEmail(email);
    }

    // --- MÉTODO ADICIONADO PARA O SISTEMA DE RESERVAS ---
    public List<Usuario> buscarTodosAdmins() {
        return repo.findAll().stream()
                .filter(u -> u.getPerfil() == EPerfil.ADMIN)
                .collect(Collectors.toList());
    }

    public UsuarioPerfilDTO buscarPerfilDoUsuarioLogado(UserDetails userDetails) {
        Usuario usuario = repo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário logado não encontrado no sistema!"));
        return new UsuarioPerfilDTO(usuario);
    }

    public Usuario atualizarSenha(String email, String novaSenha) {
        Usuario usuario = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado para redefinição de senha."));
        usuario.setSenha(cripto.encode(novaSenha));
        return repo.save(usuario);
    }
}