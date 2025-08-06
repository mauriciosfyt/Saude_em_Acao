import React from "react";
import "./planos.css";

import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import produto1 from "../../assets/IMG PRODUTO.jpg";
import produto2 from "../../assets/IMG PRODUTO2.jpg";
import produto3 from "../../assets/IMG PRODUTO3.jpg";


import Header_nLogin from "../../components/header_loja_nLogin"
import Footer from "../../components/footer";

const Planos = () => {
  return (
    <>

    <Header_nLogin />

  <section className="planos-container">
  <div className="planos-header">
    <h2>Compare os planos Saúde em Ação disponíveis</h2>
    <p>Planos acessíveis para você treinar em nossas academias de alto padrão</p>
  </div>

  <div className="plano-cards branco">
    {/* PLANO BLACK */}
    <div className="plano-card destaque">
      <span className="mais-vantajoso ">o mais vantajoso</span>
      <h3 >Plano Black</h3>
      <p className="descricao branco">XXXXXXXXXX</p>
      <p className="preco"><b>R$ 300,00</b></p>
      <button className="plano-btn">Contratar</button>
<ul>
  <li><span className="icon check"><FaCheckCircle /></span> XXXXXXXXXXXXXXX</li>
  <li><span className="icon check"><FaCheckCircle /></span> XXXXXXXXXXXXXXX</li>
  <li><span className="icon check"><FaCheckCircle /></span> XXXXXXXXXXXXXXX</li>
  <li><span className="icon check"><FaCheckCircle /></span> XXXXXXXXXXXXXXX</li>
  <li><span className="icon check"><FaCheckCircle /></span> XXXXXXXXXXXXXXX</li>
</ul>
    </div>

    {/* PLANO ESSENCIAL */}
    <div className="plano-card">
      <h3>Plano Essencial</h3>
      <p className="descricao">XXXXXXXXXX</p>
      <p className="preco"><b>R$ 159,00</b></p>
      <button className="plano-btn">Contratar</button>
<ul>
  <li><span className="icon check"><FaCheckCircle /></span> XXXXXXXXXXXXXXX</li>
  <li><span className="icon check"><FaCheckCircle /></span> XXXXXXXXXXXXXXX</li>
  <li><span className="icon check"><FaCheckCircle /></span> XXXXXXXXXXXXXXX</li>
  <li><span className="icon cross"><FaTimesCircle /></span> XXXXXXXXXXXXXXX</li>
  <li><span className="icon cross"><FaTimesCircle /></span> XXXXXXXXXXXXXXX</li>
</ul>
    </div>

    {/* PLANO BÁSICO */}
    <div className="plano-card">
      <h3>Plano Básico</h3>
      <p className="descricao">XXXXXXXXXX</p>
      <p className="preco"><b>R$ 120,00</b></p>
      <button className="plano-btn">Contratar</button>
<ul>
  <li><span className="icon check"><FaCheckCircle /></span> XXXXXXXXXXXXXXX</li>
  <li><span className="icon check"><FaCheckCircle /></span> XXXXXXXXXXXXXXX</li>
  <li><span className="icon check"><FaCheckCircle /></span> XXXXXXXXXXXXXXX</li>
  <li><span className="icon cross"><FaTimesCircle /></span> XXXXXXXXXXXXXXX</li>
  <li><span className="icon cross"><FaTimesCircle /></span> XXXXXXXXXXXXXXX</li>
</ul>
    </div>
  </div>
</section>

 <section className="products-section">
       <h2 className="section-title">Destaques da Loja</h2>
       <div className="cards-container">
         <div className="product-card">
           <img src={produto1} alt="Produto 1" />
           <h3>Produto 1</h3>
           <p>R$ 199,90</p>
           <div className="botoes-produto">
             <button className="buy-button">Comprar</button>
             <button className="detalhes-button">Detalhes</button>
           </div>
         </div>
         <div className="product-card">
           <img src={produto2} alt="Produto 2" />
           <h3>Produto 2</h3>
           <p>R$ 299,90</p>
           <div className="botoes-produto">
             <button className="buy-button">Comprar</button>
             <button className="detalhes-button">Detalhes</button>
           </div>
         </div>
         <div className="product-card">
           <img src={produto3} alt="Produto 3" />
           <h3>Produto 3</h3>
           <p>R$ 399,90</p>
           <div className="botoes-produto">
             <button className="buy-button">Comprar</button>
             <button className="detalhes-button">Detalhes</button>
           </div>
         </div>
       </div>
     </section>

    

    <Footer />
    </>
  );
};

export default Planos;
