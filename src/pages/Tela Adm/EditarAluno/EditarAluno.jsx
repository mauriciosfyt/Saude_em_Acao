import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import './EditarAluno.css';

import AdminHeader from '../../../components/header_admin';
import Footer from "../../../components/footer";

const EditarAluno = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Pegar os dados do aluno da navegação
  const alunoData = location.state?.aluno;

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    senha: '',
    confirmarSenha: '',
    numero: ''
  });

  // Carregar dados do aluno quando o componente montar
  useEffect(() => {
    // Tentar pegar dados do localStorage se não houver no state
    let dadosAluno = alunoData;
    if (!dadosAluno) {
      const alunoLocalStorage = localStorage.getItem('alunoParaEditar');
      if (alunoLocalStorage) {
        dadosAluno = JSON.parse(alunoLocalStorage);
      }
    }
    
    if (dadosAluno) {
      setFormData({
        nome: dadosAluno.nome || '',
        email: dadosAluno.email || '',
        cpf: dadosAluno.cpf || '',
        senha: '', // Não carregamos a senha por segurança
        confirmarSenha: '',
        numero: dadosAluno.numero || ''
      });
    } else {
      // Se não houver dados do aluno, redirecionar para GerenciarAlunos
      alert('Dados do aluno não encontrados.');
      navigate('/GerenciarAlunos');
    }
  }, [alunoData, navigate]);

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
    if (!formData.nome || !formData.email || !formData.cpf || !formData.numero) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Se a senha foi alterada, validar
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

    // Validação básica de CPF (formato)
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(formData.cpf)) {
      alert('Por favor, insira um CPF válido no formato 000.000.000-00');
      return;
    }

    // Pegar o ID do aluno do localStorage
    const alunoParaEditar = JSON.parse(localStorage.getItem('alunoParaEditar') || '{}');
    
    // Atualizar a lista de alunos no localStorage
    const alunosAtuais = JSON.parse(localStorage.getItem('alunos') || '[]');
    const alunosAtualizados = alunosAtuais.map(aluno => {
      if (aluno.id === alunoParaEditar.id) {
        return {
          ...aluno,
          nome: formData.nome,
          email: formData.email,
          cpf: formData.cpf,
          numero: formData.numero,
          // Só atualiza a senha se foi fornecida
          ...(formData.senha && { senha: formData.senha })
        };
      }
      return aluno;
    });
    
    localStorage.setItem('alunos', JSON.stringify(alunosAtualizados));
    
    // Limpar o localStorage temporário
    localStorage.removeItem('alunoParaEditar');
    
    // Seta a flag para mostrar notificação de edição
    localStorage.setItem('showAlunoEditado', 'true');
    
    // Navegar de volta para Gerenciar Alunos
    navigate('/GerenciarAlunos');
  };

  const handleCancelar = () => {
    // Limpar o localStorage temporário
    localStorage.removeItem('alunoParaEditar');
    navigate('/GerenciarAlunos');
  };

  // Se não há dados do aluno, não renderizar nada
  if (!alunoData) {
    const alunoLocalStorage = localStorage.getItem('alunoParaEditar');
    if (!alunoLocalStorage) {
      return null;
    }
  }

  return (
    <>
      <AdminHeader />
      <div className="editar-aluno-container">
        <main className="editar-aluno-content">
          <h1>Editar Aluno</h1>
          
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
              <label htmlFor="senha">Nova Senha (deixe em branco para manter a atual)</label>
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

export default EditarAluno;
