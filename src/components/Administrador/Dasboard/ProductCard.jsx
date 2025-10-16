import React from 'react';
import { FaTshirt, FaBolt, FaFlask, FaPills, FaWineBottle, FaDumbbell, FaHeartbeat } from 'react-icons/fa';
import './ProductCard.css';

const ProductCard = ({ nome, preco, tipo, imagem }) => {
  const getIcon = (tipo) => {
    switch (tipo) {
      case 'tshirt':
        return <FaTshirt />;
      case 'supplement':
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FaBolt />
          </div>
        );
      case 'whey':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FaFlask />
            <FaWineBottle />
          </div>
        );
      case 'pills':
        return <FaPills />;
      default:
        return <FaTshirt />;
    }
  };

  const getIconColor = (tipo) => {
    switch (tipo) {
      case 'tshirt':
        return '#27ae60'; // Verde para camiseta
      case 'supplement':
        return '#f39c12'; // Laranja/Amarelo para suplemento
      case 'whey':
        return '#9b59b6'; // Roxo para whey
      case 'pills':
        return '#27ae60'; // Verde para pílulas
      default:
        return '#27ae60';
    }
  };

  return (
    <div className="product-card-adm">
      <div className="product-header">
        <h4 className="product-name">{nome}</h4>
      </div>
      <div className="product-content">
        <div className="product-icon" style={{ backgroundColor: getIconColor(tipo) }}>
          {imagem ? (
            <img 
              src={imagem} 
              alt={nome} 
              className="product-image"
              onError={(e) => {
                // Se a imagem falhar ao carregar, mostra o ícone padrão
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="fallback-icon" style={{ display: imagem ? 'none' : 'flex' }}>
            {getIcon(tipo)}
          </div>
        </div>
        <div className="product-info">
          <span className="product-price">{preco}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
