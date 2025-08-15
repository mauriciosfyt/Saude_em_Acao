import React from 'react';
import { FaTrophy, FaMedal } from 'react-icons/fa';
import './TabelaProdutosVendidos.css';

const TabelaProdutosVendidos = ({ produtos }) => {
  return (
    <div className="tabela-wrapper">
      <table className="tabela-produtos">
        <thead>
          <tr>
            {/* Cabeçalhos agora com classes de alinhamento e largura */}
            <th className="align-center col-icon">#</th>
            <th>Nome</th>
            <th className="align-right col-numerica">Vendidos</th>
            <th className="align-right col-numerica">Estoque</th>
            <th className="align-right col-numerica">Reservados</th>
            <th className="align-center col-icon">Prêmios</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto, index) => (
            <tr key={produto.id}>
              {/* Células de dados também com as classes de alinhamento */}
              <td className="align-center">
                {index === 0 && <FaTrophy color="#FFD700" />}
                {index === 1 && <FaTrophy color="#C0C0C0" />}
                {index === 2 && <FaTrophy color="#CD7F32" />}
              </td>
              <td>{produto.nome}</td>
              <td className="align-right">{produto.vendidos}</td>
              <td className="align-right">{produto.estoque}</td>
              <td className="align-right">{produto.reservados}</td>
              <td className="align-center">
                {produto.vendidos > 60 && <FaMedal color="#007BFF" />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TabelaProdutosVendidos;