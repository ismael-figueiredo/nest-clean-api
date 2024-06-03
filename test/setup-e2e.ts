import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import 'dotenv/config'
import { execSync } from 'node:child_process'

const prisma = new PrismaClient()

function genereteUniqueDatabaseUrl(shemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide DATABASE_URL environment variable.')
  }
  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', shemaId)
  return url.toString()
}

const schemaId = randomUUID()
beforeAll(async () => {
  const databaseURL = genereteUniqueDatabaseUrl(schemaId)
  process.env.DATABASE_URL = databaseURL
  execSync('npx prisma migrate deploy')
})
afterAll(async () => {
  await prisma.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`
  )
  await prisma.$disconnect()
})
