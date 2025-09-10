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
import java.util.InputMismatchException;
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
        validarEProcessarUsuario(u, null); // Chama o novo método de validação
        try {
            u.setSenha(cripto.encode(u.getSenha()));
            return repo.save(u);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao salvar usuário: " + e.getMessage());
        }
    }

    public Usuario alterar(String id, Usuario u) {
        if (id == null) {
            throw new RuntimeException("Id não pode ser nulo!");
        }
        Usuario usuarioExistente = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário Inexistente!"));

        // Atualiza os campos do objeto existente com os novos valores
        usuarioExistente.setNome(u.getNome());
        usuarioExistente.setEmail(u.getEmail());
        usuarioExistente.setCpf(u.getCpf());
        usuarioExistente.setTelefone(u.getTelefone());
        usuarioExistente.setFotoPerfil(u.getFotoPerfil());
        usuarioExistente.setPerfil(u.getPerfil());
        usuarioExistente.setPlano(u.getPlano());

        if (u.getSenha() != null && !u.getSenha().isBlank()) {
            usuarioExistente.setSenha(u.getSenha());
        }

        validarEProcessarUsuario(usuarioExistente, id); // Valida o objeto já atualizado

        if (u.getSenha() != null && !u.getSenha().isBlank()) {
            usuarioExistente.setSenha(cripto.encode(u.getSenha()));
        }

        return repo.save(usuarioExistente);
    }

    // NOVO MÉTODO CENTRAL DE VALIDAÇÃO
    private void validarEProcessarUsuario(Usuario u, String idEmAtualizacao) {
        // 1. Normalização dos dados
        u.setEmail(u.getEmail().toLowerCase());
        String cpfNormalizado = u.getCpf().replaceAll("[^\\d]", "");
        u.setCpf(cpfNormalizado);
        String telefoneNormalizado = u.getTelefone().replaceAll("[^\\d]", "");
        u.setTelefone(telefoneNormalizado);

        // 2. Validação do algoritmo do CPF
        if (!isCpfValido(u.getCpf())) {
            throw new RuntimeException("CPF inválido.");
        }

        // 3. Validação de unicidade
        Optional<Usuario> usuarioPorEmail = repo.findByEmail(u.getEmail());
        if (usuarioPorEmail.isPresent() && !usuarioPorEmail.get().getId().equals(idEmAtualizacao)) {
            throw new RuntimeException("Email já existe!");
        }

        // A busca por CPF e Telefone deve ser feita no repositório com os dados normalizados
        // Para isso, precisaríamos de métodos específicos ou de uma query. Por simplicidade, faremos a verificação aqui.
        // A melhor abordagem seria ter os campos já normalizados no banco.
        if (repo.existsByCpf(u.getCpf()) && (idEmAtualizacao == null || !u.getId().equals(idEmAtualizacao))) {
            throw new RuntimeException("CPF já cadastrado!");
        }

        if (repo.existsByTelefone(u.getTelefone()) && (idEmAtualizacao == null || !u.getId().equals(idEmAtualizacao))) {
            throw new RuntimeException("Telefone já cadastrado!");
        }
    }

    // NOVO MÉTODO PARA VALIDAR O ALGORITMO DO CPF
    private boolean isCpfValido(String cpf) {
        cpf = cpf.replaceAll("[^\\d]", "");

        if (cpf.equals("00000000000") || cpf.equals("11111111111") ||
                cpf.equals("22222222222") || cpf.equals("33333333333") ||
                cpf.equals("44444444444") || cpf.equals("55555555555") ||
                cpf.equals("66666666666") || cpf.equals("77777777777") ||
                cpf.equals("88888888888") || cpf.equals("99999999999") ||
                (cpf.length() != 11))
            return (false);

        char dig10, dig11;
        int sm, i, r, num, peso;

        try {
            // Calculo do 1º Dígito Verificador
            sm = 0;
            peso = 10;
            for (i = 0; i < 9; i++) {
                num = (int) (cpf.charAt(i) - 48);
                sm = sm + (num * peso);
                peso = peso - 1;
            }

            r = 11 - (sm % 11);
            if ((r == 10) || (r == 11))
                dig10 = '0';
            else
                dig10 = (char) (r + 48);

            // Calculo do 2º Dígito Verificador
            sm = 0;
            peso = 11;
            for (i = 0; i < 10; i++) {
                num = (int) (cpf.charAt(i) - 48);
                sm = sm + (num * peso);
                peso = peso - 1;
            }

            r = 11 - (sm % 11);
            if ((r == 10) || (r == 11))
                dig11 = '0';
            else
                dig11 = (char) (r + 48);

            return (dig10 == cpf.charAt(9)) && (dig11 == cpf.charAt(10));
        } catch (InputMismatchException erro) {
            return (false);
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

    public void excluirPorEmail(String email) {
        Usuario usuario = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário com e-mail " + email + " não encontrado."));
        repo.delete(usuario);
    }

    public Optional<Usuario> buscarPorEmail(String email) {
        return repo.findByEmail(email.toLowerCase());
    }

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
        // A nova senha já será validada pela anotação @Pattern no DTO `RedefinirSenhaConfirmacaoDTO` se você adicionar lá.
        // Por segurança, você pode adicionar uma validação de regex aqui também.
        usuario.setSenha(cripto.encode(novaSenha));
        return repo.save(usuario);
    }
}