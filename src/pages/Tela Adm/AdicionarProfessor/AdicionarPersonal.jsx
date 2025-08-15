import React, { useState } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import './AdicionarPersonal.css';

import AdminHeader from '../../../components/header_admin';
import Footer from "../../../components/footer";

const AdicionarPersonal = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    numero: '',
    senha: '',
    confirmarSenha: '',
    // status: 'Ativo', <-- Removido do estado
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.senha !== formData.confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }
    console.log('Dados do formulário para salvar:', formData);
    alert(`Personal "${formData.nome}" salvo com sucesso!`);
  };

  return (
    <>
     <AdminHeader />
    <div className="adicionar-container">
      <main className="adicionar-content">
        <h1>Adicionar Novo Personal</h1>
        
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
            <button type="button" className="btn-cancelar">
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