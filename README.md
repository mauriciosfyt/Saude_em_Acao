# Saúde em Ação - Front-Mobile

Este projeto é o aplicativo mobile do programa **Saúde em Ação**. Ele visa facilitar o acesso a informações e serviços de saúde, promovendo o bem-estar dos usuários por meio de uma interface moderna, fácil de usar e integrada com recursos fundamentais.

## Tecnologias Utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/) (se aplicável)
- [TypeScript](https://www.typescriptlang.org/) (se aplicável)
- [Axios](https://axios-http.com/) para chamadas HTTP
- [React Navigation](https://reactnavigation.org/) para navegação
- [Redux](https://redux.js.org/) ou Context API para gerenciamento de estado (se utilizado)
- [Styled Components](https://styled-components.com/) para estilização

## Estrutura do Projeto

```text
Front-Mobile/
├── assets/           # Imagens, ícones, fontes e recursos estáticos
├── src/
│   ├── components/   # Componentes reutilizáveis da interface
│   ├── screens/      # Telas principais do app
│   ├── navigation/   # Lógica de navegação e rotas
│   ├── services/     # Configuração de APIs (ex.: Axios)
│   ├── store/        # Gerenciamento de estado (Redux/Context)
│   ├── utils/        # Funções auxiliares
│   └── App.tsx       # Ponto de entrada do aplicativo
├── app.json          # Configuração do projeto (Expo)
├── package.json      # Dependências e scripts do projeto
└── README.md         # Este arquivo
```

## Como Rodar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (se aplicável)
- Emulador Android/iOS ou dispositivo físico

### Passos

1. **Clone o repositório**
   ```bash
   git clone https://github.com/mauriciosfyt/Saude_em_Acao.git
   cd Saude_em_Acao/Front-Mobile
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Inicie o app**
   Se estiver usando Expo:
   ```bash
   npx expo start
   ```
   Se for React Native CLI:
   ```bash
   npx react-native run-android
   # ou
   npx react-native run-ios
   ```

4. **Emule ou escaneie o QR Code**
   - Utilize um emulador ou o aplicativo Expo Go para visualizar o app no seu dispositivo.

## Scripts Úteis

- `start`: Inicia o projeto.
- `android`: Executa no emulador Android.
- `ios`: Executa no emulador iOS.
- `test`: Roda testes unitários (se configurado).

## Contribuindo

1. Faça um fork do projeto.
2. Crie uma branch com sua feature/bugfix (`git checkout -b minha-feature`)
3. Faça commits claros e objetivos.
4. Abra um Pull Request descrevendo suas mudanças.

## Contato

Dúvidas ou sugestões? Abra uma issue ou envie um email para o mantenedor do repositório.

---
