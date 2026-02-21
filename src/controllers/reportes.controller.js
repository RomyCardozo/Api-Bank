const transaccionesService = require("../services/transacciones.service");
const STATUS = require("http-status").status;
const { replaceBigInt } = require("../utils/serializeBigInt");

const reporteTransacciones = async (req, res) => {
  try {
    const { desde, hasta, limit = 1000, offset = 0 } = req.query;
    const transacciones = await transaccionesService.obtenerTransacciones({ desde, hasta, limit, offset });
    res.status(STATUS.OK).json(replaceBigInt(transacciones));
  } catch (error) {
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

module.exports = { reporteTransacciones };
