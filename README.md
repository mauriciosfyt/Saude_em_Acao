# Saúde em Ação - Academia

**Saúde em Ação** é uma aplicação web para gerenciamento de academias, desenvolvida com Spring Boot, MongoDB, autenticação JWT, envio de e-mails via SMTP, e upload de mídias no Cloudinary.

## 🚀 Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Configuração de Ambiente](#configuração-de-ambiente)
- [Como Executar Localmente](#como-executar-localmente)
- [Principais Funcionalidades](#principais-funcionalidades)
- [Testes](#testes)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Boas Práticas & Segurança](#boas-práticas--segurança)
- [Contato](#contato)

---

## 📝 Sobre o Projeto

Este sistema tem como objetivo facilitar o gerenciamento de academias, permitindo cadastro de alunos, controle de treinos, gestão de avaliações físicas, entre outras funcionalidades. O backend é desenvolvido em **Spring Boot** e utiliza **MongoDB** como banco de dados.

---

## ⚙ Tecnologias Utilizadas

- [Spring Boot](https://spring.io/projects/spring-boot)
- [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- [JWT (JSON Web Token)](https://jwt.io/)
- [Cloudinary](https://cloudinary.com/)
- [SMTP Gmail](https://support.google.com/mail/answer/7126229?hl=pt-BR)
- [Maven](https://maven.apache.org/)
- [Java](https://www.java.com/)
- [Docker](https://www.docker.com/) _(opcional)_

---

## 📋 Requisitos

- **Java 17+**
- **Maven 3.8+**
- **Conta no MongoDB Atlas**
- **Conta no Cloudinary**
- **Conta de e-mail para SMTP (Gmail recomendado)**

---

## 🛠 Instalação

1. **Clone o repositório:**

    ```bash
    git clone https://github.com/seu-usuario/seu-repo.git
    cd seu-repo
    ```

2. **Configure as variáveis de ambiente:**

    Crie um arquivo `.env` na raiz do projeto com o seguinte template (não compartilhe credenciais reais!):

    ```env
    # Configurações da Aplicação
    SERVER_PORT=8080
    SPRING_APPLICATION_NAME=Saude-em-acao

    # Banco de Dados MongoDB
    SPRING_DATA_MONGODB_URI=seu_mongodb_uri

    # Segurança e JWT
    SPRING_SECURITY_JWT_SECRET=seu_jwt_secret
    SPRING_SECURITY_JWT_EXPIRATION=3600000

    # Configuração de E-mail (SMTP)
    SPRING_MAIL_HOST=smtp.gmail.com
    SPRING_MAIL_PORT=587
    SPRING_MAIL_USERNAME=seu_email
    SPRING_MAIL_PASSWORD=sua_senha_de_aplicativo_email

    # Cloudinary
    CLOUDINARY_CLOUD_NAME=seu_cloud_name
    CLOUDINARY_API_KEY=seu_api_key
    CLOUDINARY_API_SECRET=seu_api_secret
    ```

---

## ⚡ Como Executar Localmente

1. Verifique se o Java e Maven estão instalados.
2. Execute o comando abaixo:

    ```bash
    ./mvnw spring-boot:run
    ```
    ou, se preferir:

    ```bash
    mvn spring-boot:run
    ```

3. O backend estará disponível em `http://localhost:8080` (ou conforme configurado).

---

## 🔐 Principais Funcionalidades

### Autenticação & Segurança

- Registro e login de usuário com JWT
- Proteção de rotas privadas via token JWT

### Gestão

- Cadastro de alunos e instrutores
- Avaliações físicas
- Controle de treinos/exercícios
- Upload de fotos de perfil e mídias para Cloudinary
- Envio de e-mail para confirmação e notificações

---

## ✅ Testes

> _Implemente testes automatizados para garantir o funcionamento das principais funcionalidades._

Execute:
```bash
mvn test
```
---

## 📁 Estrutura de Pastas

Sugestão (pode ser adaptada conforme seu projeto):

```
src/
 ├─ main/
 │    ├─ java/
 │    │    └─ br/com/academia/...
 │    └─ resources/
 │         ├─ application.properties
 │         └─ ...
 ├─ test/
│     └─ java/
│           └─ br/com/academia/...
.env
.gitignore
README.md
pom.xml
```
---

## 🔒 Boas Práticas & Segurança

- Nunca versionar `.env` ou `application.properties` com dados sensíveis.
- Use senhas de aplicativo para SMTP (Gmail).
- Não compartilhe seu JWT_SECRET e credenciais do Cloudinary publicamente.
- Atualize suas credenciais periodicamente.
- Implemente autenticação robusta e restrição de acesso a endpoints sensíveis.

---

## 📬 Contato

Caso tenha dúvidas ou sugestões, abra uma issue ou entre em contato pelo GitHub.

---
