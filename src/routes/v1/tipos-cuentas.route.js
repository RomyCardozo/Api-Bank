const { crearTipoCuenta, obtenerTiposCuentas, obtenerTipoCuentaPorId } = require("../../controllers/tipos-cuentas.controller");
const express = require("express");
const router = express.Router();

router.post("/", crearTipoCuenta)
router.get("/", obtenerTiposCuentas)
router.get("/:id", obtenerTipoCuentaPorId)


module.exports = router;