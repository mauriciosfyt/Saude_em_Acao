import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduto } from '../../../services/produtoService';
import { useAuth } from '../../../contexts/AuthContext'; // Importar contexto de auth

// --- IMPORTAÇÕES DO TOASTIFY ---
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../components/Mensagem/Sucesso.css'; // Importação do seu arquivo de estilo
// -------------------------------

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

      // --- IMPLEMENTAÇÃO DO SEU TOAST DE SUCESSO ---
      toast.success("Produto criado!", {
        className: "custom-success-toast", // Sua classe do CSS
        progressClassName: "Toastify__progress-bar--success",
        autoClose: 2000, // Fecha em 2 segundos (sincronizado com a navegação)
      });

      // Mantive sua lógica de localStorage
      localStorage.setItem('showProdutoAdicionado', 'true');
      
      // Adicionei um pequeno delay (setTimeout) para dar tempo do usuário LER o toast
      // A linha original 'navigate(...)' foi movida para dentro deste timeout.
      setTimeout(() => {
        navigate('/GerenciarProduto');
      }, 2000); // Aguarda 2 segundos antes de mudar de tela

    } catch (error) {
      console.error('❌ Erro ao criar produto:', error);
      
      // Toast de erro para feedback visual (substituindo o alert visualmente)
      // alert(`Ocorreu um erro ao criar o produto: ${error.message}`);
      toast.error(`Ocorreu um erro ao criar o produto: ${error.message}`);
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

        {/* Componente necessário para renderizar os alertas */}
        <ToastContainer position="top-right" />

      </main>
    </div>
  );
};

export default AdicionarProduto;