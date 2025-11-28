import React from 'react';
import { FaTshirt, FaBolt, FaFlask, FaPills, FaWineBottle, FaDumbbell, FaHeartbeat } from 'react-icons/fa';
import './ProductCard.css';

const ProductCard = ({ nome, preco, tipo, imagem, total }) => {
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
        return '#C2E541'; // Camisa: C2E541
      case 'supplement':
        return '#FEBF01'; // Creatina: FEBF01
      case 'whey':
        return '#5F77AF'; // Whey protein: 5F77AF
      case 'pills':
        return '#41E5E5'; // Vitaminas: 41E5E5
      default:
        return '#C2E541';
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
          {total != null ? (
            <span className="product-price">Total: {Number(total).toLocaleString('pt-BR')}</span>
          ) : (
            <span className="product-price">{preco}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
