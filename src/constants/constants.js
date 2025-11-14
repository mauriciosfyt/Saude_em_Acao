// Theme colors
export const COLORS = {
  primaria: '#007bff',
  secundaria: '#6c757d',
  sucesso: '#28a745',
  perigo: '#dc3545',
  aviso: '#ffc107',
  info: '#17a2b8',
  claro: '#f8f9fa',
  escuro: '#343a40',
  branco: '#ffffff',
  preto: '#000000',
  cinzaClaro: '#e9ecef',
  cinzaMedio: '#6c757d',
  cinzaEscuro: '#495057',
  // overlay global: reduzir/remover sombra pesada
  overlay: 'transparent',
};

// Spacing
export const SPACING = {
  pequeno: 8,
  medio: 16,
  grande: 24,
  muitoGrande: 32,
  extraGrande: 40,
};

// Font sizes
export const FONTS = {
  pequena: 12,
  media: 14,
  normal: 16,
  grande: 18,
  muitoGrande: 20,
  titulo: 22,
  tituloGrande: 28,
};

// Border radii
export const BORDERS = {
  pequena: 8,
  media: 12,
  grande: 16,
  muitoGrande: 20,
};

// Text strings
export const TEXTS = {
  login: {
    titulo: 'Login',
    email: 'Email:',
    senha: 'Senha:',
    botaoEntrar: 'Entrar',
    placeholderEmail: 'Digite seu email',
    placeholderSenha: 'Digite sua senha',
    erroCamposVazios: 'Por favor, preencha todos os campos',
    politicaPrivacidade: 'Política de privacidade',
    tratamentoDados: 'Tratamento de dados pessoais',
    textoPoliticas: 'Ao começar declara estar de acordo com a nossa Política de privacidade e com o nosso Tratamento de dados pessoais',
  },
  modal: {
    politicas: 'Políticas e termos',
    termos: 'Termos de uso',
    politicaPrivacidade: 'Política de Privacidade',
    termosUso: 'Termos de Uso',
    botaoFechar: '✕',
    botaoConcordar: 'Concordar',
    botaoTermos: 'Termos',
    botaoPolitica: 'Política de privacidade',
  },
};

// Animations
export const ANIMATIONS = {
  duracao: {
    rapida: 200,
    normal: 300,
    lenta: 500,
  },
  easing: {
    padrao: 'ease',
    suave: 'ease-in-out',
  },
};

// Dimensions
export const DIMENSIONS = {
  alturaModal: '80%',
  alturaMinimaModal: '50%',
  larguraModal: '90%',
};

// Validation
export const VALIDATIONS = {
  email: {
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    mensagem: 'Por favor, insira um email válido',
  },
  senha: {
    minimo: 6,
    mensagem: 'A senha deve ter pelo menos 6 caracteres',
  },
};

// Modal types (kept in Portuguese to match existing usage)
export const TIPOS_MODAL = {
  politicas: 'politicas',
  termos: 'termos',
};

// Status strings
export const STATES = {
  carregando: 'carregando',
  sucesso: 'sucesso',
  erro: 'erro',
  vazio: 'vazio',
};
