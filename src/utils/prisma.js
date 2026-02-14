const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require("@prisma/adapter-pg")
const { Pool } = require('pg')


// Configuración de la conexión a la base de datos

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})


const adapter = new PrismaPg(pool)


const prisma = new PrismaClient({
    adapter
});


module.exports = prisma;