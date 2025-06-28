import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './home.css';
import './CriarRelatorioPage.css';

function CriarRelatorioAI() {
    const navigate = useNavigate();
    const { id } = useParams(); // pega o ID da vistoria
    const [form, setForm] = useState({
        idVistoriador: "",
        idVistoria: id || "", // adiciona o ID da vistoria
        nomeVistoriador: "",
        localizacao: "",
        dataVistoria: "",
        estadoConservacaoEstrutura: "",
        estadoConservacaoPintura: "",
        estadoInstalacaoEletrica: "",
        estadoInstalacaoHidraulica: "",
        estadoTelhado: "",
        estadoPiso: "",
        segurancaPortasJanelas: false,
        funcionamentoSistemaAlarme: false,
        presencaPragas: false,
        presencaInfiltracoes: false,
        observacoesGerais: ""
    });

    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        const hoje = new Date().toISOString().split("T")[0];
        setForm((prev) => ({ ...prev, dataVistoria: hoje }));
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem("Gerando relatório...");

        const response = await fetch("http://localhost:3001/api/relatorio/gerar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await response.json();
        if (data.arquivo) {
            navigate(`/vistoriador/vistoria/${form.idVistoria}`, {
                state: { relatorio: data.arquivo },
            });
        } else {
            setMensagem("Erro ao gerar relatório");
        }
    };

    const opcoesEstado = ["Péssimo", "Ruim", "Razoável", "Bom", "Excelente"];

    return (
        <div className="home-container">
            <header className="navbar">
                <div className="logo">CIVIS (Vistoriador)</div>
                <nav className="nav-links">
                    <a href="#" onClick={() => navigate("/home")}>Home</a>
                    <a href="#" onClick={() => navigate("/vistoriador/criar-relatorio")}>Criar Relatório</a>
                </nav>
                <button className="logout-button" onClick={() => navigate("/login")}>
                    Sair
                </button>
            </header>

            <main className="relatorio-page-container">
                <h2 className="relatorio-header">Gerar Relatório Técnico</h2>

                <form onSubmit={handleSubmit} className="relatorio-form-container">
                    {/* Campos do formulário */}
                    <div className="form-group">
                        <label htmlFor="nomeVistoriador">Nome do Vistoriador:</label>
                        <input
                            type="text"
                            id="nomeVistoriador"
                            name="nomeVistoriador"
                            value={form.nomeVistoriador}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="localizacao">Localização do Imóvel:</label>
                        <input
                            type="text"
                            id="localizacao"
                            name="localizacao"
                            value={form.localizacao}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="dataVistoria">Data da Vistoria:</label>
                        <input
                            type="date"
                            id="dataVistoria"
                            name="dataVistoria"
                            value={form.dataVistoria}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {[
                        "Estrutura",
                        "Pintura",
                        "InstalacaoEletrica",
                        "InstalacaoHidraulica",
                        "Telhado",
                        "Piso"
                    ].map((campo) => (
                        <div className="form-group" key={`estadoConservacao${campo}`}>
                            <label htmlFor={`estadoConservacao${campo}`}>
                                Estado de Conservação - {campo.replace(/([A-Z])/g, " $1")}:
                            </label>
                            <select
                                id={`estadoConservacao${campo}`}
                                name={`estadoConservacao${campo}`}
                                value={form[`estadoConservacao${campo}`]}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecione</option>
                                {opcoesEstado.map((opcao) => (
                                    <option key={opcao} value={opcao}>
                                        {opcao}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}

                    {[
                        ["segurancaPortasJanelas", "Segurança de Portas e Janelas"],
                        ["funcionamentoSistemaAlarme", "Funcionamento do Sistema de Alarme"],
                        ["presencaPragas", "Presença de Pragas"],
                        ["presencaInfiltracoes", "Presença de Infiltrações"]
                    ].map(([name, label]) => (
                        <div className="form-group checkbox-group" key={name}>
                            <input
                                type="checkbox"
                                id={name}
                                name={name}
                                checked={form[name]}
                                onChange={handleChange}
                            />
                            <label htmlFor={name}>{label}</label>
                        </div>
                    ))}

                    <div className="form-group">
                        <label htmlFor="observacoesGerais">Observações Gerais:</label>
                        <textarea
                            id="observacoesGerais"
                            name="observacoesGerais"
                            value={form.observacoesGerais}
                            onChange={handleChange}
                            rows={4}
                        />
                    </div>

                    <div className="form-actions" style={{ justifyContent: 'center' }}>
                        <button type="submit" className="submit-button">Gerar Relatório</button>
                    </div>
                </form>
                <p className="relatorio-message">{mensagem}</p>
            </main>
        </div>
    );
}

export default CriarRelatorioAI;
