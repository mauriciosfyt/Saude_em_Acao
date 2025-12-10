export const formatGenero = (val) => {
  if (!val && val !== 0) return '';
  const mapa = {
    'MASCULINO': 'Masculino',
    'FEMININO': 'Feminino',
    'OUTRO': 'Outro',
    'OUTROS': 'Outro'
  };
  if (mapa[val]) return mapa[val];
  // Qualquer outro valor será exibido como 'Outros' para manter apenas três opções
  return 'Outro';
};
