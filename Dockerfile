# Estágio 1: Build - Usa uma imagem com Maven e JDK para compilar o projeto
FROM maven:3.8.5-openjdk-17 AS build

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o pom.xml primeiro para aproveitar o cache de camadas do Docker.
# As dependências só serão baixadas novamente se o pom.xml mudar.
COPY pom.xml .

# Baixa todas as dependências do projeto
RUN mvn dependency:go-offline

# Copia o código-fonte da sua aplicação
COPY src ./src

# Compila o projeto e gera o arquivo .jar, pulando os testes
RUN mvn package -DskipTests


# Estágio 2: Run - Usa uma imagem Java leve apenas para rodar a aplicação
# --- ALTERAÇÃO PRINCIPAL AQUI ---
FROM eclipse-temurin:17-jdk-jammy

# Define o diretório de trabalho
WORKDIR /app

# Copia APENAS o arquivo .jar gerado no estágio de build
COPY --from=build /app/target/*.jar app.jar

# Expõe a porta que a sua aplicação Spring usa (definida no application.properties)
EXPOSE 8085

# Comando para iniciar a aplicação quando o contêiner for executado
ENTRYPOINT ["java", "-jar", "app.jar"]
