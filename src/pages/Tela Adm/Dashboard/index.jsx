import React, { useState } from 'react';
import './Dashboard.css';
import MenuAdm from './../../../components/MenuAdm/MenuAdm';
import TotalVendasChart from '../../../components/Administrador/Dasboard/TotalVendasChart';
import AlunosPlanosChart from '../../../components/Administrador/Dasboard/AlunosPlanosChart';
import GraficoA from '../../../components/Administrador/Dasboard/GraficoA';
import ProductCard from '../../../components/Administrador/Dasboard/ProductCard';

// Importar as imagens
import camisaImg from '../../../assets/icones/Camisa.png';
import preTreinoImg from '../../../assets/icones/Pré-Treino.png';
import wheyImg from '../../../assets/icones/Whey protain.png';
import vitaminaImg from '../../../assets/icones/vitamina.png';


const Dashboard = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('Dashboard');

  const handleMenuClick = (item) => {
    setActiveMenuItem(item);
    // Aqui você pode adicionar lógica para navegar entre páginas
    console.log('Menu item clicked:', item);
  };

  return (
    <div className="dashboard-container">
      <MenuAdm activeItem={activeMenuItem} onItemClick={handleMenuClick} />
      
      <main className="dashboard-main">
        <div className="page-grid">
          <section className="left-content">
            <div className="top-charts">
              <TotalVendasChart />
              <AlunosPlanosChart />
            </div>
            <GraficoA />
          </section>

          <aside className="products-sidebar">
            <ProductCard 
              nome="Produto A" 
              preco="R$300,00" 
              tipo="tshirt" 
              imagem={camisaImg}
            />
            <ProductCard 
              nome="Produto B" 
              preco="R$300,00" 
              tipo="supplement" 
              imagem={preTreinoImg}
            />
            <ProductCard 
              nome="Produto C" 
              preco="R$300,00" 
              tipo="whey" 
              imagem={wheyImg}
            />
            <ProductCard 
              nome="Produto D" 
              preco="R$300,00" 
              tipo="pills" 
              imagem={vitaminaImg}
            />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;