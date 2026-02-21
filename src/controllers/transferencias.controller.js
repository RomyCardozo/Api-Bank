const transferenciasService = require("../services/transferencias.service");
const STATUS = require("http-status").status;
const { replaceBigInt } = require("../utils/serializeBigInt");

const crearTransferencia = async (req, res) => {
  try {
    const { cuenta_origen_id, cuenta_destino_id, monto } = req.body;
    const required = ["cuenta_origen_id", "cuenta_destino_id", "monto"];
    const missing = required.filter((k) => req.body[k] === undefined || req.body[k] === null);
    if (missing.length) return res.status(STATUS.BAD_REQUEST).json({ error: `Faltan campos: ${missing.join(", ")}` });

    const transferencia = await transferenciasService.crearTransferencia({ cuenta_origen_id, cuenta_destino_id, monto });
    res.status(STATUS.CREATED).json(replaceBigInt(transferencia));
  } catch (error) {
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const obtenerTransferenciaById = async (req, res) => {
  try {
    const { id } = req.params;
    const transferencia = await transferenciasService.obtenerTransferenciaPorId(id);
    if (!transferencia) return res.status(STATUS.NOT_FOUND).json({ error: "Transferencia no encontrada" });
    res.status(STATUS.OK).json(replaceBigInt(transferencia));
  } catch (error) {
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

module.exports = { crearTransferencia, obtenerTransferenciaById };
