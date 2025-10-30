import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduto } from '../../../services/produtoService';
import { useAuth } from '../../../contexts/AuthContext'; // Importar contexto de auth

// Componentes
import MenuAdm from '../../../components/MenuAdm/MenuAdm';
import FormularioProduto from '../../../components/Administrador/AdicionarProduto/FormularioProduto';

// Estilo
import './CadastroProduto.css';

const AdicionarProduto = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Usar o contexto de autenticação

  // Função que lida com a submissão dos dados recebidos do formulário filho
  const handleCreateProduto = async (formData) => {
    try {
      console.log('🔄 Iniciando criação do produto...');
      await createProduto(formData); 
      console.log('✅ Produto criado com sucesso!');
      localStorage.setItem('showProdutoAdicionado', 'true');
      navigate('/GerenciarProduto');
    } catch (error) {
      console.error('❌ Erro ao criar produto:', error);
      alert(`Ocorreu um erro ao criar o produto: ${error.message}`);
    }
  };

  // Função para o botão de cancelar
  const handleCancelar = () => {
    navigate('/GerenciarProduto');
  };

  return (
    <div style={{ display: 'flex' }}>
      <MenuAdm />
      <main className="adicionar-produto-container">
        <h1 className="produto-main-title">Adicionar Produto</h1>

        {/* Renderiza o componente de formulário e passa as funções de controle como props */}
        <FormularioProduto 
          onFormSubmit={handleCreateProduto}
          onCancel={handleCancelar}
        />

      </main>
    </div>
  );
};

export default AdicionarProduto;