import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Adicione essa linha
import { FaSave, FaTimes } from 'react-icons/fa';
import './AdicionarPersonal.css';

import AdminHeader from '../../../components/header_admin';
import Footer from "../../../components/footer";

const AdicionarPersonal = () => {
  const navigate = useNavigate(); // Adicione essa linha
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    numero: '',
    senha: '',
    confirmarSenha: '',
  });
  const [showToast, setShowToast] = useState(false); // Adicione essa linha

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.nome || !formData.email || !formData.cpf || !formData.senha || !formData.numero) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    if (formData.senha.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    // Validação básica de CPF (formato)
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(formData.cpf)) {
      alert('Por favor, insira um CPF válido no formato 000.000.000-00');
      return;
    }

    // Salvar o novo personal no localStorage
    const personalAtuais = JSON.parse(localStorage.getItem('personal') || '[]');
    const novoPersonal = {
      id: Date.now(), // Gerar ID único
      ...formData
    };
    const personalAtualizados = [...personalAtuais, novoPersonal];
    localStorage.setItem('personal', JSON.stringify(personalAtualizados));

    // Seta a flag para mostrar notificação na próxima tela
    localStorage.setItem('showPersonalAdicionado', 'true');

    // Limpar formulário
    setFormData({
      nome: '',
      email: '',
      cpf: '',
      numero: '',
      senha: '',
      confirmarSenha: '',
    });

    // Redireciona imediatamente
    navigate('/GerenciarPersonal'); // Altere para a rota desejada
  };

  const handleCancelar = () => {
    navigate('/GerenciarPersonal'); // Altere para a rota desejada
  };

  return (
    <>
     <AdminHeader />
    <div className="adicionar-container">
      <main className="adicionar-content">
        <h1>Adicionar Novo Personal</h1>
        {/*
        {showToast && (
          <div className="modal-termos-notification">
            Personal adicionado com sucesso!
          </div>
        )}
        */}
        <form className="adicionar-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            
            <div className="form-group">
              <label htmlFor="nome">Nome Completo</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex: Dr. João Silva"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ex: joao.silva@uni.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cpf">CPF</label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="numero">Número (Celular)</label>
              <input
                type="text"
                id="numero"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                placeholder="Ex: (11) 99988-7766"
                required
              />
            </div>
            
            {/* O Bloco do campo "Status" foi completamente removido daqui */}
            
            <div className="form-group">
              <label htmlFor="senha">Senha</label>
              <input
                type="password"
                id="senha"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmarSenha">Confirmar Senha</label>
              <input
                type="password"
                id="confirmarSenha"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            {/* Para manter o alinhamento no grid de duas colunas, 
                você pode adicionar um campo extra aqui ou deixar o espaço. 
                Deixaremos o espaço por enquanto para simplicidade. */}

          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancelar" onClick={handleCancelar}>
              <FaTimes /> Cancelar
            </button>
            <button type="submit" className="btn-salvar">
              <FaSave /> Salvar
            </button>
          </div>
        </form>
      </main>
    </div>
    <Footer />
    </>
  );
};

export default AdicionarPersonal;