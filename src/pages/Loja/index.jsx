import { Link } from "react-router-dom"; 
import './Loja.css';

import banner from "../../assets/banners/banner_loja.png";
import iconeCamisa from "../../assets/icones/Camisa.png";
import iconePote from "../../assets/icones/Vitamina.png";
import iconeWhey from "../../assets/icones/Whey protain.png";
import iconeEnergia from "../../assets/icones/Pré-Treino.png";
import Footer from '../../components/footer';
import Header_nLogin from '../../components/header_loja_nLogin';

import ProdutosSection from "../../components/produtos";

const sportsData = [
  { id: 'main', title: 'Qual seu esporte?', imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNjAzNTV8MHwxfGFsbHx8fHx8fHx8fDE3Mjk2ODIzMDN8&ixlib=rb-4.0.3&q=80&w=1080', size: 'large' },
  { id: 'bike', title: 'Bike', imageUrl: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNjAzNTV8MHwxfGFsbHx8fHx8fHx8fDE3Mjk2ODIzMDd8&ixlib=rb-4.0.3&q=80&w=1080', size: 'small' },
  { id: 'intense', title: 'Circuito intenso', imageUrl: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNjAzNTV8MHwxfGFsbHx8fHx8fHx8fDE3Mjk2ODIzMTB8&ixlib=rb-4.0.3&q=80&w=1080', size: 'small' },
  { id: 'bodybuilding', title: 'Musculação', imageUrl: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNjAzNTV8MHwxfGFsbHx8fHx8fHx8fDE3Mjk2ODIzMTN8&ixlib=rb-4.0.3&q=80&w=1080', size: 'small' },
 { id: 'running', title: 'Corrida', imageUrl: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNjAzNTV8MHwxfGFsbHx8fHx8fHx8fDE3Mjk2ODIzMTN8&ixlib=rb-4.0.3&q=80&w=1080', size: 'small' },
];


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

        <div className="app-container">
      <div className="gridContainer">
        {/* Usamos .map para percorrer os dados e renderizar cada card diretamente */}
        {sportsData.map(sport => {
          // Determinamos as classes CSS com base no tamanho do card
          const cardClasses = `card ${sport.size === 'large' ? 'largeCard' : 'smallCard'}`;

          return (
            <div 
              key={sport.id} 
              className={cardClasses} 
              style={{ backgroundImage: `url(${sport.imageUrl})` }}
            >
              {/* Renderização condicional para o título grande ou pequeno */}
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
