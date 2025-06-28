const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Garante que a pasta de uploads exista
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// GET - Buscar imóveis por empreendimento
router.get('/', async (req, res) => {
  const { empreendimentoid } = req.query;

  console.log('empreendimentoid recebido:', empreendimentoid);

  if (!empreendimentoid) {
    return res.status(400).json({ error: 'Parâmetro empreendimentoid é obrigatório.' });
  }

  try {
    const imoveis = await db`
      SELECT * FROM imovel WHERE idempreendimento = ${Number(empreendimentoid)}
    `;
    res.status(200).json(imoveis);
  } catch (error) {
    console.error('Erro ao buscar imóveis:', error);
    res.status(500).json({ error: 'Erro ao buscar imóveis.' });
  }
});

// POST - Cadastrar imóvel com valores automáticos
router.post('/', upload.single('anexos'), async (req, res) => {
  const { descricao, bloco, numero, idempreendimento } = req.body;
  const arquivoAnexo = req.file ? req.file.filename : null;

  if (!idempreendimento) {
    return res.status(400).json({ error: 'idempreendimento é obrigatório.' });
  }

  try {
    const [novoImovel] = await db`
      INSERT INTO imovel (descricao, bloco, numero, anexos, idempreendimento, status, vistoriasrealizadas)
      VALUES (${descricao}, ${bloco}, ${numero}, ${arquivoAnexo}, ${Number(idempreendimento)}, 'Aguardando Vistoria', 0)
      RETURNING *
    `;
    res.status(201).json(novoImovel);
  } catch (error) {
    console.error('Erro ao cadastrar imóvel:', error);
    res.status(500).json({ error: 'Erro ao cadastrar imóvel.' });
  }
});

// DELETE - Excluir imóvel
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db`
      DELETE FROM imovel WHERE idimovel = ${Number(id)}
    `;
    res.status(200).json({ message: 'Imóvel excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir imóvel:', error);
    res.status(500).json({ error: 'Erro ao excluir imóvel.' });
  }
});

// GET - Buscar todos os imóveis com dados adicionais
router.get('/todos', async (req, res) => {
  try {
    const imoveis = await db`
      SELECT 
        i.idimovel, i.descricao, i.bloco, i.numero, i.status, i.anexos,
        e.nome AS nomeempreendimento,
        v.datainicio AS datainiciovistoria,
        v.idvistoria
      FROM imovel i
      LEFT JOIN empreendimento e ON i.idempreendimento = e.idempreendimento
      LEFT JOIN vistoria v ON i.idimovel = v.idimovel
    `;
    res.status(200).json(imoveis);
  } catch (error) {
    console.error('Erro ao buscar imóveis:', error);
    res.status(500).json({ error: 'Erro ao buscar imóveis.' });
  }
});

// GET - Buscar imóveis de um cliente específico
router.get('/cliente/:idcliente', async (req, res) => {
  const { idcliente } = req.params;

  try {
    const imoveis = await db`
      SELECT 
        DISTINCT i.idimovel, i.descricao, i.bloco, i.numero, i.status, i.anexos,
        e.nome AS nomeempreendimento,
        v.datainicio AS datainiciovistoria,
        v.idvistoria
      FROM imovel i
      JOIN vistoria v ON i.idimovel = v.idimovel
      JOIN cliente c ON v.idcliente = c.idcliente
      LEFT JOIN empreendimento e ON i.idempreendimento = e.idempreendimento
      WHERE c.idcliente = ${Number(idcliente)}
    `;

    res.status(200).json(imoveis);
  } catch (error) {
    console.error('Erro ao buscar imóveis do cliente:', error);
    res.status(500).json({ error: 'Erro ao buscar imóveis do cliente.' });
  }
});


// PUT - Agendar Vistoria (atualizar dataagendada da vistoria + status do imóvel)

router.put('/agendar/:idimovel', async (req, res) => {
  const { idimovel } = req.params;
  const { dataagendada } = req.body;

  if (!dataagendada) {
    return res.status(400).json({ error: 'A dataagendada é obrigatória.' });
  }

  try {
    // Atualiza a data da vistoria
    await db`
      UPDATE vistoria
      SET dataagendada = ${dataagendada}
      WHERE idimovel = ${Number(idimovel)}
    `;

    // Atualiza o status do imóvel
    await db`
      UPDATE imovel
      SET status = 'Vistoria Agendada'
      WHERE idimovel = ${Number(idimovel)}
    `;

    res.status(200).json({ message: 'Vistoria agendada com sucesso.' });
  } catch (error) {
    console.error('Erro ao agendar vistoria:', error);
    res.status(500).json({ error: 'Erro ao agendar vistoria.' });
  }
});

// GET - Buscar imóveis disponíveis para agendar vistoria
router.get('/cliente/:idcliente/disponiveis', async (req, res) => {
  const { idcliente } = req.params;

  try {
    const imoveis = await db`
      SELECT 
        DISTINCT i.idimovel, i.descricao, i.bloco, i.numero, i.status, i.anexos,
        e.nome AS nomeempreendimento
      FROM imovel i
      JOIN vistoria v ON i.idimovel = v.idimovel
      JOIN cliente c ON v.idcliente = c.idcliente
      LEFT JOIN empreendimento e ON i.idempreendimento = e.idempreendimento
      WHERE c.idcliente = ${Number(idcliente)} AND i.status = 'Aguardando Agendamento da Vistoria'
    `;

    res.status(200).json(imoveis);
  } catch (error) {
    console.error('Erro ao buscar imóveis disponíveis:', error);
    res.status(500).json({ error: 'Erro ao buscar imóveis disponíveis.' });
  }
});

// GET - Buscar imóveis pendentes de validação
router.get('/pendentes-validacao', async (req, res) => {
  try {
    const imoveis = await db`
      SELECT 
        i.idimovel, i.descricao, i.bloco, i.numero, i.status, i.anexos,
        e.nome AS nomeempreendimento
      FROM imovel i
      LEFT JOIN empreendimento e ON i.idempreendimento = e.idempreendimento
      WHERE i.status = 'Aguardando Validação da Vistoria'
    `;

    res.status(200).json(imoveis);
  } catch (error) {
    console.error('Erro ao buscar imóveis pendentes de validação:', error);
    res.status(500).json({ error: 'Erro ao buscar imóveis.' });
  }
});

// PUT - Validar uma vistoria (atualizar status do imóvel)
router.put('/validar/:idimovel', async (req, res) => {
  const { idimovel } = req.params;

  try {
    await db`
      UPDATE imovel
      SET status = 'Vistoria Validada'
      WHERE idimovel = ${Number(idimovel)}
    `;

    res.status(200).json({ message: 'Vistoria validada com sucesso.' });
  } catch (error) {
    console.error('Erro ao validar vistoria:', error);
    res.status(500).json({ error: 'Erro ao validar vistoria.' });
  }
});

// GET - Imóveis do cliente com status "Aguardando Validação da Vistoria"
router.get('/cliente/:idcliente/pendentes-validacao', async (req, res) => {
  const { idcliente } = req.params;

  try {
    const imoveis = await db`
      SELECT 
        DISTINCT i.idimovel, i.descricao, i.bloco, i.numero, i.status, i.anexos,
        e.nome AS nomeempreendimento,
        v.relatorio_url
      FROM imovel i
      JOIN vistoria v ON i.idimovel = v.idimovel
      JOIN empreendimento e ON i.idempreendimento = e.idempreendimento
      WHERE v.idcliente = ${Number(idcliente)} 
        AND i.status = 'Aguardando Validação da Vistoria'
    `;

    res.status(200).json(imoveis);
  } catch (error) {
    console.error('Erro ao buscar imóveis pendentes de validação para o cliente:', error);
    res.status(500).json({ error: 'Erro ao buscar imóveis.' });
  }
});




module.exports = router;

