package br.com.saudeemacao.api.service;

import br.com.saudeemacao.api.dto.*;
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
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TreinoService {

    private final TreinoRepository treinoRepository;
    private final UsuarioRepository usuarioRepository;
    private final HistoricoTreinoRepository historicoTreinoRepository;
    private final CloudinaryService cloudinaryService;
    private final EmailService emailService;

    private Usuario getUsuarioAutenticado(UserDetails userDetails) {
        return usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário autenticado não encontrado."));
    }

    public Treino criarTreino(TreinoDTO dto, UserDetails userDetails) {
        Usuario responsavel = getUsuarioAutenticado(userDetails);

        Map<EDiaDaSemana, List<Exercicio>> exerciciosPorDia = mapExerciciosDtoParaModelo(dto.getExerciciosPorDia(), null);

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

        Map<EDiaDaSemana, List<Exercicio>> exerciciosAtualizados = mapExerciciosDtoParaModelo(dto.getExerciciosPorDia(), treinoExistente.getExerciciosPorDia());

        treinoExistente.setNome(dto.getNome());
        treinoExistente.setTipoDeTreino(dto.getTipoDeTreino());
        treinoExistente.setNivel(dto.getNivel());
        treinoExistente.setSexo(dto.getSexo());
        treinoExistente.setIdadeMinima(dto.getIdadeMinima());
        treinoExistente.setIdadeMaxima(dto.getIdadeMaxima());
        treinoExistente.setExerciciosPorDia(exerciciosAtualizados);

        return treinoRepository.save(treinoExistente);
    }

    private Map<EDiaDaSemana, List<Exercicio>> mapExerciciosDtoParaModelo(
            Map<EDiaDaSemana, List<ExercicioDTO>> dtoMap,
            Map<EDiaDaSemana, List<Exercicio>> mapaAntigo) {

        if (dtoMap == null || dtoMap.isEmpty()) {
            return new HashMap<>();
        }

        Map<EDiaDaSemana, List<Exercicio>> modelMap = new HashMap<>();
        for (Map.Entry<EDiaDaSemana, List<ExercicioDTO>> entry : dtoMap.entrySet()) {
            EDiaDaSemana dia = entry.getKey();
            List<ExercicioDTO> exerciciosDto = entry.getValue();

            List<Exercicio> exerciciosAntigosDoDia = (mapaAntigo != null)
                    ? mapaAntigo.getOrDefault(dia, Collections.emptyList())
                    : Collections.emptyList();

            List<Exercicio> exerciciosModel = exerciciosDto.stream()
                    .map(dto -> {
                        String urlImagemAntiga = exerciciosAntigosDoDia.stream()
                                .filter(e -> e.getNome().equalsIgnoreCase(dto.getNome()))
                                .findFirst()
                                .map(Exercicio::getImg)
                                .orElse(null);

                        return mapExercicioDtoToModel(dto, urlImagemAntiga);
                    })
                    .collect(Collectors.toList());

            if (!exerciciosModel.isEmpty()) {
                modelMap.put(dia, exerciciosModel);
            }
        }
        return modelMap;
    }

    private Exercicio mapExercicioDtoToModel(ExercicioDTO dto, String urlImagemAntiga) {
        String imgUrl = urlImagemAntiga;

        if (dto.getImg() != null && !dto.getImg().isEmpty()) {
            try {
                if (urlImagemAntiga != null) {
                    deletarImagemSeguro(urlImagemAntiga);
                }
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

    private void deletarImagemSeguro(String url) {
        try {
            String publicId = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
            cloudinaryService.deleteFile(publicId);
        } catch (Exception e) {
            System.err.println("Aviso: Falha ao deletar imagem antiga do Cloudinary: " + e.getMessage());
        }
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

        if (treinoExistente.getExerciciosPorDia() != null) {
            treinoExistente.getExerciciosPorDia().values().stream()
                    .flatMap(List::stream)
                    .map(Exercicio::getImg)
                    .filter(Objects::nonNull)
                    .forEach(this::deletarImagemSeguro);
        }

        treinoRepository.deleteById(id);
    }


    public HistoricoTreino registrarTreinoRealizado(UserDetails userDetails) {
        Usuario aluno = getUsuarioAutenticado(userDetails);

        LocalDate hoje = LocalDate.now();
        EDiaDaSemana diaAtualEnum = converterDayOfWeekParaEnum(hoje.getDayOfWeek());

        if (diaAtualEnum == null) {
            throw new IllegalArgumentException("O sistema só permite registros de treinos de Segunda a Sexta-feira. Bom descanso!");
        }

        Treino treino = identificarTreinoDoDia(aluno, diaAtualEnum);

        if (treino.getExerciciosPorDia().get(diaAtualEnum).isEmpty()) {
            throw new IllegalArgumentException("Não há exercícios cadastrados para " + diaAtualEnum + " neste treino.");
        }

        LocalDateTime inicioDia = hoje.atStartOfDay();
        LocalDateTime fimDia = hoje.atTime(LocalTime.MAX);

        boolean jaRealizouHoje = historicoTreinoRepository.existsByAlunoIdAndTreinoIdAndDataRealizacaoBetween(
                aluno.getId(), treino.getId(), inicioDia, fimDia);

        if (jaRealizouHoje) {
            throw new IllegalStateException("Você já registrou a conclusão do treino '" + treino.getNome() + "' hoje. Volte amanhã!");
        }

        HistoricoTreino historico = HistoricoTreino.builder()
                .aluno(aluno)
                .treino(treino)
                .dataRealizacao(LocalDateTime.now())
                .diaDaSemanaConcluido(diaAtualEnum)
                .build();

        historicoTreinoRepository.save(historico);

        aluno.setDataUltimoTreino(historico.getDataRealizacao());
        usuarioRepository.save(aluno);

        verificarENotificarConclusaoSemanal(aluno, treino, hoje);

        return historico;
    }

    private Treino identificarTreinoDoDia(Usuario aluno, EDiaDaSemana diaAtual) {
        List<Treino> treinosAtribuidos = aluno.getTreinosAtribuidos();

        if (treinosAtribuidos == null || treinosAtribuidos.isEmpty()) {
            throw new RecursoNaoEncontradoException("Você não possui nenhum treino atribuído. Entre em contato com seu professor.");
        }

        if (diaAtual == null) {
            throw new IllegalArgumentException("Hoje não é um dia útil para treinos.");
        }

        List<Treino> treinosDeHoje = treinosAtribuidos.stream()
                .filter(t -> t.getExerciciosPorDia() != null
                        && t.getExerciciosPorDia().containsKey(diaAtual)
                        && !t.getExerciciosPorDia().get(diaAtual).isEmpty())
                .collect(Collectors.toList());

        if (treinosDeHoje.isEmpty()) {
            throw new RecursoNaoEncontradoException("Nenhum dos seus treinos possui exercícios agendados para " + diaAtual + ". Aproveite o descanso!");
        }

        return treinosDeHoje.get(0);
    }

    private void verificarENotificarConclusaoSemanal(Usuario aluno, Treino treino, LocalDate dataReferencia) {
        LocalDateTime inicioSemana = dataReferencia.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).atStartOfDay();
        LocalDateTime fimSemana = dataReferencia.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY)).atTime(LocalTime.MAX);

        List<HistoricoTreino> treinosDaSemana = historicoTreinoRepository.findByAlunoIdAndTreinoIdAndDataRealizacaoBetween(
                aluno.getId(), treino.getId(), inicioSemana, fimSemana
        );

        Set<EDiaDaSemana> diasConcluidos = treinosDaSemana.stream()
                .map(HistoricoTreino::getDiaDaSemanaConcluido)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Set<EDiaDaSemana> diasExigidos = treino.getExerciciosPorDia().keySet().stream()
                .filter(d -> !treino.getExerciciosPorDia().get(d).isEmpty())
                .collect(Collectors.toSet());

        if (diasConcluidos.containsAll(diasExigidos)) {
            emailService.enviarEmailConclusaoSemanal(aluno.getEmail(), aluno.getNome(), treino.getNome(), true);

            if (treino.getResponsavel() != null && treino.getResponsavel().getEmail() != null) {
                emailService.enviarEmailConclusaoSemanal(treino.getResponsavel().getEmail(), aluno.getNome(), treino.getNome(), false);
            }
        }
    }

    private EDiaDaSemana converterDayOfWeekParaEnum(DayOfWeek dayOfWeek) {
        switch (dayOfWeek) {
            case MONDAY: return EDiaDaSemana.SEGUNDA;
            case TUESDAY: return EDiaDaSemana.TERCA;
            case WEDNESDAY: return EDiaDaSemana.QUARTA;
            case THURSDAY: return EDiaDaSemana.QUINTA;
            case FRIDAY: return EDiaDaSemana.SEXTA;
            default: return null;
        }
    }

    public List<DesempenhoSemanalDTO> buscarDesempenhoSemanal(UserDetails userDetails) {
        Usuario aluno = getUsuarioAutenticado(userDetails);

        LocalDateTime hoje = LocalDateTime.now();
        LocalDateTime inicioDaSemana = hoje.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).toLocalDate().atStartOfDay();
        LocalDateTime fimDaSemana = hoje.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY)).toLocalDate().atTime(23, 59, 59);

        List<HistoricoTreino> historicos = historicoTreinoRepository.findByAlunoIdAndDataRealizacaoBetween(aluno.getId(), inicioDaSemana, fimDaSemana);

        Set<EDiaDaSemana> diasConcluidos = historicos.stream()
                .map(HistoricoTreino::getDiaDaSemanaConcluido)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        List<DesempenhoSemanalDTO> desempenho = new ArrayList<>();

        for (EDiaDaSemana dia : EDiaDaSemana.values()) {
            boolean realizado = diasConcluidos.contains(dia);
            desempenho.add(new DesempenhoSemanalDTO(dia, realizado));
        }

        desempenho.sort(Comparator.comparing(DesempenhoSemanalDTO::getDia));

        return desempenho;
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