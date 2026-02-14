const express = require("express");
const router = express.Router();

router.use("/clientes", require("./cliente.route"))

module.exports = router;