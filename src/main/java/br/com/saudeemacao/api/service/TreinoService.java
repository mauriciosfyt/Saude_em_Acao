package br.com.saudeemacao.api.service;

import br.com.saudeemacao.api.dto.TreinoDTO;
import br.com.saudeemacao.api.dto.TreinoMetricasDTO;
import br.com.saudeemacao.api.exception.RecursoNaoEncontradoException;
import br.com.saudeemacao.api.model.*;
import br.com.saudeemacao.api.model.EnumUsuario.EPerfil;
import br.com.saudeemacao.api.model.EnumUsuario.EPlano;
import br.com.saudeemacao.api.repository.HistoricoTreinoRepository;
import br.com.saudeemacao.api.repository.TreinoRepository;
import br.com.saudeemacao.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TreinoService {

    private final TreinoRepository treinoRepository;
    private final UsuarioRepository usuarioRepository;
    private final HistoricoTreinoRepository historicoTreinoRepository;

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

    public List<Treino> buscarPorNome(String nome) {
        return treinoRepository.findByNomeContainingIgnoreCase(nome);
    }

    public List<Treino> buscarPorTipo(String tipo) {
        return treinoRepository.findByTipoDeTreinoContainingIgnoreCase(tipo);
    }

    public List<Treino> buscarPorResponsavel(String responsavelId) {
        return treinoRepository.findByResponsavelId(responsavelId);
    }

    public Treino atualizarTreino(String id, TreinoDTO dto, UserDetails userDetails) {
        Treino treinoExistente = buscarPorId(id);
        Usuario usuarioAutenticado = getUsuarioAutenticado(userDetails);

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

        if (!treinoExistente.getResponsavel().getId().equals(usuarioAutenticado.getId()) &&
                usuarioAutenticado.getPerfil() != EPerfil.ADMIN) {
            throw new SecurityException("Você não tem permissão para deletar este treino.");
        }

        treinoRepository.deleteById(id);
    }

    public HistoricoTreino registrarTreinoRealizado(String treinoId, UserDetails userDetails) {
        Usuario aluno = getUsuarioAutenticado(userDetails);
        Treino treino = buscarPorId(treinoId);

        HistoricoTreino historico = HistoricoTreino.builder()
                .aluno(aluno)
                .treino(treino)
                .dataRealizacao(LocalDateTime.now())
                .build();

        historicoTreinoRepository.save(historico);

        // ATUALIZA A DATA DO ÚLTIMO TREINO NO USUÁRIO
        aluno.setDataUltimoTreino(historico.getDataRealizacao());
        usuarioRepository.save(aluno);

        return historico;
    }

    public List<HistoricoTreino> buscarDesempenhoSemanal(UserDetails userDetails) {
        Usuario aluno = getUsuarioAutenticado(userDetails);

        LocalDateTime hoje = LocalDateTime.now();
        LocalDateTime inicioDaSemana = hoje.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).toLocalDate().atStartOfDay();
        LocalDateTime fimDaSemana = hoje.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY)).toLocalDate().atTime(23, 59, 59);

        return historicoTreinoRepository.findByAlunoIdAndDataRealizacaoBetween(aluno.getId(), inicioDaSemana, fimDaSemana);
    }

    /**
     * Orquestra a busca e o cálculo de todas as métricas de treino para o aluno logado.
     */
    public TreinoMetricasDTO getMetricasDeTreino(UserDetails userDetails) {
        Usuario aluno = getUsuarioAutenticado(userDetails);

        // Validação de segurança crucial
        if (aluno.getPlano() != EPlano.GOLD) {
            throw new AccessDeniedException("Acesso negado. Este recurso é exclusivo para alunos do plano Gold.");
        }

        // 1. Quantidade de treinos no mês atual
        LocalDateTime inicioDoMes = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime fimDoMes = LocalDate.now().with(TemporalAdjusters.lastDayOfMonth()).atTime(23, 59, 59);
        long treinosNoMes = historicoTreinoRepository.countByAlunoIdAndDataRealizacaoBetween(aluno.getId(), inicioDoMes, fimDoMes);

        // 2. Data do último treino (já está no objeto aluno)
        LocalDateTime ultimoTreino = aluno.getDataUltimoTreino();

        // 3. Total de treinos completos
        long totalTreinos = historicoTreinoRepository.countByAlunoId(aluno.getId());

        // 4. Dias ativos consecutivos
        int diasConsecutivos = calcularDiasAtivosConsecutivos(aluno.getId());

        return TreinoMetricasDTO.builder()
                .treinosRealizadosMesAtual(treinosNoMes)
                .dataUltimoTreino(ultimoTreino)
                .totalTreinosCompletos(totalTreinos)
                .diasAtivosConsecutivos(diasConsecutivos)
                .build();
    }

    /**
     * Calcula os dias consecutivos de treino.
     */
    private int calcularDiasAtivosConsecutivos(String alunoId) {
        List<HistoricoTreino> historico = historicoTreinoRepository.findByAlunoIdOrderByDataRealizacaoDesc(alunoId);
        if (historico.isEmpty()) {
            return 0;
        }

        // Mapeia para LocalDate e remove duplicatas (caso o aluno treine mais de uma vez no mesmo dia)
        List<LocalDate> datasDeTreinoUnicas = historico.stream()
                .map(h -> h.getDataRealizacao().toLocalDate())
                .distinct()
                .collect(Collectors.toList());

        LocalDate hoje = LocalDate.now();
        LocalDate ultimoDiaDeTreino = datasDeTreinoUnicas.get(0);

        // Se o último treino não foi hoje nem ontem, a sequência atual é 0.
        if (!ultimoDiaDeTreino.equals(hoje) && !ultimoDiaDeTreino.equals(hoje.minusDays(1))) {
            return 0;
        }

        // A sequência atual é de, no mínimo, 1 dia.
        int diasConsecutivos = 1;
        LocalDate diaReferencia = ultimoDiaDeTreino;

        // Começa do segundo treino mais recente e compara com o dia de referência
        for (int i = 1; i < datasDeTreinoUnicas.size(); i++) {
            LocalDate diaAtual = datasDeTreinoUnicas.get(i);

            // Verifica se o dia atual é exatamente um dia antes do dia de referência
            if (diaReferencia.minusDays(1).equals(diaAtual)) {
                diasConsecutivos++;
                diaReferencia = diaAtual; // Atualiza o dia de referência para o próximo loop
            } else {
                // A sequência foi quebrada, então paramos de contar.
                break;
            }
        }

        return diasConsecutivos;
    }
}