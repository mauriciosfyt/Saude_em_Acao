import { Link } from "react-router-dom"; 
import './Loja.css';

import banner from "../../assets/banners/banner_loja.jpeg";
import iconeCamisa from "../../assets/icones/Camisa.png";
import iconePote from "../../assets/icones/Vitamina.png";
import iconeWhey from "../../assets/icones/Whey protain.png";
import iconeEnergia from "../../assets/icones/Pré-Treino.png";
import Footer from '../../components/footer';
import Header_nLogin from '../../components/header_loja_nLogin';

import ProdutosSection from "../../components/produtos";

const Loja = () => {
  const categorias = [
    { icon: iconeCamisa, link: "/CategoriaCamisa" },
    { icon: iconePote, link: "/CategoriaVitaminas" },
    { icon: iconeWhey, link: "/CategoriaWhey" },
    { icon: iconeEnergia, link: "/CategoriaCreatina" },
  ];

  return (
    <>
      <Header_nLogin />

      <div className="banner-gradient-loja">
        <section className="banner">
          <img src={banner} alt="Banner" />
        </section>

        <section className="categorias-section">
          <h2 className="categorias-title">Categorias</h2>
          <div className="categorias-grid">
            {categorias.map((item, idx) => (
              <Link to={item.link} key={idx} className="categoria-grid-item">
                <div className="categoria-icon">
                  <img src={item.icon} alt={item.label} />
                </div>
                <p>{item.label}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <ProdutosSection />

      <Footer />
    </>
  );
};

export default Loja;
