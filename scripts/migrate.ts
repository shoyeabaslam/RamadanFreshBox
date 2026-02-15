import pool, { closePool } from '../database/db/client'
import fs from 'node:fs'
import path from 'node:path'

async function runMigration() {
  console.log('🚀 Starting database migration...\n')

  try {
    // Read migration file
    const migrationPath = path.join(process.cwd(), 'database', '001_initial_schema.sql')
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Migration file not found:', migrationPath)
      process.exit(1)
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')

    console.log('📄 Migration file loaded: 001_initial_schema.sql')
    console.log('⚙️  Executing migration...\n')

    // Execute migration
    await pool.query(migrationSQL)

    console.log('✅ Migration completed successfully!')
    console.log('\n📋 Created tables:')
    
    // List created tables
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `)

    tablesResult.rows.forEach((row: { table_name: string }) => {
      console.log(`   - ${row.table_name}`)
    })

    console.log('\n🎉 Database schema is ready!')
    console.log('💡 Run "npm run db:seed" to populate with sample data\n')

    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed!')
    
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`)
      
      // Check if tables already exist
      if (error.message.includes('already exists')) {
        console.error('\n⚠️  Tables already exist!')
        console.error('💡 If you want to reset:')
        console.error('   1. Drop all tables manually, or')
        console.error('   2. Drop and recreate the database\n')
      }
    }
    
    process.exit(1)
  } finally {
    await closePool()
  }
}

await runMigration()
