package br.com.saudeemacao.api.service;

import br.com.saudeemacao.api.dto.TreinoDTO;
import br.com.saudeemacao.api.exception.RecursoNaoEncontradoException;
import br.com.saudeemacao.api.model.EPerfil;
import br.com.saudeemacao.api.model.Treino;
import br.com.saudeemacao.api.model.Usuario;
import br.com.saudeemacao.api.repository.TreinoRepository;
import br.com.saudeemacao.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TreinoService {

    private final TreinoRepository treinoRepository;
    private final UsuarioRepository usuarioRepository;

    private Usuario getUsuarioAutenticado(UserDetails userDetails) {
        return usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário autenticado não encontrado."));
    }

    public Treino criarTreino(TreinoDTO dto, UserDetails userDetails) {
        Usuario responsavel = getUsuarioAutenticado(userDetails);

        Treino treino = Treino.builder()
                .nome(dto.getNome())
                .responsavel(responsavel)
                .tipoDeTreino(dto.getTipoDeTreino())
                .nivel(dto.getNivel())
                .sexo(dto.getSexo())
                .frequenciaSemanal(dto.getFrequenciaSemanal())
                .idadeMinima(dto.getIdadeMinima())
                .idadeMaxima(dto.getIdadeMaxima())
                .exercicios(dto.getExercicios())
                .build();

        return treinoRepository.save(treino);
    }

    public Treino buscarPorId(String id) {
        return treinoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Treino não encontrado com o ID: " + id));
    }

    public List<Treino> buscarTodos() {
        return treinoRepository.findAll();
    }

    public Treino atualizarTreino(String id, TreinoDTO dto, UserDetails userDetails) {
        Treino treinoExistente = buscarPorId(id);
        Usuario usuarioAutenticado = getUsuarioAutenticado(userDetails);

        // Validação: Apenas o responsável ou um admin pode atualizar o treino.
        if (!treinoExistente.getResponsavel().getId().equals(usuarioAutenticado.getId()) &&
                usuarioAutenticado.getPerfil() != EPerfil.ADMIN) {
            throw new SecurityException("Você não tem permissão para atualizar este treino.");
        }

        treinoExistente.setNome(dto.getNome());
        treinoExistente.setTipoDeTreino(dto.getTipoDeTreino());
        treinoExistente.setNivel(dto.getNivel());
        treinoExistente.setSexo(dto.getSexo());
        treinoExistente.setFrequenciaSemanal(dto.getFrequenciaSemanal());
        treinoExistente.setIdadeMinima(dto.getIdadeMinima());
        treinoExistente.setIdadeMaxima(dto.getIdadeMaxima());
        treinoExistente.setExercicios(dto.getExercicios());

        return treinoRepository.save(treinoExistente);
    }

    public void deletarTreino(String id, UserDetails userDetails) {
        Treino treinoExistente = buscarPorId(id);
        Usuario usuarioAutenticado = getUsuarioAutenticado(userDetails);

        // Validação: Apenas o responsável ou um admin pode deletar o treino.
        if (!treinoExistente.getResponsavel().getId().equals(usuarioAutenticado.getId()) &&
                usuarioAutenticado.getPerfil() != EPerfil.ADMIN) {
            throw new SecurityException("Você não tem permissão para deletar este treino.");
        }

        treinoRepository.deleteById(id);
    }
}