const prisma = require("../utils/prisma");
const { Prisma } = require("@prisma/client");

const crearTransferencia = async ({ cuenta_origen_id, cuenta_destino_id, monto }) => {
  if (!cuenta_origen_id || !cuenta_destino_id || monto === undefined || monto === null) {
    throw new Error("Faltan datos requeridos para realizar la transferencia");
  }

  const origenId = BigInt(cuenta_origen_id);
  const destinoId = BigInt(cuenta_destino_id);
  const montoDec = new Prisma.Decimal(String(monto));

  return await prisma.$transaction(async (tx) => {
    const cuentaOrigen = await tx.cuentas.findUnique({ where: { id: origenId } });
    if (!cuentaOrigen) throw new Error("Cuenta origen no encontrada");

    const cuentaDestino = await tx.cuentas.findUnique({ where: { id: destinoId } });
    if (!cuentaDestino) throw new Error("Cuenta destino no encontrada");

    const saldoOrigen = new Prisma.Decimal(String(cuentaOrigen.saldo));
    if (saldoOrigen.lt(montoDec)) throw new Error("Saldo insuficiente en la cuenta origen");

    const nuevoSaldoOrigen = saldoOrigen.minus(montoDec);
    const saldoDestino = new Prisma.Decimal(String(cuentaDestino.saldo));
    const nuevoSaldoDestino = saldoDestino.plus(montoDec);

    await tx.cuentas.update({
      where: { id: origenId },
      data: { saldo: nuevoSaldoOrigen }
    });

    await tx.cuentas.update({
      where: { id: destinoId },
      data: { saldo: nuevoSaldoDestino }
    });

    const transferencia = await tx.transferencias.create({
      data: {
        cuenta_origen_id: origenId,
        cuenta_destino_id: destinoId,
        monto: montoDec
      }
    });

    // Opcional: insertar transacciones débito/credito
    await tx.transacciones.create({
      data: {
        cuenta_id: origenId,
        tipo: "debito",
        monto: montoDec
      }
    });

    await tx.transacciones.create({
      data: {
        cuenta_id: destinoId,
        tipo: "credito",
        monto: montoDec
      }
    });

    return transferencia;
  });
};

const obtenerTransferenciaPorId = async (id) => {
  const transferencia = await prisma.transferencias.findUnique({ where: { id: BigInt(id) } });
  return transferencia;
};

module.exports = {
  crearTransferencia,
  obtenerTransferenciaPorId
};
