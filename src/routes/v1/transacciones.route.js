const { listarTransacciones, batchInsertTransacciones } = require("../../controllers/transacciones.controller");
const express = require("express");
const router = express.Router();

router.get("/", listarTransacciones);
router.post("/batch", batchInsertTransacciones);

module.exports = router;
