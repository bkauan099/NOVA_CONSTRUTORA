const express = require('express');
const router = express.Router();
const db = require('../db');

// GET: Listar todas as vistorias
router.get('/', async (req, res) => {
  try {
    const vistorias = await db`
      SELECT * FROM vistoria
    `;
    res.status(200).json(vistorias);
  } catch (err) {
    console.error('Erro ao listar vistorias:', err);
    res.status(500).json({ error: 'Erro ao listar vistorias.' });
  }
});

// GET: Buscar uma vistoria por ID (com JOIN no imóvel e no empreendimento, incluindo imagem)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const idParsed = Number(id);

  if (isNaN(idParsed)) {
    return res.status(400).json({ error: 'ID inválido.' });
  }

  try {
    const [vistoria] = await db`
      SELECT 
        v.*,
        i.observacoes,
        i.status,
        i.descricao,
        i.bloco,
        i.numero,
        i.vistoriasrealizadas,
        i.anexos,
        e.nome AS nomeempreendimento,
        e.cidade,
        e.estado,
        e.cep,
        e.rua
      FROM vistoria v
      JOIN imovel i ON v.idimovel = i.idimovel
      JOIN empreendimento e ON i.idempreendimento = e.idempreendimento
      WHERE v.idvistoria = ${idParsed}
    `;

    if (!vistoria) {
      return res.status(404).json({ error: 'Vistoria não encontrada.' });
    }

    res.status(200).json(vistoria);
  } catch (err) {
    console.error('Erro ao buscar vistoria:', err);
    res.status(500).json({ error: 'Erro ao buscar vistoria.' });
  }
});


// POST: Criar uma nova vistoria
router.post('/', async (req, res) => {
  const { idimovel, idcliente, idvistoriador, datainicio } = req.body;

  if (!idimovel || !idcliente || !idvistoriador || !datainicio) {
    return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
  }

  try {
    const [novaVistoria] = await db`
      INSERT INTO vistoria (idimovel, idcliente, idvistoriador, datainicio)
      VALUES (${Number(idimovel)}, ${Number(idcliente)}, ${Number(idvistoriador)}, ${datainicio})
      RETURNING *
    `;

    // Atualizar o status do imóvel após criação da vistoria
    await db`
      UPDATE imovel
      SET status = 'Aguardando Agendamento da Vistoria'
      WHERE idimovel = ${Number(idimovel)}
    `;

    res.status(201).json(novaVistoria);
  } catch (err) {
    console.error('Erro ao agendar vistoria:', err);
    res.status(500).json({ error: 'Erro ao agendar vistoria.' });
  }
});

// DELETE: Excluir uma vistoria
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const idParsed = Number(id);

  if (isNaN(idParsed)) {
    return res.status(400).json({ error: 'ID inválido.' });
  }

  try {
    await db`
      DELETE FROM vistoria WHERE idvistoria = ${idParsed}
    `;
    res.status(200).json({ message: 'Vistoria excluída com sucesso.' });
  } catch (err) {
    console.error('Erro ao excluir vistoria:', err);
    res.status(500).json({ error: 'Erro ao excluir vistoria.' });
  }
});

// PUT: Iniciar a vistoria (atualiza datahorainicio da vistoria e status do imóvel)
router.put('/iniciar/:id', async (req, res) => {
  const { id } = req.params;
  const idParsed = Number(id);

  if (isNaN(idParsed)) {
    return res.status(400).json({ error: 'ID inválido.' });
  }

  const dataHoraInicio = new Date().toISOString();

  try {
    await db`
      UPDATE vistoria
      SET datahorainicio = ${dataHoraInicio}
      WHERE idvistoria = ${idParsed}
    `;

    const [vistoria] = await db`
      SELECT idimovel FROM vistoria WHERE idvistoria = ${idParsed}
    `;

    if (!vistoria) {
      return res.status(404).json({ error: 'Vistoria não encontrada.' });
    }

    await db`
      UPDATE imovel
      SET status = 'Vistoria em Andamento'
      WHERE idimovel = ${vistoria.idimovel}
    `;

    res.status(200).json({ message: 'Vistoria iniciada com sucesso.' });
  } catch (err) {
    console.error('Erro ao iniciar vistoria:', err);
    res.status(500).json({ error: 'Erro ao iniciar a vistoria.' });
  }
});

// GET: Listar vistorias pendentes (Aguardando Agendamento da Vistoria) de um Cliente específico
router.get('/pendentes/cliente/:idcliente', async (req, res) => {
  const idCliente = Number(req.params.idcliente);
  if (isNaN(idCliente)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  try {
    const vistorias = await db`
      SELECT v.*, i.descricao, e.nome AS nomeempreendimento
      FROM vistoria v
      JOIN imovel i ON v.idimovel = i.idimovel
      JOIN empreendimento e ON i.idempreendimento = e.idempreendimento
      WHERE v.idcliente = ${idCliente}
        AND i.status = 'Aguardando Agendamento da Vistoria'
    `;
    res.status(200).json(vistorias);
  } catch (err) {
    console.error('Erro ao buscar vistorias pendentes:', err);
    res.status(500).json({ error: "Erro ao buscar vistorias pendentes." });
  }
});


module.exports = router;



