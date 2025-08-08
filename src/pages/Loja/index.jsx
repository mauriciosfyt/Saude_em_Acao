import './Loja.css';

import banner from "../../assets/banner_loja.jpeg";
import iconeCamisa from "../../assets/icones/Camisa.png";
import iconePote from "../../assets/icones/Vitamina.png";
import iconeWhey from "../../assets/icones/Whey protain.png";
import iconeEnergia from "../../assets/icones/Pré-Treino.png";
import Footer from '../../components/footer';
import Header_nLogin from '../../components/header_loja_nLogin';

import ProdutosSection from "../../components/produtos";

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

 <ProdutosSection/>

      <Footer />
    </>
  );
};

export default Loja;