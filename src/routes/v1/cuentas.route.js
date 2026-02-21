const { crearCuenta, obtenerCuentaById, listarCuentas, actualizarSaldoCuenta } = require("../../controllers/cuentas.controller");
const transaccionesController = require("../../controllers/transacciones.controller");

const express = require("express");
const router = express.Router();

router.post("/", crearCuenta)
router.get("/:id", obtenerCuentaById)
router.get("/:id/transacciones", transaccionesController.obtenerTransaccionesPorCuenta)
router.get("/", listarCuentas)
router.patch("/:id/saldo", actualizarSaldoCuenta)



module.exports = router;