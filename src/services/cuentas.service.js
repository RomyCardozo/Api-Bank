const prisma = require("../utils/prisma")
const { Prisma } = require("@prisma/client");

const crearCuenta = async (cuenta) => {
    const data = { ...cuenta };
    if (data.saldo !== undefined && data.saldo !== null) data.saldo = String(data.saldo);
    const nuevaCuenta = await prisma.cuentas.create({
        data: data
    });
    return nuevaCuenta;
} 

const obtenerCuentaPorId = async (id) => {  
    const cuenta = await prisma.cuentas.findUnique({
        where: { id: BigInt(id) },
    });
    return cuenta;
}

const obtenerCuentas = async () => {
    const cuentas = await prisma.cuentas.findMany();
    return cuentas;
}

const obtenerCuentasPorCliente = async (clienteId) => {
    const cuentas = await prisma.cuentas.findMany({
        where: { cliente_id: clienteId }
    });
    return cuentas;
}

const actualizarSaldoCuenta = async (id, nuevoSaldo) => {
    const cuentaActualizada = await prisma.cuentas.update({
        where: { id: BigInt(id) },
        data: { saldo: new Prisma.Decimal(String(nuevoSaldo)) }
    });
    return cuentaActualizada;
}
module.exports = {
    crearCuenta,
    obtenerCuentaPorId,
    obtenerCuentas,
    actualizarSaldoCuenta,
    obtenerCuentasPorCliente
}
