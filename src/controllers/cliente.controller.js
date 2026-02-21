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


const obtenerClientes = async (req, res) => {
    try {
        const clientes = await clienteService.obtenerClientes();    
        res.status(STATUS.OK).json(clientes);
    } catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

const obtenerClientePorId = async (req, res) => {
    try {
        const { id } = req.params;  
        const cliente = await clienteService.obtenerClientePorId(Number(id));  
        if (!cliente) {
            return res.status(STATUS.NOT_FOUND).json({ error: "Cliente no encontrado" });
        }
        res.status(STATUS.OK).json(cliente);
    } catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

/**
* Routes rutas a controllers.
Controller * Recibir y responder peticiones
* Lógica de negocio Service
* Capa de Acceso a Datos Repository
* 
*/

module.exports = {
    crearCliente,
    obtenerClientes,
    obtenerClientePorId
}