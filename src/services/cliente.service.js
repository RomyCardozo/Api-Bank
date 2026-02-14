const prisma = require("../utils/prisma")
const crearCliente = async (cliente) => {
    console.log("cliente.service - crearCliente", cliente);
    const nuevoCliente = await prisma.clientes.create({
        data: cliente
    });
    return nuevoCliente;
}

module.exports = {
    crearCliente
}