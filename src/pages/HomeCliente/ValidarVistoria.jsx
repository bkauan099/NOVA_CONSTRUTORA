import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeCliente.css';

function ValidarVistoria() {
  const navigate = useNavigate();
  const [imovelSelecionado, setImovelSelecionado] = useState('');
  const [relatorioUrl, setRelatorioUrl] = useState('');
  const [imoveisPendentes, setImoveisPendentes] = useState([]);

  useEffect(() => {
    const fetchImoveisPendentes = async () => {
      const idcliente = localStorage.getItem('idcliente');
      if (!idcliente) {
        alert('Cliente não logado.');
        return;
      }

      try {
        const res = await fetch(`http://localhost:3001/api/imoveis/cliente/${idcliente}/pendentes-validacao`);
        if (!res.ok) throw new Error('Erro ao buscar imóveis pendentes de validação');
        const data = await res.json();
        setImoveisPendentes(data);
      } catch (err) {
        console.error(err);
        alert('Erro ao carregar imóveis pendentes.');
      }
    };

    fetchImoveisPendentes();
  }, []);

  const handleSelectChange = (e) => {
    const idSelecionado = e.target.value;
    setImovelSelecionado(idSelecionado);
    const imovel = imoveisPendentes.find(i => i.idimovel === Number(idSelecionado));
    setRelatorioUrl(imovel?.relatorio_url || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imovelSelecionado) {
      alert('Por favor, selecione um imóvel para validar.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/imoveis/validar/${imovelSelecionado}`, {
        method: 'PUT',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erro ao validar vistoria');
      }

      alert('Vistoria validada com sucesso!');
      navigate('/home-funcionario');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="home-container">
      <header className="navbar">
        <div className="logo">CIVIS</div>
        <nav className="nav-links">
          <a href="#" onClick={() => navigate("/home-funcionario")}>Home</a>
          <a href="#" onClick={() => navigate("/validar-vistoria")}>Validar Vistoria</a>
        </nav>
        <button className="logout-button" onClick={() => navigate("/login")}>
          Sair
        </button>
      </header>

      <main className="main-content" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <button className="back-arrow" onClick={() => navigate("/home-funcionario")} style={{ marginBottom: '20px', marginLeft: '20px' }}>
          &#8592; Voltar
        </button>
        <h1 style={{ color: '#001f3f', marginBottom: '30px', marginLeft: '20px' }}>Validar Vistoria</h1>

        <form onSubmit={handleSubmit} className="login-form" style={{ width: '80%', maxWidth: '500px', marginLeft: '20px', padding: '30px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
          <label htmlFor="imovel">Selecione o Imóvel:</label>
          <select
            id="imovel"
            value={imovelSelecionado}
            onChange={handleSelectChange}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '15px' }}
          >
            <option value="">-- Selecione um imóvel --</option>
            {imoveisPendentes.map(imovel => (
              <option key={imovel.idimovel} value={imovel.idimovel}>
                {imovel.descricao || `${imovel.nomeempreendimento} - Bloco ${imovel.bloco}, Nº ${imovel.numero}`}
              </option>
            ))}
          </select>

          {relatorioUrl && (
            <div style={{ marginBottom: '15px' }}>
              <a
                href={relatorioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="login-button"
                style={{
                  backgroundColor: '#007bff',
                  textDecoration: 'none',
                  color: 'white',
                  display: 'inline-block',
                  padding: '10px 20px',
                  borderRadius: '5px'
                }}
              >
                Visualizar PDF
              </a>
            </div>
          )}

          <button type="submit" className="login-button">
            Validar Vistoria
          </button>
        </form>
      </main>
    </div>
  );
}

export default ValidarVistoria;
