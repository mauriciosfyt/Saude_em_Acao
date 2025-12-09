# Bug no Backend - Treino Null em Alunos

## Problema
Ao chamar `GET /api/aluno`, o backend lança uma exceção 400:
```
Cannot invoke "br.com.saudeemacao.api.model.Treino.getId()" because "t" is null
```

## Causa Raiz
O backend está tentando acessar propriedades de um objeto `Treino` que é `null` durante a serialização da resposta JSON. Isso ocorre porque:
1. Há alunos na base de dados com `treino_id = null`
2. O backend carrega o objeto Aluno com o Treino como `null`
3. Durante a serialização, o código tenta chamar `treino.getId()` sem validar se é `null`

## Solução Implementada (Frontend)
A função `getAllAlunos()` em `src/services/usuarioService.js` agora:
1. **Tenta primeiro com parâmetro `?exclude=treino`** para não incluir dados aninhados problemáticos
2. **Se falhar, tenta novamente sem o parâmetro** 
3. **Processa e filtra os alunos** para remover dados inválidos
4. **Retorna apenas alunos válidos**

## Solução Necessária (Backend) - CRÍTICO

O backend precisa corrigir o mapeamento JSON ou a query. Escolha uma das opções:

### Opção 1: Ignorar treino null na serialização (RECOMENDADO)
Adicionar `@JsonInclude(Include.NON_NULL)` na classe Aluno:
```java
import com.fasterxml.jackson.annotation.JsonInclude;

@Entity
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Aluno {
    // ... campos
    
    private Treino treino; // Será ignorado se for null
}
```

### Opção 2: Validar antes de acessar getId()
Se está chamando `treino.getId()` em algum lugar, envolver com validação:
```java
// ANTES (causa erro):
int idTreino = aluno.getTreino().getId();

// DEPOIS (correto):
Integer idTreino = null;
if (aluno.getTreino() != null) {
    idTreino = aluno.getTreino().getId();
}
```

### Opção 3: Usar LEFT JOIN na query
Se está usando uma query que busca alunos com treino:
```java
// ANTES (INNER JOIN - rejeta alunos sem treino):
SELECT a FROM Aluno a INNER JOIN Treino t ON a.treino = t

// DEPOIS (LEFT JOIN - inclui alunos sem treino):
SELECT a FROM Aluno a LEFT JOIN FETCH a.treino t
```

## Workaround Atual
O frontend tenta chamar:
```
GET /api/aluno?exclude=treino
```

Se o backend suportar este parâmetro, ele não incluirá dados aninhados e funcionará. Caso contrário, o frontend filtra os dados e remove campos inválidos.

## Logs para Diagnóstico
No console do navegador, procure por:
- `⚠️ Falhou com exclude=treino, tentando sem parâmetro...` - Significa que o backend não reconheceu o parâmetro
- `📊 Total de alunos válidos: X` - Quantidade de alunos carregados com sucesso
- `📊 Filtrados X aluno(s) com dados inválidos` - Alunos que foram removidos por dados quebrados

## Status
- ✅ Workaround implementado no frontend
- ⏳ **CRÍTICO**: Aguardando correção no backend (causa erro 400 em toda requisição)
- 🔧 Frontend consegue contornar temporariamente, mas backend deve ser corrigido urgentemente

