const prisma = require("../utils/prisma")
const crearCliente = async (cliente) => {
    console.log("cliente.service - crearCliente", cliente);
    const nuevoCliente = await prisma.clientes.create({
        data: cliente
    });
    return nuevoCliente;
}

const obtenerClientes = async () => {
    const clientes = await prisma.clientes.findMany();
    return clientes;
}

// Obtener cliente por ID where id = 1 
const obtenerClientePorId = async (id) => {
    const cliente = await prisma.clientes.findUnique({
        where: { id }
    });
    return cliente;
}

module.exports = {
    crearCliente,
    obtenerClientes,
    obtenerClientePorId
}