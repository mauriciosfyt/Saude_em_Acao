// ProdutoService.java
package br.com.saudeemacao.api.service;

import br.com.saudeemacao.api.dto.ProdutoDTO;
import br.com.saudeemacao.api.exception.RecursoNaoEncontradoException;
import br.com.saudeemacao.api.model.Produto;
import br.com.saudeemacao.api.repository.ProdutoRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
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

    public List<Produto> getProdutosSemTamanho() {
        return repository.findByTipo(Produto.TipoProduto.SEMTAMANHO);
    }

    public List<Produto> getProdutosComTamanho() {
        return repository.findByTipo(Produto.TipoProduto.COMTAMANHO);
    }

    public Produto getById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Produto não encontrado com ID: " + id));
    }

    public Produto createSemTamanho(ProdutoDTO dto) throws IOException {
        validarCamposObrigatorios(dto, true);

        if (dto.getEstoque() == null || dto.getEstoque() < 0) {
            throw new IllegalArgumentException("Estoque inválido para produto sem tamanho");
        }

        String imgUrl = uploadImagem(dto.getImg());

        Produto produto = new Produto();
        produto.setNome(dto.getNome());
        produto.setDescricao(dto.getDescricao());
        produto.setPreco(dto.getPreco());
        produto.setTipo(Produto.TipoProduto.SEMTAMANHO);
        produto.setEstoque(dto.getEstoque());
        produto.setEstoquePorTamanho(null);
        produto.setImg(imgUrl);

        return repository.save(produto);
    }

    public Produto createComTamanho(ProdutoDTO dto) throws IOException {
        validarCamposObrigatorios(dto, true);

        if (dto.getEstoquePorTamanho() == null || dto.getEstoquePorTamanho().isEmpty()) {
            throw new IllegalArgumentException("Deve informar estoque para pelo menos um tamanho");
        }

        validarEstoquePorTamanho(dto.getEstoquePorTamanho());

        String imgUrl = uploadImagem(dto.getImg());

        Map<Produto.Tamanho, Integer> estoqueTamanho = dto.getEstoquePorTamanho().entrySet().stream()
                .collect(Collectors.toMap(
                        e -> Produto.Tamanho.valueOf(e.getKey()),
                        Map.Entry::getValue
                ));

        Produto produto = new Produto();
        produto.setNome(dto.getNome());
        produto.setDescricao(dto.getDescricao());
        produto.setPreco(dto.getPreco());
        produto.setTipo(Produto.TipoProduto.COMTAMANHO);
        produto.setEstoquePorTamanho(estoqueTamanho);
        produto.setEstoque(null);
        produto.setImg(imgUrl);

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

        if (produto.getTipo() == Produto.TipoProduto.SEMTAMANHO && dto.getEstoque() != null) {
            if (dto.getEstoque() < 0) {
                throw new IllegalArgumentException("Estoque não pode ser negativo");
            }
            produto.setEstoque(dto.getEstoque());
        } else if (produto.getTipo() == Produto.TipoProduto.COMTAMANHO && dto.getEstoquePorTamanho() != null) {
            validarEstoquePorTamanho(dto.getEstoquePorTamanho());
            Map<Produto.Tamanho, Integer> estoqueTamanho = dto.getEstoquePorTamanho().entrySet().stream()
                    .collect(Collectors.toMap(
                            e -> Produto.Tamanho.valueOf(e.getKey()),
                            Map.Entry::getValue
                    ));
            produto.setEstoquePorTamanho(estoqueTamanho);
        }

        if (dto.getImg() != null && !dto.getImg().isEmpty()) {
            String imgUrl = uploadImagem(dto.getImg());
            produto.setImg(imgUrl);
        }

        return repository.save(produto);
    }

    public void delete(String id) {
        if (!repository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Produto não encontrado com ID: " + id);
        }
        repository.deleteById(id);
    }

    private void validarCamposObrigatorios(ProdutoDTO dto, boolean isCreate) {
        if (isCreate) {
            if (dto.getNome() == null || dto.getNome().trim().isEmpty()) {
                throw new IllegalArgumentException("Nome é obrigatório");
            }
            if (dto.getDescricao() == null || dto.getDescricao().trim().isEmpty()) {
                throw new IllegalArgumentException("Descrição é obrigatória");
            }
            if (dto.getPreco() == null || dto.getPreco() <= 0) {
                throw new IllegalArgumentException("Preço inválido");
            }
            if (dto.getImg() == null || dto.getImg().isEmpty()) {
                throw new IllegalArgumentException("Imagem é obrigatória");
            }
        }
    }

    private void validarEstoquePorTamanho(Map<String, Integer> estoquePorTamanho) {
        if (estoquePorTamanho == null) return;

        estoquePorTamanho.forEach((tamanhoStr, quantidade) -> {
            try {
                Produto.Tamanho.valueOf(tamanhoStr);
                if (quantidade < 0) {
                    throw new IllegalArgumentException("Estoque não pode ser negativo para o tamanho " + tamanhoStr);
                }
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Tamanho inválido: " + tamanhoStr);
            }
        });
    }

    private String uploadImagem(MultipartFile file) {
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "format", "jpg",
                            "quality", "auto",
                            "fetch_format", "auto"
                    ));
            return uploadResult.get("url").toString();
        } catch (IOException e) {
            throw new RuntimeException("Falha ao fazer upload da imagem: " + e.getMessage());
        }
    }
}