import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Inicial from "./pages/Inicial/Inicial";
import Login from "./pages/Login/login";
import CadastroLogin from "./pages/Login/CadastroLogin"; // Ajuste o caminho se necessário (ex: "./pages/Login/CadastroLogin")
import HomeAdm from "./pages/HomeAdm/Home";
import HomeCliente from "./pages/HomeCliente/Home";
import HomeVistoriador from "./pages/HomeVistoriador/Home"; 

//Componentes específicos do administrador
//Funcionarios
import Funcionarios from "./pages/HomeAdm/Funcionarios/Funcionarios";
import CadastrarFuncionario from "./pages/HomeAdm/Funcionarios/CadastrarFuncionario";
import EditarFuncionario from "./pages/HomeAdm/Funcionarios/EditarFuncionario";
//Empreendimentos
import Empreendimentos from "./pages/HomeAdm/Empreendimentos/Empreendimentos";
import CadastrarEmpreendimento from "./pages/HomeAdm/Empreendimentos/CadastrarEmpreendimento";
import EditarEmpreendimento from "./pages/HomeAdm/Empreendimentos/EditarEmpreendimento";
// Imóveis
import Imoveis from "./pages/HomeAdm/Imoveis/Imoveis";
import CadastrarImovel from "./pages/HomeAdm/Imoveis/CadastrarImovel"; 
import EditarImovel from "./pages/HomeAdm/Imoveis/EditarImovel";
// import VisualizarImovel from "./pages/HomeAdm/Imoveis/VisualizarImovel"; // Descomente se tiver este componente
// Vistorias
import VistoriasAgendadas from "./pages/HomeAdm/Vistorias/VistoriasAgendadas";
import NovaVistoria from "./pages/HomeAdm/Vistorias/NovaVistoria";
import VistoriaDetalhes from "./pages/HomeAdm/Vistorias/VistoriaDetalhes"; // Detalhes da vistoria para o administrador
//Clientes
import Clientes from "./pages/HomeAdm/Clientes/Clientes";
import CadastrarCliente from "./pages/HomeAdm/Clientes/CadastrarCliente"; // Descomente se tiver este componente
// import CadastrarCliente from "./pages/HomeAdm/Clientes/CadastrarCliente"; // Descomente se tiver este componente
import EditarCliente from "./pages/HomeAdm/Clientes/EditarCliente";

// Componentes específicos do cliente
import MeusImoveis from "./pages/HomeCliente/MeuImovel";
import ImovelDetalhado from "./pages/HomeCliente/ImovelDetalhado";
import MinhasVistorias from "./pages/HomeCliente/MinhasVistorias";
import AgendarVistoria from "./pages/HomeCliente/AgendarVistoria";
import ValidarVistoria from "./pages/HomeCliente/ValidarVistoria";


//Componentes específicos do Vistoriador
import RealizarVistoriaListPage from "./pages/HomeVistoriador/RealizarVistoriaListPage"; 
import VistoriaDataEntryPage from "./pages/HomeVistoriador/VistoriaDataEntryPage"; 
import ReagendarVistoriaPage from "./pages/HomeVistoriador/ReagendarVistoriaPage"; 
// IMPORTAÇÃO DA NOVA PÁGINA PARA INICIAR A VISTORIA DETALHADA
import IniciarVistoriaDetalhesPage from "./pages/HomeVistoriador/IniciarVistoriaDetalhesPage"; 
import CriarRelatorioPage from "./pages/HomeVistoriador/CriarRelatorioPage";
//Funcionalidades do Vistoriador
const NotificarClientePage = () => <div><h1>Página de Notificação de Clientes</h1><p>Envie mensagens ou alertas para clientes.</p></div>;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null); // 'admin', 'cliente' ou 'vistoriador'

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setUserType(userData.type);
      } catch (e) {
        console.error("Erro ao parsear dados do usuário no localStorage", e);
        localStorage.removeItem("usuario");
        setIsAuthenticated(false);
        setUserType(null);
      }
    }
  }, []);

  const login = (type) => { //'admin', 'cliente' ou 'vistoriador'
    setIsAuthenticated(true);
    setUserType(type);
    localStorage.setItem("usuario", JSON.stringify({ type: type }));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    localStorage.removeItem("usuario");
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Página Inicial */}
        <Route path="/" element={<Inicial />} />

        {/* Login */}
        <Route path="/login" element={<Login onLogin={login} />} />

        {/* Rota de Cadastro Adicionada */}
        <Route path="/cadastro-login" element={<CadastroLogin />} />

        {/* Rotas protegidas após login */}
        {isAuthenticated ? (
          <>
            {/* Rota Home principal, renderiza a Home correta com base no tipo de usuário */}
            <Route
              path="/home"
              element={
                userType === "admin" ? (
                  <HomeAdm onLogout={logout} />
                ) : userType === "cliente" ? (
                  <HomeCliente onLogout={logout} />
                ) : userType === "vistoriador" ? (
                  <HomeVistoriador onLogout={logout} />
                ) : (
                  <Navigate to="/login" /> // Redireciona se o tipo de usuário for desconhecido
                )
              }
            />

            {/* Rotas específicas do administrador */}
            {userType === "admin" && (
              <>
                <Route path="/funcionarios" element={<Funcionarios />} />
                <Route path="/cadastrar-funcionario" element={<CadastrarFuncionario />} />
                <Route path="/editar-funcionario/:id" element={<EditarFuncionario />} />
                {/* Empreendimentos */}
                <Route path="/empreendimentos" element={<Empreendimentos />} />
                <Route path="/cadastrar-empreendimento" element={<CadastrarEmpreendimento />} />
                <Route path="/editar-empreendimento/:id" element={<EditarEmpreendimento />} />
                {/* Clientes */}
                <Route path="/clientes" element={<Clientes />} />
                {<Route path="/cadastrar-cliente" element={<CadastrarCliente />} />}
                <Route path="/editar-cliente/:id" element={<EditarCliente />} />
                {/* Imóveis */}
                <Route path="/imoveis" element={<Imoveis />} />
                <Route path="/cadastrar-imovel" element={<CadastrarImovel />} />
                <Route path="/editar-imovel/:id" element={<EditarImovel />} /> 
                {/* <Route path="/visualizar-imovel/:id" element={<VisualizarImovel />} /> */}
                {/* Vistorias */}
                <Route path="/vistorias-agendadas" element={<VistoriasAgendadas />} />
                <Route path="/nova-vistoria" element={<NovaVistoria />} />
                <Route path="/vistoria-detalhes/:id" element={<VistoriaDetalhes />} />
              </>
            )}

            {/* Rotas específicas do cliente */}
            {userType === "cliente" && (
              <>
                <Route path="/meus-imoveis" element={<MeusImoveis />} />
                <Route path="/imovel-detalhado/:id" element={<ImovelDetalhado />} />
                <Route path="/minhas-vistorias" element={<MinhasVistorias />} />
                <Route path="/agendar-vistoria" element={<AgendarVistoria />} />
                <Route path="/validar-vistoria" element={<ValidarVistoria />} />
              </>
            )}


            {/* Rotas específicas do Vistoriador */}
            {userType === "vistoriador" && (
              <>
                <Route path="/vistoriador/realizar-vistoria" element={<RealizarVistoriaListPage />} />
                <Route path="/vistoriador/vistoria/:id" element={<VistoriaDataEntryPage />} />
                {/* NOVA ROTA ADICIONADA PARA INICIAR VISTORIA E PREENCHER DADOS GENÉRICOS */}
                <Route path="/vistoriador/iniciar-vistoria-detalhes/:id" element={<CriarRelatorioPage />} />
                <Route path="/vistoriador/criar-relatorio" element={<CriarRelatorioPage />} />
                <Route path="/vistoriador/notificar-cliente" element={<NotificarClientePage />} />
                <Route path="/vistoriador/reagendar-vistoria/:id" element={<ReagendarVistoriaPage />} />
              </>
            )}
            {/* Rota padrão para usuários autenticados que acessam um caminho inválido, redireciona para /home */}
            <Route path="*" element={<Navigate to="/home" />} />
          </>
        ) : (
          // Se não estiver autenticado, qualquer rota protegida ou inválida redireciona para o login
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;