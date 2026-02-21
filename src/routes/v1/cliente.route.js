const { crearCliente, obtenerClientePorId, obtenerClientes } = require("../../controllers/cliente.controller");

const express = require("express");
const router = express.Router();

router.post("/", crearCliente )

router.get("/", obtenerClientes)

router.get("/:id", obtenerClientePorId)

// GET /clientes

// GET /clientes/:id

module.exports = router;