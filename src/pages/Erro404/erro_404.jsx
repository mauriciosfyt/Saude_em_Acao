// src/pages/Erro404/index.jsx
import React from "react";
import HeaderUser from "../../components/header";
import Footer from "../../components/footer";
import "./Erro404.css";

// Imagem do erro
import erro404 from "../../assets/banners/banner_erro404.png"; // coloque sua imagem na pasta assets

const Erro404 = () => {
  return (
    <div className="erro-404">
      <HeaderUser />

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

export default Erro404;
