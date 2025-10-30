import { Link } from "react-router-dom"; 
import './Loja.css';

import banner from "../../assets/banners/banner_loja.png";
import esporte from "../../assets/banners/banner_esport.jpg";
import bike from "../../assets/banners/banner_bike.jpg";
import circuito from "../../assets/banners/banner_circuito.jpg";
import musculacao from "../../assets/banners/banner_musculacao.webp";
import corrida from "../../assets/banners/banner_corrida.jpg";
import iconeCamisa from "../../assets/icones/Camisa.png";
import iconePote from "../../assets/icones/Vitamina.png";
import iconeWhey from "../../assets/icones/Whey protain.png";
import iconeEnergia from "../../assets/icones/Pré-Treino.png";
import Footer from '../../components/footer';
import Header_nLogin from '../../components/header_loja_nLogin';
import Header_Login from '../../components/header_loja';
import { useAuth } from '../../contexts/AuthContext';

import ProdutosSection from "../../components/produtos";

const sportsData = [
  { id: 'main', title: 'Qual seu esporte?', imageUrl: esporte, size: 'large', link: '/SobreNosLoja' },
  { id: 'bike', title: 'Bike', imageUrl: bike, size: 'small', link: '/CategoriaCamisa', categoriaTitle: 'Camisetas de Alta Performance para Ciclismo' },
  { id: 'intense', title: 'Circuito intenso', imageUrl: circuito, size: 'small', link: '/CategoriaWhey', categoriaTitle: 'Whey Protein para Recuperação Pós-Treino Intenso' },
  { id: 'bodybuilding', title: 'Musculação', imageUrl: musculacao, size: 'small', link: '/CategoriaVitaminas', categoriaTitle: 'Vitaminas e Suplementos para Aumento de Performance Muscular' },
 { id: 'running', title: 'Corrida', imageUrl: corrida, size: 'small', link: '/CategoriaCreatina', categoriaTitle: 'Creatina para Aumento de Energia e Desempenho' },
];


const Loja = () => {
  const { isAuthenticated, loading } = useAuth();
  const categorias = [
    { icon: iconeCamisa, link: "/CategoriaCamisa" },
    { icon: iconePote, link: "/CategoriaVitaminas" },
    { icon: iconeWhey, link: "/CategoriaWhey" },
    { icon: iconeEnergia, link: "/CategoriaCreatina" },
  ];

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="banner-gradient-loja">
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
    <>
      {isAuthenticated ? <Header_Login /> : <Header_nLogin />}

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

        <div className="app-container">
      <div className="gridContainer">
        {/* Usamos .map para percorrer os dados e renderizar cada card diretamente */}
        {sportsData.map(sport => {
          // Determinamos as classes CSS com base no tamanho do card
          const cardClasses = `card ${sport.size === 'large' ? 'largeCard' : 'smallCard'}`;
          // Se houver link, aplicamos o estilo e a classe diretamente ao Link
          if (sport.link) {
            return (
              <Link
                key={sport.id}
                to={sport.link}
                state={{ categoriaTitle: sport.categoriaTitle }}
                className={`${cardClasses} card-link`}
                style={{ backgroundImage: `url(${sport.imageUrl})` }}
              >
                {sport.size === 'large' ? (
                  <h1 className="largeTitle">{sport.title}</h1>
                ) : (
                  <div className="smallTitleWrapper">
                    <span className="smallTitle">{sport.title}</span>
                  </div>
                )}
              </Link>
            );
          }

          // Caso não seja clicável, renderizamos como antes
          return (
            <div 
              key={sport.id} 
              className={cardClasses} 
              style={{ backgroundImage: `url(${sport.imageUrl})` }}
            >
              {sport.size === 'large' ? (
                <h1 className="largeTitle">{sport.title}</h1>
              ) : (
                <div className="smallTitleWrapper">
                  <span className="smallTitle">{sport.title}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>

      <Footer />
    </>
  );
};

export default Loja;
