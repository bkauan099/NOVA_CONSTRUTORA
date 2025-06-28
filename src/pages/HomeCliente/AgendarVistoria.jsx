import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeCliente.css'; 

function AgendarVistoria() {
  const navigate = useNavigate();
  const [imovelSelecionado, setImovelSelecionado] = useState('');
  const [dataDesejada, setDataDesejada] = useState('');
  const [imoveisDisponiveis, setImoveisDisponiveis] = useState([]);

  useEffect(() => {
    const fetchImoveis = async () => {
      const idCliente = localStorage.getItem("idcliente");
      if (!idCliente) {
        alert("Cliente não identificado. Faça login novamente.");
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(`http://localhost:3001/api/imoveis/cliente/${idCliente}/disponiveis`);
        if (!res.ok) throw new Error("Erro ao buscar imóveis");
        const data = await res.json();
        setImoveisDisponiveis(data);
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar imóveis.");
      }
    };

    fetchImoveis();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imovelSelecionado || !dataDesejada) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/imoveis/agendar/${imovelSelecionado}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          dataagendada: dataDesejada
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao agendar vistoria");
      }

      alert("Sua solicitação de vistoria foi enviada com sucesso!");
      navigate('/home-cliente');  // Redireciona para a home do cliente
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="home-container">
      <header className="navbar">
        <div className="logo">CIVIS</div>
        <nav className="nav-links">
          <a href="#" onClick={() => navigate("/home-cliente")}>Home</a>
          <a href="#" onClick={() => navigate("/agendar-vistoria")}>Agendar Vistoria</a>
          <a href="#" onClick={() => navigate("/minhas-vistorias")}>Minhas Vistorias</a>
          <a href="#" onClick={() => navigate("/meus-imoveis")}>Meus Imóveis</a>
        </nav>
        <button className="logout-button" onClick={() => navigate("/login")}>
          Sair
        </button>
      </header>

      <main className="main-content" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <button className="back-arrow" onClick={() => navigate("/home-cliente")} style={{ marginBottom: '20px', marginLeft: '20px' }}>
          &#8592; Voltar
        </button>
        <h1 style={{ color: '#001f3f', marginBottom: '30px', marginLeft: '20px' }}>Agendar Nova Vistoria</h1>

        <form onSubmit={handleSubmit} className="login-form" style={{ width: '80%', maxWidth: '500px', marginLeft: '20px', padding: '30px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
          <label htmlFor="imovel">Selecione o Imóvel:</label>
          <select
            id="imovel"
            value={imovelSelecionado}
            onChange={(e) => setImovelSelecionado(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '15px' }}
          >
            <option value="">-- Selecione um imóvel --</option>
            {imoveisDisponiveis.map(imovel => (
              <option key={imovel.idimovel} value={imovel.idimovel}>
                {imovel.descricao || `${imovel.nomeempreendimento} - Bloco ${imovel.bloco}, Nº ${imovel.numero}`}
              </option>
            ))}
          </select>

          <label htmlFor="data">Data Desejada:</label>
          <input
            type="date"
            id="data"
            value={dataDesejada}
            onChange={(e) => setDataDesejada(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '15px' }}
          />

          <button type="submit" className="login-button">
            Solicitar Vistoria
          </button>
        </form>
      </main>
    </div>
  );
}

export default AgendarVistoria;
