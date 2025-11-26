# Projeto Saúde em Ação

Este repositório está organizado para cobrir todo o ciclo de desenvolvimento de uma solução multiplataforma voltada para a área de saúde. Abaixo você encontra um detalhamento do conteúdo de cada branch, arquivos principais, funcionalidades e finalidades.

---

## Branches do Projeto

### 1. **main**
Branch principal do projeto, contendo o README institucional, licenciamento, e uma visão consolidada do código. É usada para compor o produto final integrado das demais branches.

**Principais arquivos:**
- [README.md](https://github.com/mauriciosfyt/Saude_em_Acao/blob/main/README.md): Documento detalhado de apresentação do projeto, instruções de uso, instalação e arquitetura geral.
- [LICENSE](https://github.com/mauriciosfyt/Saude_em_Acao/blob/main/LICENSE): Licença de uso do projeto.

---

### 2. **backend**
Branch dedicada ao desenvolvimento do servidor da aplicação, provavelmente utilizando Java Spring ou similar (baseado na presença do `pom.xml` e estrutura de diretórios).

**Principais arquivos e diretórios:**
- [.env](https://github.com/mauriciosfyt/Saude_em_Acao/blob/backend/.env): Variáveis de ambiente.
- [.gitattributes](https://github.com/mauriciosfyt/Saude_em_Acao/blob/backend/.gitattributes): Configurações do Git.
- [.gitignore](https://github.com/mauriciosfyt/Saude_em_Acao/blob/backend/.gitignore): Exclusão de arquivos do versionamento.
- [Dockerfile](https://github.com/mauriciosfyt/Saude_em_Acao/blob/backend/Dockerfile): Build automatizada para containerização do backend.
- [pom.xml](https://github.com/mauriciosfyt/Saude_em_Acao/blob/backend/pom.xml): Gerenciador de dependências Maven.
- [`src`](https://github.com/mauriciosfyt/Saude_em_Acao/tree/backend/src): Onde está o código-fonte do backend, incluindo controllers, modelos, serviços e integração com APIs e o banco de dados.
- [README.md](https://github.com/mauriciosfyt/Saude_em_Acao/blob/backend/README.md): Documentação técnica do backend, endpoints e instruções de execução.

---

### 3. **Front-Web**
Branch voltada para o desenvolvimento do front-end web. Não retornou conteúdo específico, mas normalmente contempla arquivos de frameworks como React, Angular ou Vue na pasta raiz ou em subdiretórios (`src`, `public`, etc.).

**Provável estrutura comum:**
- `src/`: Código-fonte do front-end.
- `public/`: Arquivos públicos como HTML principal.
- `package.json`: Lista de dependências e scripts.
- `.env`: Variáveis de ambiente específicas para o front.

---

### 4. **Front-Mobile**
Branch para desenvolvimento do aplicativo mobile, provavelmente usando React Native ou Flutter, dada a convenção dos nomes.

**Provável estrutura comum:**
- `src/`: Código fonte mobile (componentes, rotas, integrações com backend).
- `android/`, `ios/`: Pastas específicas para build dos dispositivos.
- `README.md`: Guia rápido de instalação e configuração para desenvolvimento mobile.

---

## Funcionalidades Gerais

- Cadastro de alunos e profissionais de saúde.
- Agendamento de consultas e gerenciamento de horários.
- Histórico e acompanhamento de receitas.
- Área administrativa para controle de usuários e relatórios.
- Notificações, alertas e integração com demais sistemas de saúde via API.

---

## Como executar

1. **Backend:** Disponível no branch `backend`, rodar via Maven (`mvn spring-boot:run`) ou Docker.
2. **Front-Web:** Disponível no branch `Front-Web`, instalar dependências e rodar via `npm start`.
3. **Front-Mobile:** Disponível no branch `Front-Mobile`, rodar emulador via React Native (`npm run android`/`ios`) ou pelo Flutter.

---

## Licença

O projeto está sob a licença [LICENSE](https://github.com/mauriciosfyt/Saude_em_Acao/blob/main/LICENSE).

---

## Colaboração

Siga os passos de contribuição detalhados no README de cada branch. Sinta-se à vontade para abrir issues ou pull requests para melhorias!
