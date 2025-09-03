package br.com.saudeemacao.api.service;

import br.com.saudeemacao.api.dto.ProdutoDTO;
import br.com.saudeemacao.api.exception.RecursoNaoEncontradoException;
import br.com.saudeemacao.api.model.EnumProduto.ECategoria;
import br.com.saudeemacao.api.model.EnumProduto.ESabor;
import br.com.saudeemacao.api.model.EnumProduto.ETamanho;
import br.com.saudeemacao.api.model.Produto;
import br.com.saudeemacao.api.repository.ProdutoRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository repository;
    private final Cloudinary cloudinary;

    public List<Produto> getAll() {
        return repository.findAll();
    }

    // Métodos para buscar produtos por categoria (adaptados)
    public List<Produto> getProdutosPorCategoria(ECategoria categoria) {
        return repository.findByCategoria(categoria);
    }

    public Produto getById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Produto não encontrado com ID: " + id));
    }

    public Produto create(ProdutoDTO dto) throws IOException {
        validarCamposObrigatorios(dto);

        String imgUrl = uploadImagem(dto.getImg());

        Produto produto = new Produto();
        produto.setNome(dto.getNome());
        produto.setDescricao(dto.getDescricao());
        produto.setPreco(dto.getPreco());
        produto.setImg(imgUrl);
        produto.setCategoria(dto.getCategoria());

        // Configuração do estoque baseada na categoria
        switch (dto.getCategoria()) {
            case CAMISETAS:
                if (dto.getEstoquePorTamanho() == null || dto.getEstoquePorTamanho().isEmpty()) {
                    throw new IllegalArgumentException("Estoque por tamanho é obrigatório para camisetas.");
                }
                produto.setEstoquePorTamanho(dto.getEstoquePorTamanho().entrySet().stream()
                        .collect(Collectors.toMap(
                                e -> ETamanho.valueOf(e.getKey().toUpperCase()),
                                Map.Entry::getValue
                        )));
                break;
            case CREATINA:
            case WHEY_PROTEIN:
                if (dto.getEstoquePorSabor() == null || dto.getEstoquePorSabor().isEmpty()) {
                    throw new IllegalArgumentException("Estoque por sabor é obrigatório para suplementos.");
                }
                produto.setEstoquePorSabor(dto.getEstoquePorSabor().entrySet().stream()
                        .collect(Collectors.toMap(
                                e -> ESabor.valueOf(e.getKey().toUpperCase()),
                                Map.Entry::getValue
                        )));
                break;
            case VITAMINAS:
                if (dto.getEstoquePadrao() == null || dto.getEstoquePadrao() < 0) {
                    throw new IllegalArgumentException("Estoque padrão é obrigatório para vitaminas.");
                }
                produto.setEstoquePadrao(dto.getEstoquePadrao());
                break;
            default:
                throw new IllegalArgumentException("Categoria de produto desconhecida.");
        }

        return repository.save(produto);
    }

    public Produto update(String id, ProdutoDTO dto) throws IOException {
        Produto produto = getById(id);

        if (dto.getNome() != null && !dto.getNome().trim().isEmpty()) {
            produto.setNome(dto.getNome());
        }

        if (dto.getDescricao() != null && !dto.getDescricao().trim().isEmpty()) {
            produto.setDescricao(dto.getDescricao());
        }

        if (dto.getPreco() != null) {
            if (dto.getPreco() <= 0) {
                throw new IllegalArgumentException("Preço deve ser maior que zero");
            }
            produto.setPreco(dto.getPreco());
        }

        if (dto.getCategoria() != null && !dto.getCategoria().equals(produto.getCategoria())) {
            throw new IllegalArgumentException("Alteração de categoria não permitida via atualização.");
        }

        // Atualização do estoque baseada na categoria existente
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
                    if (dto.getEstoquePadrao() < 0) {
                        throw new IllegalArgumentException("Estoque padrão não pode ser negativo.");
                    }
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
            // Se a categoria não corresponder, algo está errado, mas podemos não querer lançar erro
            // Dependendo da lógica de negócio, pode-se apenas logar ou ignorar.
            // Por simplicidade, vamos ignorar se a categoria não corresponder, assumindo que o chamador sabe a categoria correta.
            return;
        }

        switch (categoria) {
            case CAMISETAS:
                if (identificadorVariacao == null || identificadorVariacao.isBlank()) {
                    return; // Não podemos incrementar sem o tamanho
                }
                ETamanho tamanho = ETamanho.valueOf(identificadorVariacao.toUpperCase());
                Map<ETamanho, Integer> estoqueTamanho = produto.getEstoquePorTamanho();
                estoqueTamanho.put(tamanho, estoqueTamanho.getOrDefault(tamanho, 0) + 1);
                produto.setEstoquePorTamanho(estoqueTamanho);
                break;
            case CREATINA:
            case WHEY_PROTEIN:
                if (identificadorVariacao == null || identificadorVariacao.isBlank()) {
                    return; // Não podemos incrementar sem o sabor
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

    private void validarCamposObrigatorios(ProdutoDTO dto) {
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
        // Validação de estoque específica por categoria
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