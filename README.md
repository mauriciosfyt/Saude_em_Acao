# Saúde em Ação - Front-End Web

Este projeto é a interface web para o sistema **Saúde em Ação**, uma plataforma dedicada à gestão, acompanhamento, e disseminação de informações relacionadas à saúde pública e ações sociais.

---

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Rodar o Projeto](#como-rodar-o-projeto)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Contribuição](#contribuição)
- [Licença](#licença)
- [Contato](#contato)

## Sobre o Projeto

O **Saúde em Ação - Front Web** busca fornecer uma solução intuitiva para que profissionais, gestores e cidadãos possam acessar dados, relatórios, e informações atualizadas sobre iniciativas na área da saúde.

---

## Estrutura do Projeto

A estrutura básica do projeto é organizada da seguinte forma:

```plaintext
Front-Web/
├── public/          # Arquivos públicos e estáticos (index.html, favicon, etc)
├── src/
│   ├── assets/      # Imagens, fontes e outros recursos
│   ├── components/  # Componentes reutilizáveis da interface
│   ├── pages/       # Páginas principais do sistema
│   ├── services/    # Arquivos de conexão com APIs e serviços externos
│   ├── utils/       # Funções utilitárias
│   ├── App.tsx      # Componente principal do React
│   ├── main.tsx     # Arquivo de bootstrap da aplicação
├── .env             # Variáveis de ambiente
├── package.json     # Gerenciador de dependências e scripts
├── tsconfig.json    # Configuração do TypeScript
└── README.md        # Documentação do projeto
```

---

## Tecnologias Utilizadas

- [React](https://react.dev/) - Biblioteca para criação de interfaces de usuário
- [TypeScript](https://www.typescriptlang.org/) - Superset de JavaScript para tipagem estática
- [Vite](https://vitejs.dev/) - Ferramenta de build e dev server ultra-rápido
- [Axios](https://axios-http.com/) - Cliente HTTP para integração com APIs
- [React Router](https://reactrouter.com/) - Gerenciamento de rotas SPA
- [Styled Components](https://styled-components.com/) ou CSS Modules - Estilização
- [ESLint](https://eslint.org/) e [Prettier](https://prettier.io/) - Padronização de código

---

## Como Rodar o Projeto

1. **Pré-requisitos**
    - [Node.js](https://nodejs.org/) (versão 16+ recomendada)
    - [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

2. **Clonar o repositório**
    ```bash
    git clone https://github.com/mauriciosfyt/Saude_em_Acao.git
    cd Saude_em_Acao/Front-Web
    ```

3. **Instalar dependências**
    ```bash
    npm install
    # ou
    yarn install
    ```

4. **Configurar variáveis de ambiente**
    - Crie um arquivo `.env` (se necessário) seguindo o exemplo `.env.example`.

5. **Rodar o projeto**
    ```bash
    npm run dev
    # ou
    yarn dev
    ```

6. **Acessar aplicação**
   - Abra `http://localhost:5173` (ou a porta indicada pelo terminal) no seu navegador para acessar a interface.

---

## Funcionalidades Principais

- Visualização de ações de saúde
- Cadastro e edição de informações
- Relatórios e gráficos dinâmicos
- Autenticação de usuários
- Integração com serviços externos via API

---

## Contribuição

Contribuições são muito bem-vindas! Siga os passos abaixo:

1. Fork este repositório
2. Crie uma branch: `git checkout -b minha-feature`
3. Faça o commit das suas alterações: `git commit -m 'Minha nova feature'`
4. Envie para o GitHub: `git push origin minha-feature`
5. Abra um Pull Request

---

## Licença

Este projeto está sob a licença MIT.

---

## Contato

- Projeto mantido por [Maurício S. Fyt](https://github.com/mauriciosfyt)

Em caso de dúvidas, sugestões ou problemas, abra uma Issue ou entre em contato!
