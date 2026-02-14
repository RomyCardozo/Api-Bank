const { crearCliente } = require("../../controllers/cliente.controller");

const express = require("express");
const router = express.Router();

router.post("/", crearCliente )

module.exports = router;