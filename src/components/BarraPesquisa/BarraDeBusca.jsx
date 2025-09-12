import React from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';

// Este componente agora não tem mais um import de CSS.
// Ele espera que as classes CSS sejam fornecidas pela página que o utiliza.
const BarraDeBusca = ({ valorBusca, aoAlterarValor, aoClicarFiltro, placeholder = 'Buscar' }) => {
  return (
    <div className="barra-busca-container">
      <FiSearch className="barra-busca-icone" size={20} />
      <input
        type="text"
        className="barra-busca-input"
        placeholder={placeholder}
        value={valorBusca}
        onChange={(e) => aoAlterarValor(e.target.value)}
      />
      <button onClick={aoClicarFiltro} className="barra-busca-botao-filtro" aria-label="Abrir filtros">
        <FiFilter className="barra-busca-icone" size={22} />
      </button>
    </div>
  );
};

export default BarraDeBusca;