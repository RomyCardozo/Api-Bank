const prisma = require("../utils/prisma");
const { Prisma } = require("@prisma/client");

const obtenerTransacciones = async ({ desde, hasta, cuenta_id, limit = 100, offset = 0 }) => {
  const where = {};
  if (desde || hasta) {
    where.fecha = {};
    if (desde) where.fecha.gte = new Date(desde);
    if (hasta) where.fecha.lte = new Date(hasta);
  }
  if (cuenta_id !== undefined && cuenta_id !== null) {
    where.cuenta_id = BigInt(cuenta_id);
  }

  const transacciones = await prisma.transacciones.findMany({
    where,
    orderBy: { fecha: "desc" },
    skip: Number(offset || 0),
    take: Number(limit || 100)
  });
  return transacciones;
};

const crearBatchTransacciones = async (transaccionesArray) => {
  if (!Array.isArray(transaccionesArray)) throw new Error("'transacciones' debe ser un array");
  const data = transaccionesArray.map(t => ({
    cuenta_id: BigInt(t.cuenta_id),
    tipo: t.tipo,
    monto: String(t.monto)
  }));

  // createMany for bulk insert
  const result = await prisma.transacciones.createMany({ data });
  return result; // { count: N }
};

const obtenerTransaccionesPorCuenta = async (cuentaId, { limit = 100, offset = 0 } = {}) => {
  return await obtenerTransacciones({ cuenta_id: cuentaId, limit, offset });
};

module.exports = {
  obtenerTransacciones,
  crearBatchTransacciones,
  obtenerTransaccionesPorCuenta
};
