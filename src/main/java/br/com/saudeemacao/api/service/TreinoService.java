package br.com.saudeemacao.api.service;

import br.com.saudeemacao.api.dto.ExercicioDTO;
import br.com.saudeemacao.api.dto.ResponsavelDTO;
import br.com.saudeemacao.api.dto.TreinoDTO;
import br.com.saudeemacao.api.dto.TreinoMetricasDTO;
import br.com.saudeemacao.api.dto.TreinoResponseDTO; // Importado
import br.com.saudeemacao.api.exception.RecursoNaoEncontradoException;
import br.com.saudeemacao.api.model.EnumTreino.EDiaDaSemana;
import br.com.saudeemacao.api.model.EnumUsuario.EPerfil;
import br.com.saudeemacao.api.model.EnumUsuario.EPlano;
import br.com.saudeemacao.api.model.Exercicio;
import br.com.saudeemacao.api.model.HistoricoTreino;
import br.com.saudeemacao.api.model.Treino;
import br.com.saudeemacao.api.model.Usuario;
import br.com.saudeemacao.api.repository.HistoricoTreinoRepository;
import br.com.saudeemacao.api.repository.TreinoRepository;
import br.com.saudeemacao.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TreinoService {

    private final TreinoRepository treinoRepository;
    private final UsuarioRepository usuarioRepository;
    private final HistoricoTreinoRepository historicoTreinoRepository;
    private final CloudinaryService cloudinaryService;

    private Usuario getUsuarioAutenticado(UserDetails userDetails) {
        return usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário autenticado não encontrado."));
    }

    public Treino criarTreino(TreinoDTO dto, UserDetails userDetails) {
        Usuario responsavel = getUsuarioAutenticado(userDetails);

        Map<EDiaDaSemana, List<Exercicio>> exerciciosPorDia = mapExerciciosDtoParaModelo(dto.getExerciciosPorDia());

        Treino treino = Treino.builder()
                .nome(dto.getNome())
                .responsavel(responsavel)
                .tipoDeTreino(dto.getTipoDeTreino())
                .nivel(dto.getNivel())
                .sexo(dto.getSexo())
                .idadeMinima(dto.getIdadeMinima())
                .idadeMaxima(dto.getIdadeMaxima())
                .exerciciosPorDia(exerciciosPorDia)
                .build();

        return treinoRepository.save(treino);
    }

    public Treino atualizarTreino(String id, TreinoDTO dto, UserDetails userDetails) {
        Treino treinoExistente = buscarPorId(id);
        Usuario usuarioAutenticado = getUsuarioAutenticado(userDetails);

        if (!treinoExistente.getResponsavel().getId().equals(usuarioAutenticado.getId()) &&
                usuarioAutenticado.getPerfil() != EPerfil.ADMIN) {
            throw new SecurityException("Você não tem permissão para atualizar este treino.");
        }

        Map<EDiaDaSemana, List<Exercicio>> exerciciosAtualizados = mapExerciciosDtoParaModelo(dto.getExerciciosPorDia());

        treinoExistente.setNome(dto.getNome());
        treinoExistente.setTipoDeTreino(dto.getTipoDeTreino());
        treinoExistente.setNivel(dto.getNivel());
        treinoExistente.setSexo(dto.getSexo());
        treinoExistente.setIdadeMinima(dto.getIdadeMinima());
        treinoExistente.setIdadeMaxima(dto.getIdadeMaxima());
        treinoExistente.setExerciciosPorDia(exerciciosAtualizados);

        return treinoRepository.save(treinoExistente);
    }


    private Map<EDiaDaSemana, List<Exercicio>> mapExerciciosDtoParaModelo(Map<EDiaDaSemana, List<ExercicioDTO>> dtoMap) {
        if (dtoMap == null || dtoMap.isEmpty()) {
            return new HashMap<>();
        }

        Map<EDiaDaSemana, List<Exercicio>> modelMap = new HashMap<>();
        for (Map.Entry<EDiaDaSemana, List<ExercicioDTO>> entry : dtoMap.entrySet()) {
            EDiaDaSemana dia = entry.getKey();
            List<ExercicioDTO> exerciciosDto = entry.getValue();

            List<Exercicio> exerciciosModel = exerciciosDto.stream()
                    .map(this::mapExercicioDtoToModel)
                    .collect(Collectors.toList());

            // Adiciona ao mapa apenas se a lista de exercícios não estiver vazia
            if (!exerciciosModel.isEmpty()) {
                modelMap.put(dia, exerciciosModel);
            }
        }
        return modelMap;
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

    public TreinoMetricasDTO getMetricasDeTreino(UserDetails userDetails) {
        Usuario aluno = getUsuarioAutenticado(userDetails);

        if (aluno.getPlano() != EPlano.GOLD) {
            throw new AccessDeniedException("Acesso negado. Este recurso é exclusivo para alunos do plano Gold.");
        }

        LocalDateTime inicioDoMes = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime fimDoMes = LocalDate.now().with(TemporalAdjusters.lastDayOfMonth()).atTime(23, 59, 59);
        long treinosNoMes = historicoTreinoRepository.countByAlunoIdAndDataRealizacaoBetween(aluno.getId(), inicioDoMes, fimDoMes);

        LocalDateTime ultimoTreino = aluno.getDataUltimoTreino();

        long totalTreinos = historicoTreinoRepository.countByAlunoId(aluno.getId());

        int diasConsecutivos = calcularDiasAtivosConsecutivos(aluno.getId());

        return TreinoMetricasDTO.builder()
                .treinosRealizadosMesAtual(treinosNoMes)
                .dataUltimoTreino(ultimoTreino)
                .totalTreinosCompletos(totalTreinos)
                .diasAtivosConsecutivos(diasConsecutivos)
                .build();
    }


    private int calcularDiasAtivosConsecutivos(String alunoId) {
        List<HistoricoTreino> historico = historicoTreinoRepository.findByAlunoIdOrderByDataRealizacaoDesc(alunoId);
        if (historico.isEmpty()) {
            return 0;
        }

        List<LocalDate> datasDeTreinoUnicas = historico.stream()
                .map(h -> h.getDataRealizacao().toLocalDate())
                .distinct()
                .collect(Collectors.toList());

        LocalDate hoje = LocalDate.now();
        LocalDate ultimoDiaDeTreino = datasDeTreinoUnicas.get(0);

        if (!ultimoDiaDeTreino.equals(hoje) && !ultimoDiaDeTreino.equals(hoje.minusDays(1))) {
            return 0;
        }

        int diasConsecutivos = 1;
        LocalDate diaReferencia = ultimoDiaDeTreino;

        for (int i = 1; i < datasDeTreinoUnicas.size(); i++) {
            LocalDate diaAtual = datasDeTreinoUnicas.get(i);

            if (diaReferencia.minusDays(1).equals(diaAtual)) {
                diasConsecutivos++;
                diaReferencia = diaAtual;
            } else {
                break;
            }
        }

        return diasConsecutivos;
    }

    private Exercicio mapExercicioDtoToModel(ExercicioDTO dto) {
        String imgUrl = null;
        if (dto.getImg() != null && !dto.getImg().isEmpty()) {
            try {
                imgUrl = cloudinaryService.uploadFile(dto.getImg());
            } catch (IOException e) {
                throw new RuntimeException("Falha ao fazer upload da imagem para o exercício: " + dto.getNome(), e);
            }
        }

        Exercicio exercicio = new Exercicio();
        exercicio.setNome(dto.getNome());
        exercicio.setSeries(dto.getSeries());
        exercicio.setRepeticoes(dto.getRepeticoes());
        exercicio.setCarga(dto.getCarga());
        exercicio.setIntervalo(dto.getIntervalo());
        exercicio.setObservacao(dto.getObservacao());
        exercicio.setImg(imgUrl);
        return exercicio;
    }

    // Método adicionado para mapear a entidade para o DTO de resposta
    public TreinoResponseDTO toResponseDTO(Treino treino) {
        if (treino == null) {
            return null;
        }

        ResponsavelDTO responsavelDTO = null;
        if (treino.getResponsavel() != null) {
            responsavelDTO = new ResponsavelDTO(
                    treino.getResponsavel().getId(),
                    treino.getResponsavel().getNome()
            );
        }

        return new TreinoResponseDTO(
                treino.getId(),
                treino.getNome(),
                treino.getTipoDeTreino(),
                treino.getNivel(),
                treino.getSexo(),
                treino.getIdadeMinima(),
                treino.getIdadeMaxima(),
                responsavelDTO,
                treino.getExerciciosPorDia()
        );
    }
}