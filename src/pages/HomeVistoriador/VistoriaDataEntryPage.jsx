import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './vistoriaDataEntryPage.css';

function VistoriaDataEntryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [vistoriaDetalhes, setVistoriaDetalhes] = useState(null);
  const [relatorioGerado, setRelatorioGerado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state?.relatorio) {
      setRelatorioGerado(location.state.relatorio);
    }

    const fetchVistoria = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/vistorias/${id}`);
        if (!res.ok) throw new Error('Erro ao buscar vistoria');

        const data = await res.json();
        setVistoriaDetalhes(data);
      } catch (err) {
        console.error('Erro ao carregar detalhes da vistoria:', err);
        alert('Erro ao carregar detalhes da vistoria.');
      } finally {
        setLoading(false);
      }
    };

    fetchVistoria();
  }, [id, location.state]);

  const handleIniciarVistoria = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/vistorias/iniciar/${id}`, {
        method: 'PUT',
      });

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.error || 'Erro ao iniciar a vistoria.');
      }

      navigate(`/vistoriador/iniciar-vistoria-detalhes/${id}`);
    } catch (err) {
      console.error('Erro ao iniciar a vistoria:', err);
    }
  };

  if (loading) return <div>Carregando detalhes da vistoria...</div>;
  if (!vistoriaDetalhes) return <div>Vistoria não encontrada.</div>;

  return (
    <div className="vistoria-data-entry-container">
      <h1>{vistoriaDetalhes.nomeempreendimento || `Detalhes da Vistoria ID: ${id}`}</h1>

      {vistoriaDetalhes.anexos && (
        <img
          src={`http://localhost:3001/uploads/${vistoriaDetalhes.anexos}`}
          alt="Imagem do Imóvel"
          className="imagem-empreendimento"
        />
      )}

      {relatorioGerado && (
        <div className="info-line">
          <span className="label">Relatório Gerado:</span>
          <a
            href={`http://localhost:3001/relatorios/${relatorioGerado}`}
            target="_blank"
            rel="noopener noreferrer"
            className="value"
          >
            Visualizar PDF
          </a>
        </div>
      )}

      <div className="vistoria-form">
        {/* Informações da vistoria */}
        {[
          ["Descrição do Imóvel:", vistoriaDetalhes.descricao],
          ["Cidade:", vistoriaDetalhes.cidade],
          ["Estado:", vistoriaDetalhes.estado],
          ["CEP:", vistoriaDetalhes.cep],
          ["Rua:", vistoriaDetalhes.rua],
          ["Bloco:", vistoriaDetalhes.bloco],
          ["Número:", vistoriaDetalhes.numero],
          ["Vistorias Realizadas:", vistoriaDetalhes.vistoriasrealizadas ?? "0"],
          ["Status do Imóvel:", vistoriaDetalhes.status],
          ["Data Agendada:", vistoriaDetalhes.datainicio ? new Date(vistoriaDetalhes.datainicio).toLocaleDateString() : "N/A"]
        ].map(([label, value], i) => (
          <div className="info-line" key={i}>
            <span className="label">{label}</span>
            <span className="value">{value || "N/A"}</span>
          </div>
        ))}

        <div className="form-actions">
          <button onClick={handleIniciarVistoria} className="action-button start-button">
            Iniciar Vistoria
          </button>

          <button onClick={() => navigate(`/vistoriador/reagendar-vistoria/${id}`)} className="action-button reschedule-button">
            Reagendar Vistoria
          </button>

          <button onClick={() => alert('Vistoria finalizada!')} className="action-button finalize-button">
            Finalizar Vistoria
          </button>
        </div>
      </div>

      <button onClick={() => navigate("/home")} className="back-to-list-button">
        Voltar para a Home
      </button>
    </div>
  );
}

export default VistoriaDataEntryPage;
