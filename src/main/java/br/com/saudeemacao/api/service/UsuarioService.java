package br.com.saudeemacao.api.service;

import br.com.saudeemacao.api.dto.*;
import br.com.saudeemacao.api.model.EPerfil;
import br.com.saudeemacao.api.model.EPlano;
import br.com.saudeemacao.api.model.Usuario;
import br.com.saudeemacao.api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CloudinaryService cloudinaryService;

    // Métodos de criação específicos por perfil
    public Usuario criarAluno(AlunoCreateDTO dto) throws IOException {
        validarCamposObrigatorios(dto.getNome(), dto.getEmail(), dto.getCpf(), dto.getTelefone(), dto.getSenha());
        validarCpf(dto.getCpf());

        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail().toLowerCase());
        usuario.setCpf(normalizarCpf(dto.getCpf()));
        usuario.setTelefone(normalizarTelefone(dto.getTelefone()));
        usuario.setSenha(passwordEncoder.encode(dto.getSenha()));

        // Ordem corrigida: perfil primeiro, depois o plano.
        usuario.setPerfil(EPerfil.ALUNO);
        usuario.setPlano(dto.getPlano());

        if (dto.getFotoPerfil() != null && !dto.getFotoPerfil().isEmpty()) {
            String fotoUrl = cloudinaryService.uploadFile(dto.getFotoPerfil());
            usuario.setFotoPerfil(fotoUrl);
        }

        return repo.save(usuario);
    }

    public Usuario criarProfessor(ProfessorCreateDTO dto) throws IOException {
        validarCamposObrigatorios(dto.getNome(), dto.getEmail(), dto.getCpf(), dto.getTelefone(), dto.getSenha());
        validarCpf(dto.getCpf());

        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail().toLowerCase());
        usuario.setCpf(normalizarCpf(dto.getCpf()));
        usuario.setTelefone(normalizarTelefone(dto.getTelefone()));
        usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        usuario.setPerfil(EPerfil.PROFESSOR);

        if (dto.getFotoPerfil() != null && !dto.getFotoPerfil().isEmpty()) {
            String fotoUrl = cloudinaryService.uploadFile(dto.getFotoPerfil());
            usuario.setFotoPerfil(fotoUrl);
        }

        return repo.save(usuario);
    }

    public Usuario criarAdmin(UsuarioCreateDTO dto) { // Alterado aqui
        // As validações do DTO já foram checadas pelo Spring.
        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail().toLowerCase());
        usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        usuario.setPerfil(EPerfil.ADMIN);

        return repo.save(usuario);
    }

    // Método de atualização genérico
    public Usuario atualizarUsuario(String id, UsuarioUpdateDTO dto, EPerfil perfilEsperado) throws IOException {
        Usuario usuarioExistente = buscarPorId(id);

        if (usuarioExistente.getPerfil() != perfilEsperado) {
            throw new RuntimeException("Perfil do usuário não corresponde ao esperado");
        }

        if (dto.getNome() != null && !dto.getNome().trim().isEmpty()) {
            usuarioExistente.setNome(dto.getNome());
        }

        if (dto.getEmail() != null && !dto.getEmail().trim().isEmpty()) {
            validarEmailUnico(dto.getEmail(), id);
            usuarioExistente.setEmail(dto.getEmail().toLowerCase());
        }

        if (dto.getCpf() != null && !dto.getCpf().trim().isEmpty()) {
            validarCpf(dto.getCpf());
            validarCpfUnico(dto.getCpf(), id);
            usuarioExistente.setCpf(normalizarCpf(dto.getCpf()));
        }

        if (dto.getTelefone() != null && !dto.getTelefone().trim().isEmpty()) {
            validarTelefoneUnico(dto.getTelefone(), id);
            usuarioExistente.setTelefone(normalizarTelefone(dto.getTelefone()));
        }

        if (dto.getSenha() != null && !dto.getSenha().trim().isEmpty()) {
            usuarioExistente.setSenha(passwordEncoder.encode(dto.getSenha()));
        }

        if (dto.getPlano() != null) {
            if (usuarioExistente.getPerfil() != EPerfil.ALUNO) {
                throw new RuntimeException("Plano só é permitido para alunos");
            }
            usuarioExistente.setPlano(dto.getPlano());
        }

        if (dto.getFotoPerfil() != null && !dto.getFotoPerfil().isEmpty()) {
            if (usuarioExistente.getFotoPerfil() != null) {
                try {
                    cloudinaryService.deleteFile(extrairPublicId(usuarioExistente.getFotoPerfil()));
                } catch (Exception e) {
                    System.err.println("Erro ao deletar imagem antiga: " + e.getMessage());
                }
            }
            String fotoUrl = cloudinaryService.uploadFile(dto.getFotoPerfil());
            usuarioExistente.setFotoPerfil(fotoUrl);
        }

        return repo.save(usuarioExistente);
    }

    // Métodos de consulta
    public List<UsuarioSaidaDTO> buscarPorPerfil(EPerfil perfil, PageRequest pageable) {
        Page<Usuario> usuariosPage = repo.findByPerfil(perfil, pageable);
        return usuariosPage.getContent().stream()
                .map(this::toUsuarioSaidaDTO)
                .collect(Collectors.toList());
    }

    // NOVO MÉTODO: para buscar por perfil e nome
    public List<UsuarioSaidaDTO> buscarPorPerfilENome(EPerfil perfil, String nome, PageRequest pageable) {
        Page<Usuario> usuariosPage = repo.findByPerfilAndNomeContainingIgnoreCase(perfil, nome, pageable);
        return usuariosPage.getContent().stream()
                .map(this::toUsuarioSaidaDTO)
                .collect(Collectors.toList());
    }

    public Usuario buscarPorId(String id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));
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

    // Métodos de exclusão
    public void excluirPorId(String id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado com ID: " + id);
        }

        Usuario usuario = buscarPorId(id);
        if (usuario.getFotoPerfil() != null) {
            try {
                cloudinaryService.deleteFile(extrairPublicId(usuario.getFotoPerfil()));
            } catch (Exception e) {
                System.err.println("Erro ao deletar imagem do usuário: " + e.getMessage());
            }
        }

        repo.deleteById(id);
    }

    public void excluirPorEmail(String email) {
        Usuario usuario = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário com e-mail " + email + " não encontrado."));

        if (usuario.getFotoPerfil() != null) {
            try {
                cloudinaryService.deleteFile(extrairPublicId(usuario.getFotoPerfil()));
            } catch (Exception e) {
                System.err.println("Erro ao deletar imagem do usuário: " + e.getMessage());
            }
        }

        repo.delete(usuario);
    }

    // Método de atualização de senha (para redefinição)
    public Usuario atualizarSenha(String email, String novaSenha) {
        Usuario usuario = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado para redefinição de senha."));
        usuario.setSenha(passwordEncoder.encode(novaSenha));
        return repo.save(usuario);
    }


    private void validarCamposObrigatorios(String nome, String email, String cpf, String telefone, String senha) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new RuntimeException("Nome é obrigatório");
        }
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email é obrigatório");
        }
        if (cpf == null || cpf.trim().isEmpty()) {
            throw new RuntimeException("CPF é obrigatório");
        }
        if (telefone == null || telefone.trim().isEmpty()) {
            throw new RuntimeException("Telefone é obrigatório");
        }
        if (senha == null || senha.trim().isEmpty()) {
            throw new RuntimeException("Senha é obrigatória");
        }
    }

    private void validarCpf(String cpf) {
        String cpfNormalizado = normalizarCpf(cpf);

        if (cpfNormalizado.length() != 11 ||
                cpfNormalizado.equals("00000000000") ||
                cpfNormalizado.equals("11111111111") ||
                cpfNormalizado.equals("22222222222") ||
                cpfNormalizado.equals("33333333333") ||
                cpfNormalizado.equals("44444444444") ||
                cpfNormalizado.equals("55555555555") ||
                cpfNormalizado.equals("66666666666") ||
                cpfNormalizado.equals("77777777777") ||
                cpfNormalizado.equals("88888888888") ||
                cpfNormalizado.equals("99999999999")) {
            throw new RuntimeException("CPF inválido");
        }

        try {
            int soma = 0;
            int peso = 10;

            for (int i = 0; i < 9; i++) {
                int num = Integer.parseInt(cpfNormalizado.substring(i, i + 1));
                soma += num * peso;
                peso--;
            }

            int resto = 11 - (soma % 11);
            String digitoVerificador1 = (resto == 10 || resto == 11) ? "0" : Integer.toString(resto);

            if (!digitoVerificador1.equals(cpfNormalizado.substring(9, 10))) {
                throw new RuntimeException("CPF inválido");
            }

            soma = 0;
            peso = 11;

            for (int i = 0; i < 10; i++) {
                int num = Integer.parseInt(cpfNormalizado.substring(i, i + 1));
                soma += num * peso;
                peso--;
            }

            resto = 11 - (soma % 11);
            String digitoVerificador2 = (resto == 10 || resto == 11) ? "0" : Integer.toString(resto);

            if (!digitoVerificador2.equals(cpfNormalizado.substring(10, 11))) {
                throw new RuntimeException("CPF inválido");
            }

        } catch (NumberFormatException e) {
            throw new RuntimeException("CPF inválido");
        }
    }

    private void validarEmailUnico(String email, String idExcluir) {
        Optional<Usuario> usuarioExistente = repo.findByEmail(email.toLowerCase());
        if (usuarioExistente.isPresent() && !usuarioExistente.get().getId().equals(idExcluir)) {
            throw new RuntimeException("Email já cadastrado");
        }
    }

    private void validarCpfUnico(String cpf, String idExcluir) {
        String cpfNormalizado = normalizarCpf(cpf);
        Optional<Usuario> usuarioExistente = repo.findByCpf(cpfNormalizado);
        if (usuarioExistente.isPresent() && !usuarioExistente.get().getId().equals(idExcluir)) {
            throw new RuntimeException("CPF já cadastrado");
        }
    }

    private void validarTelefoneUnico(String telefone, String idExcluir) {
        String telefoneNormalizado = normalizarTelefone(telefone);
        Optional<Usuario> usuarioExistente = repo.findByTelefone(telefoneNormalizado);
        if (usuarioExistente.isPresent() && !usuarioExistente.get().getId().equals(idExcluir)) {
            throw new RuntimeException("Telefone já cadastrado");
        }
    }

    private String normalizarCpf(String cpf) {
        return cpf.replaceAll("[^\\d]", "");
    }

    private String normalizarTelefone(String telefone) {
        return telefone.replaceAll("[^\\d]", "");
    }

    private String extrairPublicId(String url) {
        try {
            return url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
        } catch (Exception e) {
            throw new RuntimeException("URL da imagem inválida");
        }
    }

    private UsuarioSaidaDTO toUsuarioSaidaDTO(Usuario usuario) {
        return new UsuarioSaidaDTO(
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getCpf(),
                usuario.getTelefone(),
                usuario.getFotoPerfil(),
                usuario.getPerfil(),
                usuario.getPlano()
        );
    }
}