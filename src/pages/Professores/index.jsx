import React, { useEffect, useState } from "react";
import Header_nLogin from "../../components/header_nLogin";
import HeaderUser from "../../components/header";
import Footer from "../../components/footer";
import ModalLoginNecessario from "../../components/ModalLoginNecessario";
import ModalLogin from "../../components/modal_login/ModalLogin";
import ModalCodigo from "../../components/modal_login/ModalCodigo";
import ModalRecuperarSenha from "../../components/modal_login/ModalRecuperarSenha";
import ModalCodigoRecuperacao from "../../components/modal_login/ModalCodigoRecuperacao";
import ModalAlterarSenha from "../../components/modal_login/ModalAlterarSenha";
import "./Pprofs.css";
import { FaWhatsapp } from "react-icons/fa";
import banner from "../../assets/banners/banner_profs.png";
import { getAllProfessores } from "../../services/usuarioService";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Equipe() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [membros, setMembros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModalLogin, setShowModalLogin] = useState(false);
    const [modalReason, setModalReason] = useState('not_logged');
    const [showModal, setShowModal] = useState(false);
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [showRecoverModal, setShowRecoverModal] = useState(false);
    const [showRecoverCodeModal, setShowRecoverCodeModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [code, setCode] = useState(["", "", "", "", ""]);
    const [loginEmail, setLoginEmail] = useState("");
    const [recoverEmail, setRecoverEmail] = useState("");
    const [recoverToken, setRecoverToken] = useState("");

    useEffect(() => {
        const fetchProfessores = async () => {
            try {
                const data = await getAllProfessores();
                // Data pode ser um array ou um objeto com campo 'content' dependendo do backend
                const list = Array.isArray(data) ? data : (data.content || []);
                setMembros(list);
            } catch (err) {
                setError(err.message || 'Erro ao carregar professores');
            } finally {
                setLoading(false);
            }
        };
        fetchProfessores();
    }, []);

    // Verifica autenticação e mostra modal se não autenticado
    useEffect(() => {
        if (authLoading) return; // aguardando verificação de auth

        // Obtém o plano do usuário salvo em localStorage (ou sessionStorage como fallback)
        const rawPlano = localStorage.getItem('userPlano') || sessionStorage.getItem('userPlano') || '';
            const planoNormalized = String(rawPlano).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        if (!isAuthenticated) {
            setModalReason('not_logged');
            setShowModalLogin(true);
            return;
        }

        // Se o usuário está logado, mas possui plano Básico ou Essencial, mostra modal explicando plano insuficiente
            if (planoNormalized.includes('basico') || planoNormalized.includes('essencial')) {
            setModalReason('plan_insufficient');
            setShowModalLogin(true);
            return;
        }

        setShowModalLogin(false);
    }, [authLoading, isAuthenticated]);

    const handleCodeChange = (value, idx) => {
        if (value.length > 1) return;
        const sanitized = value.replace(/[^0-9a-zA-Z]/g, "").toUpperCase();
        const newCode = [...code];
        newCode[idx] = sanitized;
        setCode(newCode);
        if (sanitized && idx < 4) {
            document.getElementById(`code-input-${idx + 1}`)?.focus();
        }
    };

    const handleLogin = (emailParam) => {
        if (emailParam) setLoginEmail(emailParam);
        setShowModal(false);
        setShowCodeModal(true);
    };

    const handleRecover = (emailParam, _data) => {
        if (emailParam) setRecoverEmail(emailParam);
        setShowRecoverModal(false);
        setShowRecoverCodeModal(true);
        setCode(["", "", "", "", ""]);
    };

    const handleValidateRecoverCode = (_email, token) => {
        if (token) setRecoverToken(token);
        setShowRecoverCodeModal(false);
        setShowChangePasswordModal(true);
    };

    const closeAllModals = () => {
        setShowModal(false);
        setShowCodeModal(false);
        setShowRecoverModal(false);
        setShowRecoverCodeModal(false);
        setShowChangePasswordModal(false);
        setCode(["", "", "", ""]);
    };

    // Normaliza URLs de imagem: força https quando possível para evitar Mixed Content
    const fixImageUrl = (url) => {
        if (!url) return url;
        // Se já começa com https, devolve
        if (/^https:\/\//i.test(url)) return url;
        // Se começa com http, tenta trocar para https
        if (/^http:\/\//i.test(url)) return url.replace(/^http:\/\//i, 'https://');
        // Se for URL sem protocolo (ex: //res.cloudinary...), deixar como https://
        if (/^\/\//.test(url)) return 'https:' + url;
        return url;
    };

    // Mostra loading enquanto verifica autenticação
    if (authLoading) {
        return (
            <div className="equipe-container">
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh',
                    fontSize: '18px'
                }}>
                    Carregando...
                </div>
            </div>
        );
    }

    return (
        <div className="equipe-container">
            {isAuthenticated ? <HeaderUser /> : <Header_nLogin />}

            {showModalLogin && (
                <ModalLoginNecessario 
                    onClose={() => setShowModalLogin(false)}
                    reason={modalReason}
                />
            )}

            {showModal && (
                <ModalLogin
                    onClose={closeAllModals}
                    onLogin={handleLogin}
                    onRecover={() => {
                        setShowModal(false);
                        setShowRecoverModal(true);
                    }}
                />
            )}

            {showCodeModal && (
                <ModalCodigo
                    code={code}
                    email={loginEmail}
                    onClose={() => setShowCodeModal(false)}
                    onChange={handleCodeChange}
                />
            )}

            {showRecoverModal && (
                <ModalRecuperarSenha
                    onClose={() => setShowRecoverModal(false)}
                    onSend={handleRecover}
                />
            )}

            {showRecoverCodeModal && (
                <ModalCodigoRecuperacao
                    code={code}
                    email={recoverEmail}
                    onClose={() => setShowRecoverCodeModal(false)}
                    onChange={handleCodeChange}
                    onValidate={handleValidateRecoverCode}
                />
            )}

            {showChangePasswordModal && (
                <ModalAlterarSenha
                    onClose={() => setShowChangePasswordModal(false)}
                    token={recoverToken}
                    onChangePassword={() => {}}
                    onOpenLogin={() => {
                        setShowChangePasswordModal(false);
                        setShowModal(true);
                    }}
                />
            )}

            {/* Banner principal com gradiente igual ao Sobre Nós */}
            <main className="profs-container">
                <section className="profs-section">
                    <section className="profs-banner">
                        <img src={banner} alt="Banner Saúde em Ação" />
                    </section>
                </section>
            </main>

            {/* Onda ondulada */}
            <div className="professores-wave">
                <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path
                        fill="#D9D9D9"
                        d="M0,256L60,240C120,224,240,192,360,181.3C480,171,600,181,720,197.3C840,213,960,235,1080,229.3C1200,224,1320,192,1380,176L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                    />
                </svg>
            </div>

            {/* Lista de membros */}
            <div className="equipe-grid">
                {loading && <div style={{ padding: 40 }}>Carregando professores...</div>}
                {!loading && !error && membros.length === 0 && <div style={{ padding: 20 }}>Nenhum professor encontrado.</div>}
                {!loading && !error && membros.map((m, index) => (
                    <div className="equipe-card" key={m.id || index}>
                        <div className="equipe-foto">
                            <img src={fixImageUrl(m.fotoPerfil || m.avatar) || '/imagens/user-default.png'} alt={m.nome || m.username || 'Professor'} />
                        </div>
                        <p className="equipe-nome">{m.nome || m.username}</p>
                        <a
                            href={`https://wa.me/55${(m.telefone || m.phone || '').replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-whatsapp"
                        >
                            <FaWhatsapp /> Conversar
                        </a>
                    </div>
                ))}
            </div>

            <Footer />
        </div>
    );
}
