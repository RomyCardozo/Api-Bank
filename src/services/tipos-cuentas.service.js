const prisma = require("../utils/prisma")

const crearTipoCuenta = async (tipoCuenta) => {
    const nuevoTipoCuenta = await prisma.tipos_cuenta.create({
        data: tipoCuenta
    });
    return nuevoTipoCuenta;
}

const obtenerTiposCuentas = async () => {
    const tiposCuentas = await prisma.tipos_cuenta.findMany();
    return tiposCuentas;
}


const obtenerTipoCuentaPorId = async (id) => {
    const tipoCuenta = await prisma.tipos_cuenta.findUnique({
        where: { id }
    });
    return tipoCuenta;
}

module.exports = {
    crearTipoCuenta,
    obtenerTiposCuentas,
    obtenerTipoCuentaPorId
}
