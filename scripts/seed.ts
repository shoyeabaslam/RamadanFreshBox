import pool, { closePool } from '../database/db/client'
import fs from 'node:fs'
import path from 'node:path'

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n')

  try {
    // Read seed file
    const seedPath = path.join(process.cwd(), 'database', '002_seed_data.sql')
    
    if (!fs.existsSync(seedPath)) {
      console.error('❌ Seed file not found:', seedPath)
      process.exit(1)
    }

    const seedSQL = fs.readFileSync(seedPath, 'utf-8')

    console.log('📄 Seed file loaded: 002_seed_data.sql')
    console.log('⚙️  Inserting data...\n')

    // Execute seed
    await pool.query(seedSQL)

    console.log('✅ Seeding completed successfully!')
    console.log('\n📊 Data summary:')
    
    // Show counts
    const tables = [
      { name: 'packages', label: 'Packages' },
      { name: 'fruits', label: 'Fruits' },
      { name: 'orders', label: 'Sample Orders' },
      { name: 'settings', label: 'Settings' },
      { name: 'transactions', label: 'Sample Transactions' },
    ]

    for (const table of tables) {
      try {
        const result = await pool.query(`SELECT COUNT(*) as count FROM ${table.name}`)
        const count = result.rows[0].count
        console.log(`   - ${table.label}: ${count} rows`)
      } catch {
        console.log(`   - ${table.label}: Table not found`)
      }
    }

    console.log('\n🎉 Database is ready for use!')
    console.log('💡 You can now start the development server with "npm run dev"\n')

    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed!')
    
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`)
      
      // Check common errors
      if (error.message.includes('duplicate key')) {
        console.error('\n⚠️  Data already exists!')
        console.error('💡 Database may already be seeded\n')
      } else if (error.message.includes('does not exist')) {
        console.error('\n⚠️  Tables not found!')
        console.error('💡 Run "npm run db:migrate" first\n')
      }
    }
    
    process.exit(1)
  } finally {
    await closePool()
  }
}

await seedDatabase()
