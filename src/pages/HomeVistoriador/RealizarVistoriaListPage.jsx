import React from 'react';
import { useNavigate } from 'react-router-dom';

import './RealizarVistoriaListPage.css'; // Create this CSS file

function RealizarVistoriaListPage() {
  const navigate = useNavigate();

  // Mock data for demonstration. Replace with actual data fetched from a backend.
  const properties = [
    { id: '101', address: 'Rua A, 123 - Centro', status: 'Agendada' },
    { id: '102', address: 'Av. B, 456 - Bairro Novo', status: 'Pendente' },
    { id: '103', address: 'Rua C, 789 - Vila Velha', status: 'Em Andamento' },
  ];

  const handleIniciarVistoria = (propertyId) => {
    navigate(`/vistoriador/vistoria/${propertyId}`); // Navigate to the detailed survey page
  };

  return (
    <div className="vistoria-list-page-container">
      <h1>Imóveis para Vistoria</h1>
      <p>Selecione um imóvel para iniciar ou continuar a vistoria.</p>

      <div className="property-list">
        {properties.length > 0 ? (
          properties.map(property => (
            <div key={property.id} className="property-card">
              <h3>Imóvel ID: {property.id}</h3>
              <p>Endereço: {property.address}</p>
              <p>Status: <strong>{property.status}</strong></p>
              <button 
                className="start-vistoria-button"
                onClick={() => handleIniciarVistoria(property.id)}
              >
                {property.status === 'Em Andamento' ? 'Continuar Vistoria' : 'Iniciar Vistoria'}
              </button>
            </div>
          ))
        ) : (
          <p>Nenhum imóvel disponível para vistoria no momento.</p>
        )}
      </div>
    </div>
  );
}

export default RealizarVistoriaListPage;