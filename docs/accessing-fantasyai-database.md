# Accessing Your FantasyAI Database - Step-by-Step Guide

This guide will walk you through finding and accessing your local fantasyAI PostgreSQL database.

---

## Step 1: Check if PostgreSQL is Running on Your Desktop

Open a terminal on your **desktop** and run:

```bash
# Check if PostgreSQL is running
pg_isready
```

**Expected output:**
- ✅ If running: `/tmp:5432 - accepting connections`
- ❌ If not running: `no response`

### If PostgreSQL is NOT running:

**On macOS:**
```bash
brew services start postgresql
# OR
pg_ctl -D /usr/local/var/postgres start
```

**On Linux:**
```bash
sudo systemctl start postgresql
# OR
sudo service postgresql start
```

**On Windows:**
- Open Services app
- Find "PostgreSQL" service
- Click "Start"

---

## Step 2: List All Databases

Once PostgreSQL is running, list all databases to find fantasyAI:

```bash
# List all databases
psql -U postgres -c "\l"

# Or if postgres user doesn't work, try your username:
psql -U $USER -c "\l"

# Or just connect and then list:
psql postgres
\l
```

**Look for a database name like:**
- `fantasyai`
- `fantasy_ai`
- `sports_stats`
- `nba_stats`
- Or any database name you recognize

**📝 WRITE DOWN THE DATABASE NAME HERE:**
Database name: `___________________`

---

## Step 3: Connect to the Database

Once you find the database name, connect to it:

```bash
# Replace 'fantasyai' with your actual database name
psql -d fantasyai

# Or with username:
psql -U your_username -d fantasyai
```

**You should see a prompt like:**
```
fantasyai=#
```

---

## Step 4: List All Tables

Inside the database, list all tables to see what data exists:

```sql
-- List all tables
\dt

-- Or for more detail:
\dt+

-- To see tables in all schemas:
\dt *.*
```

**📝 WRITE DOWN THE TABLE NAMES:**
```
Tables found:
- _________________
- _________________
- _________________
```

---

## Step 5: Check Sample Data (Optional)

Let's peek at what data you have:

```sql
-- Example: If you have a 'players' table
SELECT * FROM players LIMIT 5;

-- Check row counts
SELECT
    'players' as table_name,
    COUNT(*) as row_count
FROM players;

-- List all sports if there's a sports table
SELECT DISTINCT sport FROM players;
-- OR
SELECT * FROM sports;
```

---

## Step 6: Export the Database Schema

Now let's export the schema so I can analyze it. **Exit psql first** (type `\q`), then run:

```bash
# Export JUST the schema (structure, no data)
pg_dump -U your_username -d fantasyai --schema-only > fantasyai_schema.sql

# This creates a file called 'fantasyai_schema.sql' in your current directory
```

**Check the file was created:**
```bash
ls -lh fantasyai_schema.sql
```

You should see the file size (hopefully several KB or MB).

---

## Step 7: Share the Schema File

Now we need to get this file to the NBA Draft Buddy project. You have a few options:

### Option A: Copy to NBA Draft Buddy Project

```bash
# Find where your nba-draft-buddy project is
# For example, if it's in ~/projects/nba-draft-buddy:

cp fantasyai_schema.sql ~/path/to/nba-draft-buddy/infrastructure/supabase/

# Or just move it to your home directory
cp fantasyai_schema.sql ~/fantasyai_schema.sql
```

### Option B: View and Copy Contents

```bash
# Display the contents
cat fantasyai_schema.sql

# Or open in an editor
code fantasyai_schema.sql
# OR
nano fantasyai_schema.sql
```

Then you can copy/paste the contents.

### Option C: Export to Text

```bash
# Show me just the table structure
psql -d fantasyai -c "\d+ players"
psql -d fantasyai -c "\d+ games"
psql -d fantasyai -c "\d+ stats"
# (replace with your actual table names)
```

---

## Step 8: Get Database Statistics

Let me see what you're working with:

```sql
-- Connect to the database
psql -d fantasyai

-- Run these queries and share the results:

-- 1. List all tables with row counts
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 2. Database size
SELECT pg_size_pretty(pg_database_size('fantasyai'));

-- 3. Sample data from main tables (example)
SELECT COUNT(*) as total_players FROM players;
SELECT COUNT(*) as total_games FROM games;
```

---

## Quick Reference: Common PostgreSQL Commands

Inside psql (after connecting with `psql -d fantasyai`):

| Command | Description |
|---------|-------------|
| `\l` | List all databases |
| `\dt` | List all tables |
| `\d tablename` | Describe table structure |
| `\du` | List users |
| `\q` | Quit/exit psql |
| `\?` | Help |
| `\i filename.sql` | Execute SQL file |

---

## Troubleshooting

### "psql: command not found"

PostgreSQL might not be installed or not in your PATH.

**Check if installed:**
```bash
# macOS
brew list | grep postgresql

# Linux
dpkg -l | grep postgresql

# Find psql binary
find /usr -name psql 2>/dev/null
```

### "FATAL: database does not exist"

The database name might be different. List all databases:
```bash
psql -U postgres -l
```

### "FATAL: Peer authentication failed"

Try with explicit host:
```bash
psql -h localhost -U postgres -d fantasyai
```

### Can't remember username

```bash
# Check current user
whoami

# Try connecting as current user
psql -d fantasyai

# Or try default postgres user
psql -U postgres -d fantasyai
```

---

## What to Send Me

After completing the steps above, please provide:

1. **Database name:** `_______________`
2. **Table names:** (from `\dt`)
3. **Schema file:** Either:
   - Upload `fantasyai_schema.sql`, OR
   - Copy/paste the contents, OR
   - Describe the main tables and columns

4. **Database stats:**
   - How many tables?
   - What sports are covered?
   - Approximate number of players/games?

---

## Next Steps

Once I have this information, I will:

✅ Analyze your existing schema
✅ Map fantasyAI tables to NBA Draft Buddy structure
✅ Create migration scripts
✅ Build connection layer for both databases
✅ Set up ML training data pipeline
✅ Ensure multi-sport compatibility

---

**Let's start with Step 1!**

Please open a terminal on your desktop and run:
```bash
pg_isready
```

What does it say?
