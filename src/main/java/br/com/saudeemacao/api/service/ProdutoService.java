package br.com.saudeemacao.api.service;

import br.com.saudeemacao.api.dto.ProdutoDTO;
import br.com.saudeemacao.api.exception.RecursoNaoEncontradoException;
import br.com.saudeemacao.api.model.EnumProduto.ECategoria;
import br.com.saudeemacao.api.model.EnumProduto.ESabor;
import br.com.saudeemacao.api.model.EnumProduto.ETamanho;
import br.com.saudeemacao.api.model.Produto;
import br.com.saudeemacao.api.repository.ProdutoRepository;
import br.com.saudeemacao.api.repository.ReservaRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository repository;
    private final ReservaRepository reservaRepository;
    private final Cloudinary cloudinary;


    private LocalDateTime parseDate(String dateString, String fieldName) {
        if (dateString == null || dateString.isBlank()) {
            return null;
        }
        try {
            return LocalDateTime.parse(dateString);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Formato de data inválido para " + fieldName + ". Use o formato ISO 8601 (YYYY-MM-DDTHH:MM:SS)");
        }
    }

    private Produto aplicarPromocaoSeAtiva(Produto produto) {
        if (produto.getPrecoPromocional() != null &&
                produto.getDataInicioPromocao() != null &&
                produto.getDataFimPromocao() != null) {

            LocalDateTime now = LocalDateTime.now();

            if (now.isAfter(produto.getDataInicioPromocao()) && now.isBefore(produto.getDataFimPromocao())) {
                produto.setPreco(produto.getPrecoPromocional());
            }
        }
        return produto;
    }

    public List<Produto> getAll() {
        return repository.findAll().stream()
                .map(this::aplicarPromocaoSeAtiva)
                .collect(Collectors.toList());
    }

    public List<Produto> getProdutosPorCategoria(ECategoria categoria) {
        return repository.findByCategoria(categoria).stream()
                .map(this::aplicarPromocaoSeAtiva)
                .collect(Collectors.toList());
    }


    public List<Produto> getProdutosPorNome(String nome) {
        return repository.findByNomeContainingIgnoreCase(nome).stream()
                .map(this::aplicarPromocaoSeAtiva)
                .collect(Collectors.toList());
    }

    public List<Produto> getProdutosDestaques() {
        List<Map<String, Object>> popularidade = reservaRepository.findProdutosMaisReservados();
        List<String> idsDosProdutosPopulares = popularidade.stream()
                .map(p -> p.get("produtoId").toString())
                .collect(Collectors.toList());

        if (idsDosProdutosPopulares.isEmpty()) {
            return Collections.emptyList();
        }

        List<Produto> produtos = repository.findAllById(idsDosProdutosPopulares);

        return produtos.stream()
                .sorted(Comparator.comparingInt(p -> idsDosProdutosPopulares.indexOf(p.getId())))
                .map(this::aplicarPromocaoSeAtiva)
                .collect(Collectors.toList());
    }

    public Produto getById(String id) {
        Produto produto = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Produto não encontrado com ID: " + id));
        return aplicarPromocaoSeAtiva(produto);
    }

    public Produto create(ProdutoDTO dto) throws IOException {
        validarCamposObrigatoriosParaCriacao(dto);

        String imgUrl = uploadImagem(dto.getImg());

        Produto produto = new Produto();
        produto.setNome(dto.getNome());
        produto.setDescricao(dto.getDescricao());
        produto.setPreco(dto.getPreco());
        produto.setPrecoPromocional(dto.getPrecoPromocional());
        produto.setDataInicioPromocao(parseDate(dto.getDataInicioPromocao(), "dataInicioPromocao"));
        produto.setDataFimPromocao(parseDate(dto.getDataFimPromocao(), "dataFimPromocao"));
        produto.setImg(imgUrl);
        produto.setCategoria(dto.getCategoria());

        switch (dto.getCategoria()) {
            case CAMISETAS:
                produto.setEstoquePorTamanho(dto.getEstoquePorTamanho().entrySet().stream()
                        .collect(Collectors.toMap(
                                e -> ETamanho.valueOf(e.getKey().toUpperCase()),
                                Map.Entry::getValue
                        )));
                break;
            case CREATINA:
            case WHEY_PROTEIN:
                produto.setEstoquePorSabor(dto.getEstoquePorSabor().entrySet().stream()
                        .collect(Collectors.toMap(
                                e -> ESabor.valueOf(e.getKey().toUpperCase()),
                                Map.Entry::getValue
                        )));
                break;
            case VITAMINAS:
                produto.setEstoquePadrao(dto.getEstoquePadrao());
                break;
            default:
                throw new IllegalArgumentException("Categoria de produto desconhecida.");
        }

        return repository.save(produto);
    }

    public Produto update(String id, ProdutoDTO dto) throws IOException {
        // PASSO 1: Obter o produto existente
        Produto produto = getById(id);

        // PASSO 2: Aplicar a mesma lógica de validação do POST, mas de forma flexível
        validarCamposParaUpdate(dto);

        // PASSO 3: Atualizar os campos
        if (dto.getNome() != null && !dto.getNome().trim().isEmpty()) {
            produto.setNome(dto.getNome());
        }

        if (dto.getDescricao() != null && !dto.getDescricao().trim().isEmpty()) {
            produto.setDescricao(dto.getDescricao());
        }

        if (dto.getPreco() != null) {
            produto.setPreco(dto.getPreco());
        }

        if (dto.getPrecoPromocional() != null) {
            produto.setPrecoPromocional(dto.getPrecoPromocional());
        }
        if (dto.getDataInicioPromocao() != null) {
            produto.setDataInicioPromocao(parseDate(dto.getDataInicioPromocao(), "dataInicioPromocao"));
        }
        if (dto.getDataFimPromocao() != null) {
            produto.setDataFimPromocao(parseDate(dto.getDataFimPromocao(), "dataFimPromocao"));
        }

        if (dto.getCategoria() != null && !dto.getCategoria().equals(produto.getCategoria())) {
            throw new IllegalArgumentException("Alteração de categoria não permitida via atualização.");
        }

        switch (produto.getCategoria()) {
            case CAMISETAS:
                if (dto.getEstoquePorTamanho() != null) {
                    produto.setEstoquePorTamanho(dto.getEstoquePorTamanho().entrySet().stream()
                            .collect(Collectors.toMap(
                                    e -> ETamanho.valueOf(e.getKey().toUpperCase()),
                                    Map.Entry::getValue
                            )));
                }
                break;
            case CREATINA:
            case WHEY_PROTEIN:
                if (dto.getEstoquePorSabor() != null) {
                    produto.setEstoquePorSabor(dto.getEstoquePorSabor().entrySet().stream()
                            .collect(Collectors.toMap(
                                    e -> ESabor.valueOf(e.getKey().toUpperCase()),
                                    Map.Entry::getValue
                            )));
                }
                break;
            case VITAMINAS:
                if (dto.getEstoquePadrao() != null) {
                    produto.setEstoquePadrao(dto.getEstoquePadrao());
                }
                break;
        }

        if (dto.getImg() != null && !dto.getImg().isEmpty()) {
            deletarImagem(produto.getImg());
            String imgUrl = uploadImagem(dto.getImg());
            produto.setImg(imgUrl);
        }

        return repository.save(produto);
    }

    public void delete(String id) {
        Produto produto = getById(id);
        deletarImagem(produto.getImg());
        repository.deleteById(id);
    }

    public void decrementarEstoque(String produtoId, String identificadorVariacao, ECategoria categoria) {
        Produto produto = getById(produtoId);

        if (!produto.getCategoria().equals(categoria)) {
            throw new IllegalArgumentException("A categoria do produto não corresponde à categoria fornecida para o estoque.");
        }

        switch (categoria) {
            case CAMISETAS:
                ETamanho tamanho = ETamanho.valueOf(identificadorVariacao.toUpperCase());
                Map<ETamanho, Integer> estoqueTamanho = produto.getEstoquePorTamanho();
                int estoqueAtualTamanho = estoqueTamanho.getOrDefault(tamanho, 0);
                if (estoqueAtualTamanho <= 0) {
                    throw new IllegalStateException("Produto sem estoque para o tamanho " + identificadorVariacao);
                }
                estoqueTamanho.put(tamanho, estoqueAtualTamanho - 1);
                produto.setEstoquePorTamanho(estoqueTamanho);
                break;
            case CREATINA:
            case WHEY_PROTEIN:
                ESabor sabor = ESabor.valueOf(identificadorVariacao.toUpperCase());
                Map<ESabor, Integer> estoqueSabor = produto.getEstoquePorSabor();
                int estoqueAtualSabor = estoqueSabor.getOrDefault(sabor, 0);
                if (estoqueAtualSabor <= 0) {
                    throw new IllegalStateException("Produto sem estoque para o sabor " + identificadorVariacao);
                }
                estoqueSabor.put(sabor, estoqueAtualSabor - 1);
                produto.setEstoquePorSabor(estoqueSabor);
                break;
            case VITAMINAS:
                Integer estoquePadrao = produto.getEstoquePadrao();
                if (estoquePadrao == null || estoquePadrao <= 0) {
                    throw new IllegalStateException("Produto sem estoque.");
                }
                produto.setEstoquePadrao(estoquePadrao - 1);
                break;
        }
        repository.save(produto);
    }

    public void incrementarEstoque(String produtoId, String identificadorVariacao, ECategoria categoria) {
        Produto produto = getById(produtoId);

        if (!produto.getCategoria().equals(categoria)) {
            return;
        }

        switch (categoria) {
            case CAMISETAS:
                if (identificadorVariacao == null || identificadorVariacao.isBlank()) {
                    return;
                }
                ETamanho tamanho = ETamanho.valueOf(identificadorVariacao.toUpperCase());
                Map<ETamanho, Integer> estoqueTamanho = produto.getEstoquePorTamanho();
                estoqueTamanho.put(tamanho, estoqueTamanho.getOrDefault(tamanho, 0) + 1);
                produto.setEstoquePorTamanho(estoqueTamanho);
                break;
            case CREATINA:
            case WHEY_PROTEIN:
                if (identificadorVariacao == null || identificadorVariacao.isBlank()) {
                    return;
                }
                ESabor sabor = ESabor.valueOf(identificadorVariacao.toUpperCase());
                Map<ESabor, Integer> estoqueSabor = produto.getEstoquePorSabor();
                estoqueSabor.put(sabor, estoqueSabor.getOrDefault(sabor, 0) + 1);
                produto.setEstoquePorSabor(estoqueSabor);
                break;
            case VITAMINAS:
                Integer estoquePadrao = produto.getEstoquePadrao();
                produto.setEstoquePadrao(estoquePadrao != null ? estoquePadrao + 1 : 1);
                break;
        }
        repository.save(produto);
    }

    private void validarCamposParaUpdate(ProdutoDTO dto) {
        // Valida o preço apenas se ele foi fornecido
        if (dto.getPreco() != null && dto.getPreco() <= 0) {
            throw new IllegalArgumentException("Preço deve ser maior que zero");
        }

        // Valida o preço promocional e as datas associadas
        if (dto.getPrecoPromocional() != null) {
            if (dto.getPrecoPromocional() <= 0) {
                throw new IllegalArgumentException("Preço promocional deve ser maior que zero");
            }
            // Se um preço promocional é enviado, as datas também devem ser válidas
            if (dto.getDataInicioPromocao() == null || dto.getDataFimPromocao() == null) {
                throw new IllegalArgumentException("Datas de início e fim da promoção são obrigatórias quando um preço promocional é fornecido.");
            }
        }

        // Valida a consistência das datas da promoção, se ambas forem fornecidas
        if (dto.getDataInicioPromocao() != null && dto.getDataFimPromocao() != null) {
            try {
                LocalDateTime inicio = parseDate(dto.getDataInicioPromocao(), "dataInicioPromocao");
                LocalDateTime fim = parseDate(dto.getDataFimPromocao(), "dataFimPromocao");
                if (fim != null && inicio != null && fim.isBefore(inicio)) {
                    throw new IllegalArgumentException("Data de fim da promoção não pode ser anterior à data de início.");
                }
            } catch (IllegalArgumentException e) {
                throw e; // Relança a exceção de formato de data
            }
        }

        // Valida os estoques se eles forem fornecidos
        if (dto.getCategoria() != null) {
            switch (dto.getCategoria()) {
                case CAMISETAS:
                    if (dto.getEstoquePorTamanho() != null) {
                        dto.getEstoquePorTamanho().forEach((tamanhoStr, qtd) -> {
                            if (qtd < 0) throw new IllegalArgumentException("Estoque não pode ser negativo.");
                        });
                    }
                    break;
                case CREATINA:
                case WHEY_PROTEIN:
                    if (dto.getEstoquePorSabor() != null) {
                        dto.getEstoquePorSabor().forEach((saborStr, qtd) -> {
                            if (qtd < 0) throw new IllegalArgumentException("Estoque não pode ser negativo.");
                        });
                    }
                    break;
                case VITAMINAS:
                    if (dto.getEstoquePadrao() != null && dto.getEstoquePadrao() < 0) {
                        throw new IllegalArgumentException("Estoque padrão não pode ser negativo.");
                    }
                    break;
            }
        }
    }

    private void validarCamposObrigatoriosParaCriacao(ProdutoDTO dto) {
        if (dto.getNome() == null || dto.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("Nome é obrigatório");
        }
        if (dto.getDescricao() == null || dto.getDescricao().trim().isEmpty()) {
            throw new IllegalArgumentException("Descrição é obrigatória");
        }
        if (dto.getPreco() == null || dto.getPreco() <= 0) {
            throw new IllegalArgumentException("Preço inválido");
        }
        if (dto.getCategoria() == null) {
            throw new IllegalArgumentException("Categoria é obrigatória.");
        }
        if (dto.getImg() == null || dto.getImg().isEmpty()) {
            throw new IllegalArgumentException("Imagem é obrigatória");
        }
        switch (dto.getCategoria()) {
            case CAMISETAS:
                if (dto.getEstoquePorTamanho() == null || dto.getEstoquePorTamanho().isEmpty()) {
                    throw new IllegalArgumentException("Para 'Camisetas', o estoque por tamanho é obrigatório.");
                }
                dto.getEstoquePorTamanho().forEach((tamanhoStr, qtd) -> {
                    try {
                        ETamanho.valueOf(tamanhoStr.toUpperCase());
                        if (qtd < 0) throw new IllegalArgumentException("Estoque não pode ser negativo.");
                    } catch (IllegalArgumentException e) {
                        throw new IllegalArgumentException("Tamanho inválido para 'Camisetas': " + tamanhoStr);
                    }
                });
                break;
            case CREATINA:
            case WHEY_PROTEIN:
                if (dto.getEstoquePorSabor() == null || dto.getEstoquePorSabor().isEmpty()) {
                    throw new IllegalArgumentException("Para 'Creatina' ou 'Whey Protein', o estoque por sabor é obrigatório.");
                }
                dto.getEstoquePorSabor().forEach((saborStr, qtd) -> {
                    try {
                        ESabor.valueOf(saborStr.toUpperCase());
                        if (qtd < 0) throw new IllegalArgumentException("Estoque não pode ser negativo.");
                    } catch (IllegalArgumentException e) {
                        throw new IllegalArgumentException("Sabor inválido para 'Creatina' ou 'Whey Protein': " + saborStr);
                    }
                });
                break;
            case VITAMINAS:
                if (dto.getEstoquePadrao() == null || dto.getEstoquePadrao() < 0) {
                    throw new IllegalArgumentException("Para 'Vitaminas', o estoque padrão é obrigatório e não pode ser negativo.");
                }
                break;
        }

        if (dto.getPrecoPromocional() != null) {
            if (dto.getPrecoPromocional() <= 0) {
                throw new IllegalArgumentException("Preço promocional deve ser maior que zero");
            }
            if (dto.getDataInicioPromocao() == null || dto.getDataFimPromocao() == null) {
                throw new IllegalArgumentException("Datas de início e fim da promoção são obrigatórias quando um preço promocional é fornecido.");
            }
            try {
                LocalDateTime inicio = parseDate(dto.getDataInicioPromocao(), "dataInicioPromocao");
                LocalDateTime fim = parseDate(dto.getDataFimPromocao(), "dataFimPromocao");
                if (fim != null && inicio != null && fim.isBefore(inicio)) {
                    throw new IllegalArgumentException("Data de fim da promoção não pode ser anterior à data de início.");
                }
            } catch (IllegalArgumentException e) {
                throw e;
            }
        }
    }

    private String uploadImagem(MultipartFile file) {
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "produtos",
                            "resource_type", "image"
                    ));
            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            throw new RuntimeException("Falha ao fazer upload da imagem: " + e.getMessage());
        }
    }

    private void deletarImagem(String imageUrl) {
        try {
            String publicId = imageUrl.substring(imageUrl.lastIndexOf("/") + 1, imageUrl.lastIndexOf("."));
            cloudinary.uploader().destroy("produtos/" + publicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
            System.err.println("Falha ao deletar imagem antiga: " + e.getMessage());
        }
    }
}