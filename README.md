# Saúde em Ação

> **Resumo:**  
  O Saúde em Ação é uma plataforma web completa e moderna voltada à saúde, bem-estar e à gestão da academia.
> O sistema oferece soluções personalizadas e integradas para alunos, professores e administradores, contemplando desde o acompanhamento de treinos até o gerenciamento administrativo,
 com interfaces intuitivas e tecnologias atuais.
> O projeto está dividido em três módulos principais: Frontend (interface web), Backend Login (API de autenticação e serviços), e Backend Administrativo (gestão centralizada da academia).

---


## 📚 Sumário

- [Sobre o Projeto](#sobre-o-projeto)  
- [Arquitetura & Estrutura de Pastas](#arquitetura--estrutura-de-pastas)  
- [Funcionalidades Detalhadas](#funcionalidades-detalhadas)  
- [Tecnologias Utilizadas](#tecnologias-utilizadas)  
- [Guia de Instalação (Passo a Passo)](#guia-de-instalação-passo-a-passo)  
- [Como Usar](#como-usar)  
- [Configuração de Ambiente](#configuração-de-ambiente)  
- [Principais Endpoints da API](#principais-endpoints-da-api)  
- [Fluxo de Desenvolvimento & Contribuição](#fluxo-de-desenvolvimento--contribuição)  
- [Licença](#licença)  
- [Contato](#contato)  
- [Protótipo](#protótipo)  
---

## 🖥️ Front-End

O Front-End do **Saúde em Ação** é uma aplicação web que oferece uma experiência intuitiva para usuários de diferentes perfis.

### 📋 Descrição

- Plataforma web para gerenciamento de saúde, treinos, produtos e interação entre usuários.
- Áreas dedicadas para alunos, professores e administradores.

---

### 🚀 Funcionalidades

#### Área do Aluno
- Visualização e gerenciamento de perfil
- Agendamento de aulas
- Acesso a treinos personalizados
- Loja de produtos

#### Área do Professor
- Gerenciamento de alunos
- Montagem de treinos
- Acompanhamento de progresso

#### Área Administrativa
- Gerenciamento de professores
- Gerenciamento de produtos
- Dashboard administrativo
- Controle de usuários

---

### 🛠️ Tecnologias Utilizadas

- HTML5, CSS3, JavaScript
- Bootstrap
- Serviços RESTful

---

### 📁 Estrutura do Projeto

```text
Saude_em_Acao-Front-web/
├── css/           # Arquivos de estilo
├── js/            # Scripts JavaScript
├── img/           # Imagens do projeto
├── icones/        # Ícones utilizados
├── service/       # Serviços e integrações
└── *.html         # Páginas da aplicação
```

---

### 🔧 Instalação

1. Clone o repositório:
   ```bash
   git clone [URL_DO_REPOSITÓRIO]
   ```
2. Navegue até o diretório do projeto:
   ```bash
   cd Saude_em_Acao-Front-web
   ```
3. Abra o arquivo `index.html` no navegador.

---

### 📱 Páginas Principais

- `index.html` - Página inicial
- `perfil.html` - Perfil do usuário
- `dashboard.html` - Painel de controle
- `loja.html` - Loja de produtos
- `montagemtreino.html` - Criação de treinos
- `gerenciaralunos.html` - Gerenciamento de alunos
- `gerenciarprofessores.html` - Gerenciamento de professores
- `gerenciarproduto.html` - Gerenciamento de produtos

---

### 📄 Documentação Adicional

- `TermosUso.html` - Termos de uso
- `PoliticaPrivacidade.html` - Política de privacidade

---

## 🔐 Backend Login

API RESTful desenvolvida com Spring Boot para autenticação, gerenciamento de usuários e serviços relacionados à saúde.

---

### 🚀 Tecnologias Utilizadas

- Java 17, Spring Boot 3.4.4
- Spring Security, JWT Authentication (Autenticação JWT)
- Spring Data JPA, MySQL, Maven
- Lombok, MapStruct
- WebSocket, Spring Mail

---

### 📋 Pré-requisitos

- JDK 17 ou superior
- Maven
- MySQL
- Docker (opcional)

---

### 🔧 Configuração do Ambiente

1. Clone o repositório:
   ```bash
   git clone https://api-login-lt52.onrender.com
   ```
2. Configure o MySQL:
   - Crie o banco de dados
   - Ajuste as credenciais em `application.properties`
3. Instale as dependências:
   ```bash
   mvn clean install
   ```
4. Execute a aplicação:
   ```bash
   mvn spring-boot:run
   ```

---

### 🌐 Link da API de Login

- **API de Login:** [https://api-login-lt52.onrender.com](https://api-login-lt52.onrender.com)

---

### 🐳 Executando com Docker

1. Construa a imagem:
   ```bash
   docker build -t saude-em-acao-backend .
   ```
2. Execute o container:
   ```bash
   docker run -p 8080:8080 saude-em-acao-backend
   ```

---

### 📚 Documentação da API

Acesse via Swagger UI após iniciar a aplicação:  
[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

### 🔐 Segurança

- Autenticação JWT
- Spring Security (Segurança Spring)
- Validação de dados
- Proteção contra ataques comuns

---

### 📧 Funcionalidades

- Autenticação e autorização de usuários
- Gerenciamento completo de usuários
- API RESTful com documentação automática
- Comunicação em tempo real via WebSocket
- Envio de e-mails

---

### 🛠️ Estrutura do Projeto

```text
src/
├── main/
│   ├── java/
│   │   └── br/com/saudeemacao/
│   │       ├── config/
│   │       ├── controller/
│   │       ├── dto/
│   │       ├── entity/
│   │       ├── repository/
│   │       ├── service/
│   │       └── Security/
│   └── resources/
│       └── application.properties
```

---

## 🏢 Backend Administrativo

API RESTful desenvolvida em Spring Boot para gerenciamento administrativo da academia.

---

### 🚀 Tecnologias Utilizadas

- Java 21, Spring Boot 3.2.0
- Spring Data JPA, MySQL
- Lombok, Swagger/OpenAPI
- Cloudinary (upload de imagens)
- Maven

---

### 📋 Pré-requisitos

- Java 21 ou superior
- Maven
- MySQL
- IDE (IntelliJ IDEA ou Eclipse recomendado)

---

### 🔧 Configuração do Ambiente

1. Clone o repositório:
   ```bash
   git clone [URL_DO_REPOSITÓRIO]
   ```
2. Configure o MySQL:
   - Crie o banco de dados
   - Ajuste as credenciais em `application.properties`
3. Instale as dependências:
   ```bash
   mvn clean install
   ```
4. Execute a aplicação:
   ```bash
   mvn spring-boot:run
   ```

---

### 🌐 Link da API e Documentação

- **API Administrativa:** [https://api-admin-lt52.onrender.com](https://api-admin-lt52.onrender.com)
- **Documentação da API:** [https://api-admin.onrender.com/saude-em-acao](https://api-admin.onrender.com/saude-em-acao)

---

### 🛠️ Funcionalidades Principais

- Gerenciamento de usuários
- Upload de imagens via Cloudinary
- API RESTful com validação de dados
- Documentação automática com Swagger

---

### 📦 Estrutura do Projeto

```text
src/
├── main/
│   ├── java/
│   │   └── br/edu/senaisp/api_administrador/
│   │       ├── controllers/
│   │       ├── models/
│   │       ├── repositories/
│   │       ├── services/
│   │       └── ApiAdministradorApplication.java
│   └── resources/
│       └── application.properties
└── test/
```

---

## 🤝 Contribuindo

1. Faça um fork deste repositório
2. Crie uma branch para sua funcionalidade:
   ```bash
   git checkout -b feature/NomeDaFuncionalidade
   ```
3. Faça o commit das suas alterações:
   ```bash
   git commit -m 'Adiciona nova funcionalidade'
   ```
4. Faça o push para a branch:
   ```bash
   git push origin feature/NomeDaFuncionalidade
   ```
5. Abra um Pull Request (solicitação de alteração)

---

## 📬 Contato

Dúvidas ou sugestões? Entre em contato com alguns dos integrantes do grupo: 

- Mauricio da Silva: mauriciosfm1@gmail.com
- Arthur Pereira: arthurpsf8@gmail.com
- Ana Clara: anacs.lima007@gmail.com
- Artur Heleno: arthurhelenobritocosta@gmail.com
- Felipe Rottiner: feliperottnerrodrigues@gmail.com
- João Vitor: joaocostav80@gmail.com
- Pedro Feitosa: pedrimhorosa@gmail.com
- Pedro Honório: pedroh1835@gmail.com
- Stefani Carvalho: stefanii.santos007@gmail.com

---

## 📝 Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).

---

Desenvolvido com ❤️ pela equipe!
