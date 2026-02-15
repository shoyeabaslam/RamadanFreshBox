# Database Scripts Usage Guide

## Prerequisites

1. **PostgreSQL** must be running
2. **Environment Variables** in `.env.local`:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/ramazan_fresh_box
   ```

## Available Scripts

### 1. Check Database Health
```bash
npm run db:check
```

**What it does:**
- ✅ Tests database connection
- ✅ Shows PostgreSQL version
- ✅ Lists all existing tables
- ✅ Shows row counts for key tables

**When to use:**
- Before running migration
- To verify database is accessible
- To check current database state

---

### 2. Run Migration
```bash
npm run db:migrate
```

**What it does:**
- ✅ Creates all database tables
- ✅ Creates ENUMs (order_type, order_status)
- ✅ Creates indexes for performance
- ✅ Sets up foreign keys

**When to use:**
- First time setup
- After fresh database creation

**Note:** Run only once. Will fail if tables already exist.

---

### 3. Seed Database
```bash
npm run db:seed
```

**What it does:**
- ✅ Inserts 3 packages (4, 6, 8 fruit boxes)
- ✅ Inserts 9 fruits
- ✅ Inserts 3 settings (cutoff times, limits)
- ✅ Inserts sample orders (self, donate, sponsor)
- ✅ Inserts sample transaction

**When to use:**
- After migration
- For development/testing
- To populate with sample data

**Note:** Will fail if data already exists (duplicate keys)

---

## Complete Setup Flow

```bash
# Step 1: Check if database is accessible
npm run db:check

# Step 2: Create tables and schema
npm run db:migrate

# Step 3: Insert sample data
npm run db:seed

# Step 4: Verify everything
npm run db:check

# Step 5: Start development
npm run dev
```

---

## Sample Data Included

### Packages
- 4 Fruit Iftar Box - ₹199
- 6 Fruit Iftar Box - ₹299
- 8 Fruit Iftar Box - ₹399

### Fruits
- Apple, Banana, Orange
- Grapes, Papaya, Pomegranate
- Watermelon, Musk Melon, Guava

### Settings
- self_cutoff_time: 18:00
- donate_cutoff_time: 16:00
- max_boxes_per_day: 100

### Sample Orders
- Self order (paid)
- Donate order (packing)
- Sponsor order (pending)

---

## Troubleshooting

### Error: "Connection refused"
- PostgreSQL is not running
- Check: `pg_isready` or start PostgreSQL

### Error: "Authentication failed"
- Wrong credentials in DATABASE_URL
- Check username/password

### Error: "Database does not exist"
- Create database first:
  ```sql
  CREATE DATABASE ramazan_fresh_box;
  ```

### Error: "Tables already exist"
- Tables are already created
- Skip migration or drop tables first

### Error: "Duplicate key"
- Data already seeded
- Check with `npm run db:check`

---

## Reset Database

To completely reset and start fresh:

```bash
# Option 1: Drop and recreate database (PostgreSQL CLI)
psql -U postgres
DROP DATABASE ramazan_fresh_box;
CREATE DATABASE ramazan_fresh_box;
\q

# Option 2: Drop all tables manually
# Then run migration and seed again
npm run db:migrate
npm run db:seed
```

---

## Production Deployment

For production:
1. ✅ Set DATABASE_URL environment variable
2. ✅ Run migration on production database
3. ❌ DO NOT run seed (contains sample data)
4. ✅ Use proper credentials management
5. ✅ Enable SSL/TLS for database connection

---

Created: February 15, 2026
Status: ✅ Ready to Use
