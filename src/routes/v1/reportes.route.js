const { reporteTransacciones } = require("../../controllers/reportes.controller");
const express = require("express");
const router = express.Router();

router.get("/transacciones", reporteTransacciones);

module.exports = router;
