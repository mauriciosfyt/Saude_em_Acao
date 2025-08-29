import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import './EditarPersonal.css';

import AdminHeader from '../../../components/header_admin';
import Footer from "../../../components/footer";

const EditarPersonal = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Pegar dados via state (se vierem) ou via localStorage (fallback)
  const personalDoState = location.state?.personal;

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    numero: '',
    senha: '',
    confirmarSenha: ''
  });

  useEffect(() => {
    let dados = personalDoState;
    if (!dados) {
      const salvo = localStorage.getItem('personalParaEditar');
      if (salvo) dados = JSON.parse(salvo);
    }

    if (dados) {
      setFormData({
        nome: dados.nome || '',
        email: dados.email || '',
        cpf: dados.cpf || '',
        numero: dados.numero || '',
        senha: '',
        confirmarSenha: ''
      });
    } else {
      alert('Dados do personal não encontrados.');
      navigate('/GerenciarPersonal');
    }
  }, [personalDoState, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nome || !formData.email || !formData.cpf || !formData.numero) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Validar senha somente se for alterar
    if (formData.senha || formData.confirmarSenha) {
      if (formData.senha !== formData.confirmarSenha) {
        alert('As senhas não coincidem.');
        return;
      }
      if (formData.senha.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres.');
        return;
      }
    }

    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(formData.cpf)) {
      alert('Por favor, insira um CPF válido no formato 000.000.000-00');
      return;
    }

    // Atualizar lista no localStorage
    const personalParaEditar = JSON.parse(localStorage.getItem('personalParaEditar') || 'null') || personalDoState;
    if (!personalParaEditar?.id) {
      alert('Personal inválido.');
      return;
    }

    const listaAtual = JSON.parse(localStorage.getItem('personal') || '[]');
    const listaAtualizada = listaAtual.map(p => {
      if (p.id === personalParaEditar.id) {
        return {
          ...p,
          nome: formData.nome,
          email: formData.email,
          cpf: formData.cpf,
          numero: formData.numero,
          ...(formData.senha && { senha: formData.senha })
        };
      }
      return p;
    });

    localStorage.setItem('personal', JSON.stringify(listaAtualizada));
    localStorage.removeItem('personalParaEditar');

    alert('Personal atualizado com sucesso!');
    navigate('/GerenciarPersonal');
  };

  const handleCancelar = () => {
    localStorage.removeItem('personalParaEditar');
    navigate('/GerenciarPersonal');
  };

  return (
    <>
      <AdminHeader />
      <div className="editar-personal-container">
        <main className="editar-personal-content">
          <h1>Editar Personal</h1>

          <form onSubmit={handleSubmit} className="form-personal">
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
              <label htmlFor="senha">Nova Senha (opcional)</label>
              <input
                type="password"
                id="senha"
                name="senha"
                value={formData.senha}
                onChange={handleInputChange}
                placeholder="Digite a nova senha"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmarSenha">Confirmar Nova Senha</label>
              <input
                type="password"
                id="confirmarSenha"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleInputChange}
                placeholder="Confirme a nova senha"
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancelar" onClick={handleCancelar}>
                <FaArrowLeft size={14} /> CANCELAR
              </button>
              <button type="submit" className="btn-salvar">
                <FaSave size={14} /> SALVAR ALTERAÇÕES
              </button>
            </div>
          </form>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default EditarPersonal;
