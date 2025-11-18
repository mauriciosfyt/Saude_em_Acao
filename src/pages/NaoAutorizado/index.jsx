// src/pages/NaoAutorizado/index.jsx
import React from "react";
import HeaderUser from "../../components/header";
import Header_nLogin from "../../components/header_nLogin";
import Footer from "../../components/footer";
import { useAuth } from "../../contexts/AuthContext";

// Imagem do erro
import erro404 from "../../assets/banners/banner_404.svg"; // coloque sua imagem na pasta assets

const NaoAutorizado = () => {
  const { isAuthenticated, loading } = useAuth();

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="erro-404">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '18px'
        }}>
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <div className="erro-404">
      {isAuthenticated ? <HeaderUser /> : <Header_nLogin />}

      {/* Banner do erro */}
      <div className="banner-gradient-erro">
        <section className="banner_erro">
          <img src={erro404} alt="Página não encontrada" />
        </section>
      </div>

      <main className="conteudo-principal">
        <section className="mensagem-erro">
          <h1>Ops! Página não encontrada</h1>
          <p>
            Parece que você tentou acessar uma página que não existe.  
            Use o menu para voltar ou explore nossas outras páginas.
          </p>
          <a href="/" className="btn-voltar">
            Voltar para a página inicial
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NaoAutorizado;
