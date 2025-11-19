package br.com.saudeemacao.api.service;

import br.com.saudeemacao.api.dto.ExercicioDTO;
import br.com.saudeemacao.api.dto.TreinoDTO;
import br.com.saudeemacao.api.dto.TreinoMetricasDTO;
import br.com.saudeemacao.api.exception.RecursoNaoEncontradoException;
import br.com.saudeemacao.api.model.EnumTreino.EDiaDaSemana; // >> IMPORTAR O NOVO ENUM
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
import java.util.HashMap; // >> IMPORTAR HASHMAP
import java.util.List;
import java.util.Map; // >> IMPORTAR MAP
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

        // >> ALTERAÇÃO 1: Mapear o Map de DTOs para o Map do Modelo.
        Map<EDiaDaSemana, List<Exercicio>> exerciciosPorDia = mapExerciciosDtoParaModelo(dto.getExerciciosPorDia());

        Treino treino = Treino.builder()
                .nome(dto.getNome())
                .responsavel(responsavel)
                .tipoDeTreino(dto.getTipoDeTreino())
                .nivel(dto.getNivel())
                .sexo(dto.getSexo())
                .frequenciaSemanal(dto.getFrequenciaSemanal())
                .idadeMinima(dto.getIdadeMinima())
                .idadeMaxima(dto.getIdadeMaxima())
                .exerciciosPorDia(exerciciosPorDia) // >> USAR O NOVO CAMPO
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

        // >> ALTERAÇÃO 2: Reutilizar a mesma lógica de mapeamento do Map.
        Map<EDiaDaSemana, List<Exercicio>> exerciciosAtualizados = mapExerciciosDtoParaModelo(dto.getExerciciosPorDia());

        treinoExistente.setNome(dto.getNome());
        treinoExistente.setTipoDeTreino(dto.getTipoDeTreino());
        treinoExistente.setNivel(dto.getNivel());
        treinoExistente.setSexo(dto.getSexo());
        treinoExistente.setFrequenciaSemanal(dto.getFrequenciaSemanal());
        treinoExistente.setIdadeMinima(dto.getIdadeMinima());
        treinoExistente.setIdadeMaxima(dto.getIdadeMaxima());
        treinoExistente.setExerciciosPorDia(exerciciosAtualizados); // >> USAR O NOVO CAMPO

        return treinoRepository.save(treinoExistente);
    }

    // >> ALTERAÇÃO 3: Novo método auxiliar para converter o mapa de DTOs para o mapa do modelo.
    private Map<EDiaDaSemana, List<Exercicio>> mapExerciciosDtoParaModelo(Map<EDiaDaSemana, List<ExercicioDTO>> dtoMap) {
        if (dtoMap == null || dtoMap.isEmpty()) {
            return new HashMap<>();
        }

        Map<EDiaDaSemana, List<Exercicio>> modelMap = new HashMap<>();
        // Itera sobre cada entrada do mapa (Ex: SEGUNDA -> Lista de Exercícios DTO)
        for (Map.Entry<EDiaDaSemana, List<ExercicioDTO>> entry : dtoMap.entrySet()) {
            EDiaDaSemana dia = entry.getKey();
            List<ExercicioDTO> exerciciosDto = entry.getValue();

            // Converte a lista de DTOs para uma lista de Entidades
            List<Exercicio> exerciciosModel = exerciciosDto.stream()
                    .map(this::mapExercicioDtoToModel)
                    .collect(Collectors.toList());

            modelMap.put(dia, exerciciosModel);
        }
        return modelMap;
    }

    // (O restante da classe permanece o mesmo)
    // ...
    // ...
    // ...

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
}