const express = require("express");
const router = express.Router();
const { gerarRelatorio } = require("../controllers/relatorioControler");

router.post("/gerar", gerarRelatorio);

module.exports = router;
