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
@Tag(name = "Produtos", description = "Endpoints para gerenciamento do catálogo de produtos.")
public class ProdutoController {

    private final ProdutoService service;

    @Operation(
            summary = "Lista todos os produtos ou filtra",
            description = "Endpoint público que retorna uma lista de todos os produtos. Pode ser filtrado por nome ou por categoria."
    )
    @ApiResponse(responseCode = "200", description = "Produtos listados com sucesso.")
    @GetMapping
    public ResponseEntity<List<Produto>> getAll(
            @Parameter(description = "Filtra produtos cujo nome contenha o valor informado.")
            @RequestParam(required = false) String nome,
            @Parameter(description = "Filtra produtos pela categoria exata.")
            @RequestParam(required = false) ECategoria categoria) {

        if (categoria != null) {
            return ResponseEntity.ok(service.getProdutosPorCategoria(categoria));
        }

        if (nome != null && !nome.isEmpty()) {
            return ResponseEntity.ok(service.getProdutosPorNome(nome));
        }

        return ResponseEntity.ok(service.getAll());
    }

    @Operation(summary = "Lista os produtos em destaque", description = "Endpoint público que retorna uma lista dos produtos mais populares/reservados.")
    @ApiResponse(responseCode = "200", description = "Produtos em destaque listados com sucesso.")
    @GetMapping("/destaques")
    public ResponseEntity<List<Produto>> getDestaques() {
        return ResponseEntity.ok(service.getProdutosDestaques());
    }

    @Operation(summary = "Busca um produto por ID", description = "Endpoint público que retorna os detalhes de um produto específico.")
    @ApiResponse(responseCode = "200", description = "Produto encontrado.")
    @ApiResponse(responseCode = "404", description = "Produto não encontrado.", content = @Content)
    @GetMapping("/{id}")
    public ResponseEntity<Produto> getById(@Parameter(description = "ID do produto a ser buscado.") @PathVariable String id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Cria um novo produto", description = "Cria um novo produto no catálogo. Requer perfil de ADMIN.")
    @ApiResponse(responseCode = "201", description = "Produto criado com sucesso.")
    @ApiResponse(responseCode = "400", description = "Dados do produto inválidos.", content = @Content)
    @ApiResponse(responseCode = "403", description = "Acesso negado.", content = @Content)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Produto> create(
            @ModelAttribute ProdutoDTO dto,
            UriComponentsBuilder uriBuilder) throws IOException {

        Produto produto = service.create(dto);
        URI uri = uriBuilder.path("/api/produtos/{id}").buildAndExpand(produto.getId()).toUri();
        return ResponseEntity.created(uri).body(produto);
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Atualiza um produto existente", description = "Atualiza os dados de um produto existente. Requer perfil de ADMIN.")
    @ApiResponse(responseCode = "200", description = "Produto atualizado com sucesso.")
    @ApiResponse(responseCode = "404", description = "Produto não encontrado.", content = @Content)
    @ApiResponse(responseCode = "403", description = "Acesso negado.", content = @Content)
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Produto> update(
            @Parameter(description = "ID do produto a ser atualizado.") @PathVariable String id,
            @ModelAttribute ProdutoDTO dto) throws IOException {

        return ResponseEntity.ok(service.update(id, dto));
    }

    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Exclui um produto", description = "Remove um produto do catálogo. Requer perfil de ADMIN.")
    @ApiResponse(responseCode = "204", description = "Produto excluído com sucesso.")
    @ApiResponse(responseCode = "404", description = "Produto não encontrado.", content = @Content)
    @ApiResponse(responseCode = "403", description = "Acesso negado.", content = @Content)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@Parameter(description = "ID do produto a ser excluído.") @PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}