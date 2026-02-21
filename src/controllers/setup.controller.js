const setupService = require("../services/setup.service");
const STATUS = require("http-status").status;

const crearDataset = async (req, res) => {
  try {
    const { cantidad } = req.body || {};
    if (cantidad === undefined || cantidad === null) {
      return res.status(STATUS.BAD_REQUEST).json({ error: "El campo 'cantidad' (número de clientes) es requerido en el body" });
    }
    const result = await setupService.crearDataset(Number(cantidad));
    res.status(STATUS.CREATED).json({ ok: true, summary: { clientes: result.clientes.length, cuentas: result.cuentas.length } });
  } catch (error) {
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

module.exports = { crearDataset };
