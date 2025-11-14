package br.com.saudeemacao.api.controller;

import br.com.saudeemacao.api.dto.ProdutoDTO;
import br.com.saudeemacao.api.model.EnumProduto.ECategoria;
import br.com.saudeemacao.api.model.Produto;
import br.com.saudeemacao.api.service.ProdutoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/produtos")
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoService service;


    @GetMapping
    public ResponseEntity<List<Produto>> getAll(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) ECategoria categoria) {

        if (categoria != null) {
            return ResponseEntity.ok(service.getProdutosPorCategoria(categoria));
        }

        if (nome != null && !nome.isEmpty()) {
            return ResponseEntity.ok(service.getProdutosPorNome(nome));
        }

        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/destaques")
    public ResponseEntity<List<Produto>> getDestaques() {
        return ResponseEntity.ok(service.getProdutosDestaques());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> getById(@PathVariable String id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Produto> create(
            @ModelAttribute ProdutoDTO dto,
            UriComponentsBuilder uriBuilder) throws IOException {

        Produto produto = service.create(dto);
        URI uri = uriBuilder.path("/api/produtos/{id}").buildAndExpand(produto.getId()).toUri();
        return ResponseEntity.created(uri).body(produto);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Produto> update(
            @PathVariable String id,
            @ModelAttribute ProdutoDTO dto) throws IOException {

        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@Parameter(description = "ID do produto a ser excluído.") @PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}