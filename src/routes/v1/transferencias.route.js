const { crearTransferencia, obtenerTransferenciaById } = require("../../controllers/transferencias.controller");
const express = require("express");
const router = express.Router();

router.post("/", crearTransferencia);
router.get("/:id", obtenerTransferenciaById);

module.exports = router;
