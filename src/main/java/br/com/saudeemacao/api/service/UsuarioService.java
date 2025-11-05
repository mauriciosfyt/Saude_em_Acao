package br.com.saudeemacao.api.service;

import br.com.saudeemacao.api.dto.AlunoCreateDTO;
import br.com.saudeemacao.api.dto.PlanoGoldDetalhesDTO;
import br.com.saudeemacao.api.dto.ProfessorCreateDTO;
import br.com.saudeemacao.api.dto.UsuarioCreateDTO;
import br.com.saudeemacao.api.dto.UsuarioPerfilDTO;
import br.com.saudeemacao.api.dto.UsuarioSaidaDTO;
import br.com.saudeemacao.api.dto.UsuarioUpdateDTO;
import br.com.saudeemacao.api.exception.RecursoNaoEncontradoException;
import br.com.saudeemacao.api.model.EnumUsuario.EPerfil;
import br.com.saudeemacao.api.model.EnumUsuario.EPlano;
import br.com.saudeemacao.api.model.EnumUsuario.EStatus;
import br.com.saudeemacao.api.model.Usuario;
import br.com.saudeemacao.api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service("usuarioService")
public class UsuarioService {

    @Autowired
    private UsuarioRepository repo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CloudinaryService cloudinaryService;

    public boolean isUsuarioGold(String username) {
        Optional<Usuario> usuarioOpt = repo.findByEmail(username);
        return usuarioOpt.map(usuario -> usuario.getPlano() == EPlano.GOLD).orElse(false);
    }

    public boolean podeAtualizarPerfil(String idDoPerfil, UserDetails userDetails) {
        Usuario usuarioAutenticado = repo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário autenticado não encontrado."));

        boolean isOwnerAndGold = usuarioAutenticado.getPerfil() == EPerfil.ALUNO &&
                usuarioAutenticado.getPlano() == EPlano.GOLD &&
                usuarioAutenticado.getId().equals(idDoPerfil);
        return isOwnerAndGold;
    }

    public Usuario criarAluno(AlunoCreateDTO dto) throws IOException {
        validarUnicidade(dto.getEmail(), dto.getCpf(), dto.getTelefone(), null);
        validarCpf(dto.getCpf());

        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail().toLowerCase());
        usuario.setCpf(normalizarCpf(dto.getCpf()));
        usuario.setTelefone(normalizarTelefone(dto.getTelefone()));
        usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        usuario.setPerfil(EPerfil.ALUNO);
        usuario.setPlano(dto.getPlano());

        if (dto.getPlano() == EPlano.GOLD) {
            validarECarregarDadosPlanoGold(dto, usuario);
            usuario.setStatusPlano(EStatus.ATIVO);
            usuario.setDataInicioPlano(LocalDateTime.now());
            usuario.setDataVencimentoPlano(LocalDateTime.now().plusMonths(1));
        }

        if (dto.getFotoPerfil() != null && !dto.getFotoPerfil().isEmpty()) {
            String fotoUrl = cloudinaryService.uploadFile(dto.getFotoPerfil());
            usuario.setFotoPerfil(fotoUrl);
        }

        return repo.save(usuario);
    }

    public Usuario criarProfessor(ProfessorCreateDTO dto) throws IOException {
        validarUnicidade(dto.getEmail(), dto.getCpf(), dto.getTelefone(), null);
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

    public Usuario criarAdmin(UsuarioCreateDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail().toLowerCase());
        usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        usuario.setPerfil(EPerfil.ADMIN);

        return repo.save(usuario);
    }

    public Usuario atualizarUsuario(String id, UsuarioUpdateDTO dto, EPerfil perfilEsperado) throws IOException {
        Usuario usuarioExistente = buscarPorId(id);

        if (usuarioExistente.getPerfil() != perfilEsperado) {
            throw new RuntimeException("Perfil do usuário não corresponde ao esperado");
        }

        validarUnicidade(dto.getEmail(), dto.getCpf(), dto.getTelefone(), id);

        if (dto.getNome() != null && !dto.getNome().trim().isEmpty()) {
            usuarioExistente.setNome(dto.getNome());
        }

        if (dto.getEmail() != null && !dto.getEmail().trim().isEmpty()) {
            usuarioExistente.setEmail(dto.getEmail().toLowerCase());
        }

        if (dto.getCpf() != null && !dto.getCpf().trim().isEmpty()) {
            validarCpf(dto.getCpf());
            usuarioExistente.setCpf(normalizarCpf(dto.getCpf()));
        }

        if (dto.getTelefone() != null && !dto.getTelefone().trim().isEmpty()) {
            usuarioExistente.setTelefone(normalizarTelefone(dto.getTelefone()));
        }

        if (dto.getSenha() != null && !dto.getSenha().trim().isEmpty()) {
            usuarioExistente.setSenha(passwordEncoder.encode(dto.getSenha()));
        }

        if (dto.getPlano() != null && usuarioExistente.getPerfil() == EPerfil.ALUNO) {
            boolean eraGold = usuarioExistente.getPlano() == EPlano.GOLD;
            boolean virouGold = dto.getPlano() == EPlano.GOLD;

            usuarioExistente.setPlano(dto.getPlano());

            if (virouGold && !eraGold) {
                usuarioExistente.setStatusPlano(EStatus.ATIVO);
                usuarioExistente.setDataInicioPlano(LocalDateTime.now());
                usuarioExistente.setDataVencimentoPlano(LocalDateTime.now().plusMonths(1));
            }
        }

        if (usuarioExistente.getPlano() == EPlano.GOLD) {
            if (dto.getIdade() != null) usuarioExistente.setIdade(dto.getIdade());
            if (dto.getPeso() != null) usuarioExistente.setPeso(dto.getPeso());
            if (dto.getAltura() != null) usuarioExistente.setAltura(dto.getAltura());
            if (dto.getObjetivo() != null) usuarioExistente.setObjetivo(dto.getObjetivo());
            if (dto.getNivelAtividade() != null) usuarioExistente.setNivelAtividade(dto.getNivelAtividade());
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

    public List<UsuarioSaidaDTO> buscarPorPerfil(EPerfil perfil, PageRequest pageable) {
        Page<Usuario> usuariosPage = repo.findByPerfil(perfil, pageable);
        return usuariosPage.getContent().stream()
                .map(this::toUsuarioSaidaDTO)
                .collect(Collectors.toList());
    }

    public List<UsuarioSaidaDTO> buscarPorPerfilENome(EPerfil perfil, String nome, PageRequest pageable) {
        Page<Usuario> usuariosPage = repo.findByPerfilAndNomeContainingIgnoreCase(perfil, nome, pageable);
        return usuariosPage.getContent().stream()
                .map(this::toUsuarioSaidaDTO)
                .collect(Collectors.toList());
    }

    public Usuario buscarPorId(String id) {
        return repo.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado com ID: " + id));
    }

    public UsuarioSaidaDTO buscarUsuarioDTOPorIdEPerfil(String id, EPerfil perfil) {
        Usuario usuario = buscarPorId(id);
        if (usuario.getPerfil() != perfil) {
            throw new RecursoNaoEncontradoException(perfil.toString().toLowerCase() + " não encontrado com o ID: " + id);
        }
        return toUsuarioSaidaDTO(usuario);
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

    public PlanoGoldDetalhesDTO buscarDetalhesPlanoGold(UserDetails userDetails) {
        Usuario usuario = repo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário logado não encontrado no sistema!"));

        if (usuario.getPlano() != EPlano.GOLD) {
            throw new AccessDeniedException("Acesso negado. Este recurso é exclusivo para alunos do plano Gold.");
        }

        return buscarDetalhesPlanoGold(usuario);
    }

    public PlanoGoldDetalhesDTO renovarPlanoGoldPorAdmin(String alunoId) {
        Usuario usuario = repo.findById(alunoId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Aluno não encontrado com o ID: " + alunoId));

        if (usuario.getPerfil() != EPerfil.ALUNO || usuario.getPlano() != EPlano.GOLD) {
            throw new IllegalStateException("Esta ação só é permitida para alunos do plano Gold.");
        }

        LocalDateTime novoInicio = usuario.getDataVencimentoPlano() != null ? usuario.getDataVencimentoPlano() : LocalDateTime.now();
        LocalDateTime novoVencimento = novoInicio.plusMonths(1);

        usuario.setDataInicioPlano(novoInicio);
        usuario.setDataVencimentoPlano(novoVencimento);
        usuario.setStatusPlano(EStatus.ATIVO);

        repo.save(usuario);

        return buscarDetalhesPlanoGold(usuario);
    }

    private PlanoGoldDetalhesDTO buscarDetalhesPlanoGold(Usuario usuario) {
        LocalDateTime dataCadastro = usuario.getDataCadastro();
        String duracao = calcularDuracao(dataCadastro);

        return PlanoGoldDetalhesDTO.builder()
                .statusPlano(usuario.getStatusPlano())
                .tipoPlano(usuario.getPlano())
                .dataRenovacao(usuario.getDataInicioPlano())
                .dataVencimento(usuario.getDataVencimentoPlano())
                .dataInicioAcademia(dataCadastro)
                .duracaoAcademia(duracao)
                .build();
    }

    public void excluirPorId(String id) {
        if (!repo.existsById(id)) {
            throw new RecursoNaoEncontradoException("Usuário não encontrado com ID: " + id);
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
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário com e-mail " + email + " não encontrado."));

        if (usuario.getFotoPerfil() != null) {
            try {
                cloudinaryService.deleteFile(extrairPublicId(usuario.getFotoPerfil()));
            } catch (Exception e) {
                System.err.println("Erro ao deletar imagem do usuário: " + e.getMessage());
            }
        }

        repo.delete(usuario);
    }

    public Usuario atualizarSenha(String email, String novaSenha) {
        Usuario usuario = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado para redefinição de senha."));
        usuario.setSenha(passwordEncoder.encode(novaSenha));
        return repo.save(usuario);
    }

    private String calcularDuracao(LocalDateTime dataInicio) {
        if (dataInicio == null) {
            return "N/A";
        }
        Period periodo = Period.between(dataInicio.toLocalDate(), LocalDateTime.now().toLocalDate());
        int anos = periodo.getYears();
        int meses = periodo.getMonths();
        int dias = periodo.getDays();

        StringBuilder sb = new StringBuilder();
        if (anos > 0) sb.append(anos).append(anos > 1 ? " anos, " : " ano, ");
        if (meses > 0) sb.append(meses).append(meses > 1 ? " meses e " : " mês e ");
        sb.append(dias).append(dias > 1 ? " dias" : " dia");

        return sb.toString();
    }

    private void validarECarregarDadosPlanoGold(AlunoCreateDTO dto, Usuario usuario) {
        if (dto.getIdade() == null || dto.getPeso() == null || dto.getAltura() == null ||
                dto.getObjetivo() == null || dto.getObjetivo().isBlank() || dto.getNivelAtividade() == null) {
            throw new IllegalArgumentException("Para o plano Gold, os campos: idade, peso, altura, objetivo e nível de atividade são obrigatórios.");
        }
        usuario.setIdade(dto.getIdade());
        usuario.setPeso(dto.getPeso());
        usuario.setAltura(dto.getAltura());
        usuario.setObjetivo(dto.getObjetivo());
        usuario.setNivelAtividade(dto.getNivelAtividade());
    }

    private void validarCpf(String cpf) {
        String cpfNormalizado = normalizarCpf(cpf);
        if (cpfNormalizado.length() != 11 || cpfNormalizado.matches("(\\d)\\1{10}")) {
            throw new IllegalArgumentException("CPF inválido. Verifique e tente novamente.");
        }
        try {
            int[] pesos1 = {10, 9, 8, 7, 6, 5, 4, 3, 2};
            int soma1 = 0;
            for (int i = 0; i < 9; i++) soma1 += Integer.parseInt(cpfNormalizado.substring(i, i + 1)) * pesos1[i];
            int resto1 = 11 - (soma1 % 11);
            char dv1 = (resto1 >= 10) ? '0' : Character.forDigit(resto1, 10);
            if (dv1 != cpfNormalizado.charAt(9)) throw new IllegalArgumentException("CPF inválido. Verifique e tente novamente.");

            int[] pesos2 = {11, 10, 9, 8, 7, 6, 5, 4, 3, 2};
            int soma2 = 0;
            for (int i = 0; i < 10; i++) soma2 += Integer.parseInt(cpfNormalizado.substring(i, i + 1)) * pesos2[i];
            int resto2 = 11 - (soma2 % 11);
            char dv2 = (resto2 >= 10) ? '0' : Character.forDigit(resto2, 10);
            if (dv2 != cpfNormalizado.charAt(10)) throw new IllegalArgumentException("CPF inválido. Verifique e tente novamente.");
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("CPF inválido. Verifique e tente novamente.");
        }
    }

    private void validarUnicidade(String email, String cpf, String telefone, String idExcluir) {
        String erro = "Já existe um usuário cadastrado com este email, CPF ou telefone. Verifique os dados e tente novamente.";
        if (email != null && !email.isBlank()) {
            Optional<Usuario> usuarioEmail = repo.findByEmail(email.toLowerCase());
            if (usuarioEmail.isPresent() && (idExcluir == null || !usuarioEmail.get().getId().equals(idExcluir))) {
                throw new RuntimeException(erro);
            }
        }
        if (cpf != null && !cpf.isBlank()) {
            Optional<Usuario> usuarioCpf = repo.findByCpf(normalizarCpf(cpf));
            if (usuarioCpf.isPresent() && (idExcluir == null || !usuarioCpf.get().getId().equals(idExcluir))) {
                throw new RuntimeException(erro);
            }
        }
        if (telefone != null && !telefone.isBlank()) {
            Optional<Usuario> usuarioTelefone = repo.findByTelefone(normalizarTelefone(telefone));
            if (usuarioTelefone.isPresent() && (idExcluir == null || !usuarioTelefone.get().getId().equals(idExcluir))) {
                throw new RuntimeException(erro);
            }
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
                usuario.getPlano(),
                usuario.getIdade(),
                usuario.getPeso(),
                usuario.getAltura(),
                usuario.getObjetivo(),
                usuario.getNivelAtividade()
        );
    }
}