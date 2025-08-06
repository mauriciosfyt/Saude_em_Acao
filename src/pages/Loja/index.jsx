import './Loja.css';
import produto1 from "../../assets/IMG PRODUTO.jpg";
import produto2 from "../../assets/IMG PRODUTO2.jpg";
import produto3 from "../../assets/IMG PRODUTO3.jpg";
import banner from "../../assets/banner_loja.jpeg";
import iconeCamisa from "../../assets/icones/Camisa.png";
import iconePote from "../../assets/icones/Vitamina.png";
import iconeWhey from "../../assets/icones/Whey protain.png";
import iconeEnergia from "../../assets/icones/Pré-Treino.png";
import Footer from '../../components/footer';
import Header_nLogin from '../../components/header_loja_nLogin';

const Loja = () => {
  const categorias = [
    { icon: iconeCamisa, label: 'Camisetas' },
    { icon: iconePote, label: 'Suplementos' },
    { icon: iconeWhey, label: 'Whey Protein' },
    { icon: iconeEnergia, label: 'Pré-Treino' },
  ];

  return (
    <>
      <Header_nLogin />

      <div className="faixa-gradiente">
        <section className="hero-banner faixa-gradiente">
          <img src={banner} alt="Banner Saúde em Ação" className="banner-img" />
        </section>
        <section className="categorias-section">
          <h2 className="categorias-title">Categorias</h2>
          <div className="categorias-grid">
            {categorias.map((item, idx) => (
              <div key={idx} className="categoria-grid-item">
                <div className="categoria-icon">
                  <img src={item.icon} alt={item.label} />
                </div>
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

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

export default Loja;