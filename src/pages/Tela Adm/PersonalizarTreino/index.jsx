import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminHeader from '../../../components/header_admin';
import Footer from '../../../components/footer';
import './personalizarTreino.css';

const PersonalizarTreino = () => {
  const [searchParams] = useSearchParams();
  const dia = searchParams.get('dia') || 'Dia';
  const alunoId = searchParams.get('alunoId') || '';

  // --- Lógica para definir os grupos do dia ---
  const normalize = (s) => (s || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'').replace(/[^a-z]/g,'');
  const diaKey = normalize(dia);
  const gruposPorDia = {
    [normalize('SEGUNDA-FEIRA')]: ['Peito', 'Tríceps'],
    [normalize('TERÇA-FEIRA')]: ['Costas', 'Bíceps'],
    [normalize('QUARTA-FEIRA')]: ['Perna'],
    [normalize('QUINTA-FEIRA')]: ['Cardio', 'Ombro'],
    [normalize('SEXTA-FEIRA')]: ['Costas', 'Abdomen'],
  };
  const grupos = gruposPorDia[diaKey] || ['Grupo'];

  // --- Estado para controlar os exercícios de cada grupo ---
  const [exercicios, setExercicios] = useState(
    // Inicializa o estado com um objeto onde cada grupo é uma chave com um array vazio
    grupos.reduce((acc, grupo) => {
      acc[grupo] = [];
      return acc;
    }, {})
  );

  // --- Estados do Modal e do Formulário ---
  const [modalAberto, setModalAberto] = useState(false);
  const [grupoSelecionado, setGrupoSelecionado] = useState('');
  const inputArquivoRef = useRef(null);

  // Estados para os campos do formulário
  const [nomeExercicio, setNomeExercicio] = useState('');
  const [series, setSeries] = useState('4');
  const [repeticoes, setRepeticoes] = useState('12');
  const [carga, setCarga] = useState('15 kg');
  const [previaImagem, setPreviaImagem] = useState(null);
  const [nomeArquivo, setNomeArquivo] = useState('');

  const limparFormulario = () => {
    setNomeExercicio('');
    setSeries('4');
    setRepeticoes('12');
    setCarga('15 kg');
    setPreviaImagem(null);
    setNomeArquivo('');
    if (inputArquivoRef.current) {
      inputArquivoRef.current.value = null;
    }
  };

  const abrirModal = (grupo) => {
    setGrupoSelecionado(grupo);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    limparFormulario(); // Limpa o formulário sempre que o modal for fechado
  };

  const aoMudarImagem = (e) => {
    const arquivo = e.target.files && e.target.files[0];
    if (arquivo && arquivo.type.startsWith('image/')) {
      const leitor = new FileReader();
      leitor.onloadend = () => setPreviaImagem(leitor.result);
      leitor.readAsDataURL(arquivo);
      setNomeArquivo(arquivo.name);
    }
  };

  const handleAdicionarExercicio = (e) => {
    e.preventDefault();

    if (!nomeExercicio) {
      alert('Por favor, preencha o nome do exercício.');
      return;
    }

    const novoExercicio = {
      id: Date.now(), // ID único baseado no tempo atual
      nome: nomeExercicio,
      series,
      repeticoes,
      carga,
      imagem: previaImagem,
    };

    // Atualiza o estado, adicionando o novo exercício ao array do grupo correto
    setExercicios(estadoAnterior => ({
      ...estadoAnterior,
      [grupoSelecionado]: [...estadoAnterior[grupoSelecionado], novoExercicio]
    }));

    fecharModal(); // Fecha o modal e limpa o formulário
  };

  return (
    <>
      <AdminHeader />
      <div className="personalizar-container">
        <h1 className="personalizar-title">{decodeURIComponent(dia)}</h1>

        <div className="painel">
          <div className="grupos-container">
            {grupos.map((grupo) => (
              <section className="grupo-card" key={grupo}>
                <header className="grupo-header-treino">
                  <div className="grupo-titulo">{grupo}</div>
                  <button className="barra-add" onClick={() => abrirModal(grupo)}>+</button>
                </header>
                <div className="exercicios-lista">
                  {/* Renderiza a lista de exercícios do estado */}
                  {(exercicios[grupo] || []).length > 0 ? (
                    exercicios[grupo].map((exercicio) => (
                      <div className="exercicio-item" key={exercicio.id}>
                        <div className="exercicio-info">
                           {/* Exibe a imagem se ela existir, senão, mostra o placeholder */}
                           {exercicio.imagem ? (
                            <img src={exercicio.imagem} alt={exercicio.nome} className="thumb" />
                          ) : (
                            <div className="thumb" />
                          )}
                          <div className="texto">
                            <strong>{exercicio.nome}</strong>
                            <div>
                              <div>Série: <b>{exercicio.series}</b></div>
                              <div>Repetição: <b>{exercicio.repeticoes}</b></div>
                              <div>Carga: <b>{exercicio.carga}</b></div>
                            </div>
                          </div>
                        </div>
                        <div className="acoes">
                          <button className="btn-amarelo">Editar</button>
                          <button className="btn-vermelho">Excluir</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{textAlign: 'center', color: '#666', padding: '20px 0'}}>Nenhum exercício adicionado.</p>
                  )}
                </div>
              </section>
            ))}
          </div>
          <div className="acoes-finais">
            <button className="btn-azul">Limpar histórico de treino</button>
            <button className="btn-verde">Salvar treino</button>
          </div>
        </div>

      </div>
      <Footer />
      {modalAberto && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-titulo">Adicionar exercício</h3>
            <form className="form-exercicio" onSubmit={handleAdicionarExercicio}>
              <label>
                <span>Classe do exercícios:</span>
                {/* O select agora é controlado pelo estado 'grupoSelecionado' */}
                <select value={grupoSelecionado} onChange={(e) => setGrupoSelecionado(e.target.value)}>
                  {grupos.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </label>

              <label>
                <span>Nome do exercício:</span>
                <input
                  type="text"
                  placeholder="Supino com halteres"
                  value={nomeExercicio}
                  onChange={(e) => setNomeExercicio(e.target.value)}
                />
              </label>

              <label>
                <span>Nº de séries:</span>
                <select value={series} onChange={(e) => setSeries(e.target.value)}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>

              <label>
                <span>Nº de repetições:</span>
                <select value={repeticoes} onChange={(e) => setRepeticoes(e.target.value)}>
                  {[6,8,10,12,15,20].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>

              <label>
                <span>Carga:</span>
                <select value={carga} onChange={(e) => setCarga(e.target.value)}>
                  {[0,5,10,12,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100].map(n => <option key={n} value={`${n} kg`}>{n} kg</option>)}
                </select>
              </label>

              <label>
                <span>Adicionar foto:</span>
                <div className="upload-area" onClick={() => inputArquivoRef.current && inputArquivoRef.current.click()}>
                  {previaImagem ? (
                    <img src={previaImagem} alt="Pré-visualização" className="previa-imagem-exercicio" />
                  ) : (
                    <button type="button" className="btn-plus">+</button>
                  )}
                </div>
                <input
                  type="file"
                  ref={inputArquivoRef}
                  onChange={aoMudarImagem}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                {nomeArquivo && <small className="nome-arquivo">{nomeArquivo}</small>}
              </label>

              <div className="modal-acoes">
                <button type="button" className="btn-cancelar" onClick={fecharModal}>Cancelar</button>
                <button type="submit" className="btn-finalizar">Adicionar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PersonalizarTreino;