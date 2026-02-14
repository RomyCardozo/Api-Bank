const clienteService = require("../services/cliente.service");
const STATUS = require("http-status").status;

const crearCliente = async (req, res) => {
    try {
        const cliente = req.body;
        console.log("body", cliente);
        const nuevoCliente = await clienteService.crearCliente(cliente);
        res.status(STATUS.CREATED).json(nuevoCliente);
    } catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

module.exports = {
    crearCliente
}