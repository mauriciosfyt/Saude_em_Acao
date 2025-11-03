import { logout } from '../../services/api';

// Função reutilizável que executa o logout (não renderiza UI)
// Opções: { reload: boolean } - se true, força reload após navegar. Default: { reload: false }
const performLogout = (navigate, options = { reload: false }) => {
  try {
    // Chama endpoint de logout se existir
    try { logout(); } catch (err) { console.warn('Erro ao chamar logout da API:', err); }

    // Remove tokens e dados
    try { localStorage.removeItem('token'); localStorage.removeItem('userEmail'); } catch (e) { /* ignore */ }
    try { sessionStorage.removeItem('token'); sessionStorage.removeItem('userEmail'); } catch (e) { /* ignore */ }

    // Opcionalmente limpa todo storage (mantemos tentativa anterior para compatibilidade)
    try { localStorage.clear(); sessionStorage.clear(); } catch (e) { /* ignore */ }

  // Dispara evento customizado para informar outros listeners na mesma aba
  try { window.dispatchEvent(new Event('app-logout')); } catch (e) { /* ignore */ }

    // Redireciona para home se o navigate for passado
    if (typeof navigate === 'function') {
      navigate('/');
      // ScrollToTop está montado em AppRoutes e fará o scroll automaticamente
    } else {
      // Se não tiver navigate, rola para o topo
      try { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); } catch (e) { try { window.scrollTo(0,0); } catch (er) { /* ignore */ } }
    }

    // Força reload para limpar estados da aplicação se explicitamente pedido
    if (options && options.reload) {
      try { window.location.reload(); } catch (e) { /* ignore */ }
    }
  } catch (error) {
    console.error('Erro durante performLogout:', error);
  }
};

export default performLogout;
export { performLogout };