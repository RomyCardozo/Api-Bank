const { crearDataset } = require("../../controllers/setup.controller");
const express = require("express");
const router = express.Router();

router.post("/dataset", crearDataset);

module.exports = router;
