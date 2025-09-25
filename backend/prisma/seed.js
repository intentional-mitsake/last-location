//this took a while to fix
//had to change the import path for prisma client
//must use this exact path for prisma client in all files where it is imported
//import { PrismaClient } from '@prisma/client' this causes issues 

import { PrismaClient } from '../generated/prisma/index.js'
import { readFileSync } from 'fs'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Seeding the database...');
    const data = JSON.parse(readFileSync('./test.json', 'utf-8'));
    console.log('Data loaded. Inserting', data.users.length, 'users...');
    for (const user of data.users) {
      await prisma.user.create({ data: user })
    }
    for (const location of data.locations) {
      await prisma.location.create({ data: location })
    }
    for (const request of data.requests) {
      await prisma.requests.create({ data: request })
    }
    for (const log of data.logs) {
      await prisma.log.create({ data: log });
    }
    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()