const express = require("express");
const router = express.Router();

router.use("/clientes", require("./cliente.route"))

router.use("/tipos-cuentas", require("./tipos-cuentas.route"))

router.use("/cuentas", require("./cuentas.route"))

router.use("/transferencias", require("./transferencias.route"))

router.use("/transacciones", require("./transacciones.route"))

router.use("/reportes", require("./reportes.route"))

router.use("/setup", require("./setup.route"))

module.exports = router;