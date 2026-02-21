const clienteService = require("../services/tipos-cuentas.service");
const STATUS = require("http-status").status;

const crearTipoCuenta = async (req, res) => {
    try {
        const tipoCuenta = req.body;
        const nuevoTipoCuenta = await clienteService.crearTipoCuenta(tipoCuenta);
        res.status(STATUS.CREATED).json(nuevoTipoCuenta);
    } catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}


const obtenerTiposCuentas = async (req, res) => {
    try {
        const tiposCuentas = await clienteService.obtenerTiposCuentas();    
        res.status(STATUS.OK).json(tiposCuentas);
    } catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const obtenerTipoCuentaPorId = async (req, res) => {
    try {
        const { id } = req.params;  
        const tipoCuenta = await clienteService.obtenerTipoCuentaPorId(Number(id));  
        if (!tipoCuenta) {
            return res.status(STATUS.NOT_FOUND).json({ error: "Tipo de cuenta no encontrado" });
        }
        res.status(STATUS.OK).json(tipoCuenta);
    } catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

module.exports = {
    crearTipoCuenta,
    obtenerTiposCuentas,
    obtenerTipoCuentaPorId
}