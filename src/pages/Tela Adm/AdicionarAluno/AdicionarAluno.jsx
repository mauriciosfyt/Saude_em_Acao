import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaArrowLeft } from 'react-icons/fa';
import './AdicionarAluno.css';

import AdminHeader from '../../../components/header_admin';
import Footer from "../../../components/footer";

const AdicionarAluno = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    senha: '',
    confirmarSenha: '',
    numero: '',
    plano: '' // Novo campo
  });
  const [showToast, setShowToast] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validações básicas
    if (!formData.nome || !formData.email || !formData.cpf || !formData.senha || !formData.numero || !formData.plano) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      alert('As senhas não coincidem.');
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

    // Salvar o novo aluno no localStorage
    const alunosAtuais = JSON.parse(localStorage.getItem('alunos') || '[]');
    const novoAluno = {
      id: Date.now(),
      ...formData
    };
    
    const alunosAtualizados = [...alunosAtuais, novoAluno];
    localStorage.setItem('alunos', JSON.stringify(alunosAtualizados));

    // Seta a flag para mostrar notificação na próxima tela
    localStorage.setItem('showAlunoAdicionado', 'true');

    // Limpar formulário
    setFormData({
      nome: '',
      email: '',
      cpf: '',
      senha: '',
      confirmarSenha: '',
      numero: '',
      plano: ''
    });

    // Redireciona imediatamente
    navigate('/GerenciarAlunos');
  };

  const handleCancelar = () => {
    navigate('/GerenciarAlunos');
  };

  return (
    <>
      <AdminHeader />
      <div className="adicionar-aluno-container">
        <main className="adicionar-aluno-content">
          <h1>Adicionar Novo Aluno</h1>
          {showToast && (
            <div className="modal-termos-notification">
              Aluno adicionado com sucesso!
            </div>
          )}
          <form onSubmit={handleSubmit} className="form-aluno">
            <div className="form-group">
              <label htmlFor="nome">Nome Completo *</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="Digite o nome completo"
                required
              />
            </div>

                         <div className="form-group">
               <label htmlFor="email">E-mail *</label>
               <input
                 type="email"
                 id="email"
                 name="email"
                 value={formData.email}
                 onChange={handleInputChange}
                 placeholder="Digite o e-mail"
                 required
               />
             </div>

             <div className="form-group">
               <label htmlFor="cpf">CPF *</label>
               <input
                 type="text"
                 id="cpf"
                 name="cpf"
                 value={formData.cpf}
                 onChange={handleInputChange}
                 placeholder="000.000.000-00"
                 required
               />
             </div>

             <div className="form-group">
               <label htmlFor="numero">Telefone *</label>
               <input
                 type="tel"
                 id="numero"
                 name="numero"
                 value={formData.numero}
                 onChange={handleInputChange}
                 placeholder="(11) 98765-4321"
                 required
               />
             </div>
            <div className="form-group">
              <label htmlFor="plano">Plano *</label>
              <select
                id="plano"
                name="plano"
                value={formData.plano}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione o plano</option>
                <option value="GOLD">GOLD</option>
                <option value="ESSENCIAL">ESSENCIAL</option>
                <option value="BÁSICO">BÁSICO</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="senha">Senha *</label>
              <input
                type="password"
                id="senha"
                name="senha"
                value={formData.senha}
                onChange={handleInputChange}
                placeholder="Digite a senha"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmarSenha">Confirmar Senha *</label>
              <input
                type="password"
                id="confirmarSenha"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleInputChange}
                placeholder="Confirme a senha"
                required
              />
            </div>


            <div className="form-actions">
              <button type="button" className="btn-cancelar" onClick={handleCancelar}>
                <FaArrowLeft size={14} /> CANCELAR
              </button>
              <button type="submit" className="btn-salvar">
                <FaPlus size={14} /> SALVAR
              </button>
            </div>
          </form>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default AdicionarAluno;
