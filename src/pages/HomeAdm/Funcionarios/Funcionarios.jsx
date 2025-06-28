import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './funcionarios.css'; // Ajuste o caminho se seu home.css estiver em outro lugar

function Funcionarios() { // O nome da função é Funcionarios
  const navigate = useNavigate();

  // Dados mock de funcionários (alinhados ao diagrama de classes)
  const [funcionarios, setFuncionarios] = useState(() => {
    const savedFuncionarios = localStorage.getItem('funcionariosMock');
    return savedFuncionarios ? JSON.parse(savedFuncionarios) : [
      // Dados mock com CPF e Senha, e sem Cargo/DataContratacao
      { id: 1, nome: 'Bruno Kauan', cpf: '111.222.333-44', email: 'bruno.k@civis.com', senha: 'senha123', telefone: '11987654321' },
      { id: 2, nome: 'Ellen Cristina', cpf: '222.333.444-55', email: 'ellen.c@civis.com', senha: 'senha123', telefone: '11998765432' },
      { id: 3, nome: 'Paulo Lime', cpf: '333.444.555-66', email: 'paulo.l@civis.com', senha: 'senha123', telefone: '11976543210' },
    ];
  });

  // Salva os funcionários no localStorage sempre que o estado 'funcionarios' muda
  useEffect(() => {
    localStorage.setItem('funcionariosMock', JSON.stringify(funcionarios));
  }, [funcionarios]);

  // Função para lidar com a exclusão de um funcionário
  const handleExcluir = (id, nome) => {
    if (window.confirm(`Tem certeza que deseja excluir o funcionário(a) ${nome}?`)) {
      const novosFuncionarios = funcionarios.filter(func => func.id !== id);
      setFuncionarios(novosFuncionarios);
      alert(`Funcionário(a) ${nome} excluído(a) com sucesso!`);
    }
  };

  return (
    <div className="home-container">
      <header className="navbar">
        <div className="logo">CIVIS Administrador</div>
        <nav className="nav-links">
          <a href="#" onClick={() => navigate("/home")}>Home</a>
          <a href="#" onClick={() => navigate("/funcionarios")}>Funcionários</a>
        </nav>
        <button className="logout-button" onClick={() => { navigate("/login"); }}>
          Sair
        </button>
      </header>

      <main className="admin-page-container">
        <div className="admin-header">
          <h1>Gestão de Funcionários</h1>
          <button className="admin-action-button" onClick={() => navigate('/cadastrar-funcionario')}>
            + Adicionar Funcionário
          </button>
        </div>

        {funcionarios.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '50px', color: '#555' }}>Nenhum funcionário cadastrado.</p>
        ) : (
          <table className="lista-tabela">
            <thead>
              <tr>
                <th>ID Interno</th> {/* ID interno do localStorage para referência */}
                <th>Nome</th>
                <th>CPF</th> {/* ADICIONADO */}
                <th>Email</th>
                <th>Telefone</th> {/* ADICIONADO */}
                <th>Senha</th> {/* ADICIONADO (Lembre-se: em prod, não mostre nem edite senha aqui!) */}
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {funcionarios.map(func => (
                <tr key={func.id}>
                  <td data-label="ID Interno">{func.id}</td> {/* data-label para responsividade */}
                  <td data-label="Nome">{func.nome}</td>
                  <td data-label="CPF">{func.cpf}</td> {/* data-label para responsividade */}
                  <td data-label="Email">{func.email}</td>
                  <td data-label="Telefone">{func.telefone}</td> {/* data-label para responsividade */}
                  <td data-label="Senha">{func.senha}</td> {/* data-label para responsividade */}
                  <td data-label="Ações" className="acoes-botoes">
                    <button className="btn-editar" onClick={() => navigate(`/editar-funcionario/${func.id}`)}>
                      Editar
                    </button>
                    <button className="btn-excluir" onClick={() => handleExcluir(func.id, func.nome)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

export default Funcionarios;