const { number } = require("zod");
const clienteService = require("../services/cuentas.service");
const STATUS = require("http-status").status;
const { replaceBigInt } = require("../utils/serializeBigInt");

const crearCuenta = async (req, res) => {
    try {
        const cuenta = req.body;
        const required = ["cliente_id", "tipo_cuenta_id", "numero_cuenta", "saldo"];
        const missing = required.filter((k) => cuenta[k] === undefined || cuenta[k] === null);
        if (missing.length) {
            return res.status(STATUS.BAD_REQUEST).json({ error: `Faltan campos requeridos: ${missing.join(", ")}` });
        }
        // convertir saldo a string para Prisma Decimal
        const data = { ...cuenta, saldo: String(cuenta.saldo) };
        const nuevaCuenta = await clienteService.crearCuenta(data);
        res.status(STATUS.CREATED).json(replaceBigInt(nuevaCuenta));
    } catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const obtenerCuentaById = async (req, res) => {
    try {
        const { id } = req.params;
        const cuenta = await clienteService.obtenerCuentaPorId(id);
        if (!cuenta) {
            return res.status(STATUS.NOT_FOUND).json({ error: "Cuenta no encontrada" });
        }
        res.status(STATUS.OK).json(replaceBigInt(cuenta));
    } catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const listarCuentas = async (req, res) => {
    try {
        const { cliente_id } = req.query;
        if (cliente_id) {
            const cuentasCliente = await clienteService.obtenerCuentasPorCliente(Number(cliente_id));
            return res.status(STATUS.OK).json(replaceBigInt(cuentasCliente));
        }
        const cuentas = await clienteService.obtenerCuentas();
        res.status(STATUS.OK).json(replaceBigInt(cuentas));
    } catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const actualizarSaldoCuenta = async (req, res) => {
    try {
        const { id } = req.params;
        const { nuevoSaldo } = req.body;
        if (nuevoSaldo === undefined || nuevoSaldo === null) {
            return res.status(STATUS.BAD_REQUEST).json({ error: "El campo 'nuevoSaldo' es requerido" });
        }
        const cuentaActualizada = await clienteService.actualizarSaldoCuenta(id, nuevoSaldo);
        res.status(STATUS.OK).json(replaceBigInt(cuentaActualizada));
    } catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

module.exports = {
    crearCuenta, 
    obtenerCuentaById,
    listarCuentas,
    actualizarSaldoCuenta
}