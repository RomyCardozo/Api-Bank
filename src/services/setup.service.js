const prisma = require("../utils/prisma");
const { Prisma } = require("@prisma/client");

const crearDataset = async (cantidad = 10) => {
  // cantidad representa el número de clientes a crear
  const clientes = Number(cantidad) || 10;

  // Crear tipos de cuenta básicos si no existen
  const tipos = [
    { nombre: "Ahorros", descripcion: "Cuenta de ahorros" },
    { nombre: "Corriente", descripcion: "Cuenta corriente" }
  ];

  for (const t of tipos) {
    const exists = await prisma.tipos_cuenta.findFirst({ where: { nombre: t.nombre } });
    if (!exists) {
      await prisma.tipos_cuenta.create({ data: t });
    }
  }

  const tiposAll = await prisma.tipos_cuenta.findMany();

  const created = { clientes: [], cuentas: [] };
  const saldo_inicial = new Prisma.Decimal("1000.00");

  for (let i = 0; i < clientes; i++) {
    const cliente = await prisma.clientes.create({ data: { nombre: `Cliente ${Date.now()}_${i}`, email: `cliente${Date.now()}_${i}@test.local` } });
    created.clientes.push(cliente);

    // generar entre 1 y 3 cuentas por cliente (aleatorio)
    const cuentasPorCliente = Math.floor(Math.random() * 3) + 1; // 1..3
    for (let j = 0; j < cuentasPorCliente; j++) {
      const tipo = tiposAll[(i + j) % tiposAll.length];
      const numero = `${Date.now()}${i}${j}`.slice(0, 20);
      const cuenta = await prisma.cuentas.create({
        data: {
          cliente_id: cliente.id,
          tipo_cuenta_id: tipo.id,
          numero_cuenta: numero,
          saldo: saldo_inicial
        }
      });
      created.cuentas.push(cuenta);
    }
  }

  return created;
};

module.exports = { crearDataset };
