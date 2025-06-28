-- Tabela funcionario
CREATE TABLE funcionario (
    id SERIAL PRIMARY KEY,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    senha VARCHAR(100) NOT NULL,
    telefone VARCHAR(20)
);

-- Tabela administrador
CREATE TABLE administrador (
    idadministrador INT PRIMARY KEY,
    FOREIGN KEY (idadministrador) REFERENCES funcionario(id)
);

-- Tabela vistoriador
CREATE TABLE vistoriador (
    idvistoriador INT PRIMARY KEY,
    FOREIGN KEY (idvistoriador) REFERENCES funcionario(id)
);

-- Tabela cliente
CREATE TABLE cliente (
    idcliente SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    email VARCHAR(100)
);

-- Tabela empreendimento
CREATE TABLE empreendimento (
    idempreendimento SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    construtora VARCHAR(100),
    dataentrega DATE,
    observacoes TEXT,
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(10),
    rua VARCHAR(100)
);

-- Tabela imovel
CREATE TABLE imovel (
    idimovel SERIAL PRIMARY KEY,
    descricao TEXT,
    status VARCHAR(20),
    vistoriasrealizadas INT,
    observacao TEXT,
    numerounidade VARCHAR(20),
    bloco VARCHAR(50),
    numero VARCHAR(20),
    idempreendimento INT,
    FOREIGN KEY (idempreendimento) REFERENCES empreendimento(idempreendimento)
);

-- Tabela vistoria
CREATE TABLE vistoria (
    idvistoria SERIAL PRIMARY KEY,
    idcliente INT NOT NULL,
    idimovel INT NOT NULL,
    idvistoriador INT NOT NULL,
    dataagendada DATE,
    datainicio DATE,
    datafim DATE,
    status VARCHAR(20),
    FOREIGN KEY (idcliente) REFERENCES cliente(idcliente),
    FOREIGN KEY (idimovel) REFERENCES imovel(idimovel),
    FOREIGN KEY (idvistoriador) REFERENCES vistoriador(idvistoriador)
);

-- Tabela relatoriotecnico
CREATE TABLE relatoriotecnico (
    idvistoria INT PRIMARY KEY,
    estadoconservacaoestrutura VARCHAR(30),
    estadoconservacaopintura VARCHAR(30),
    estadoinstalacaoeletrica VARCHAR(30),
    estadoinstalacaohidraulica VARCHAR(30),
    estadotelhado VARCHAR(30),
    estadopiso VARCHAR(30),
    segurancaportasjanelas BOOLEAN,
    funcionamentosistemaalarme BOOLEAN,
    presencapragas BOOLEAN,
    presencainfiltracoes BOOLEAN,
    anexos TEXT,
    FOREIGN KEY (idvistoria) REFERENCES vistoria(idvistoria)
);

-- Exemplo de inserts para cada tabela:

-- Inserindo um funcionario
INSERT INTO funcionario (cpf, email, nome, senha, telefone)
VALUES ('123.456.789-00', 'admin@exemplo.com', 'Administrador Exemplo', 'senha123', '11999999999');

-- Inserindo um administrador (herança)
INSERT INTO administrador (idadministrador)
VALUES (1); -- O id do funcionario criado acima

-- Inserindo um vistoriador (herança)
INSERT INTO vistoriador (idvistoriador)
VALUES (1); -- Mesmo funcionario também pode ser um vistoriador neste exemplo, só pra facilitar

-- Inserindo um cliente
INSERT INTO cliente (nome, cpf, telefone, email)
VALUES ('Cliente Exemplo', '987.654.321-00', '11988888888', 'cliente@exemplo.com');

-- Inserindo um empreendimento
INSERT INTO empreendimento (nome, descricao, construtora, dataentrega, observacoes, cidade, estado, cep, rua)
VALUES ('Empreendimento Exemplo', 'Descrição do empreendimento', 'Construtora XYZ', '2025-12-01', 'Sem observações', 'São Paulo', 'SP', '01000-000', 'Rua Exemplo');

-- Inserindo um imóvel
INSERT INTO imovel (descricao, status, vistoriasrealizadas, observacao, numerounidade, bloco, numero, idempreendimento)
VALUES ('Apartamento 101', 'Disponível', 0, 'Nenhuma observação', '101', 'A', '10', 1);

-- Inserindo uma vistoria
INSERT INTO vistoria (idcliente, idimovel, idvistoriador, dataagendada, datainicio, datafim, status)
VALUES (1, 1, 1, '2025-07-01', '2025-07-01', '2025-07-01', 'Agendada');

-- Inserindo um relatório técnico
INSERT INTO relatoriotecnico (
    idvistoria,
    estadoconservacaoestrutura,
    estadoconservacaopintura,
    estadoinstalacaoeletrica,
    estadoinstalacaohidraulica,
    estadotelhado,
    estadopiso,
    segurancaportasjanelas,
    funcionamentosistemaalarme,
    presencapragas,
    presencainfiltracoes,
    anexos
)
VALUES (
    1,
    'Bom',
    'Regular',
    'Bom',
    'Ruim',
    'Bom',
    'Regular',
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    'Anexos exemplo'
);
