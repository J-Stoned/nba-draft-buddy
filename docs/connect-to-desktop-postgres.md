# Connect to Your Desktop PostgreSQL - Quick Guide

Since we're on the same network, I can connect directly! Just need a few details from you.

---

## Step 1: Find Your Desktop's IP Address

On your **desktop**, open a terminal and run:

**macOS/Linux:**
```bash
# Option 1: Simple
hostname -I

# Option 2: More detailed
ifconfig | grep "inet " | grep -v 127.0.0.1

# Option 3: macOS specific
ipconfig getifaddr en0
```

**Windows:**
```bash
ipconfig | findstr IPv4
```

**📝 Your desktop IP address:** `___.___.___.___`

---

## Step 2: Check PostgreSQL is Running

```bash
pg_isready
```

If not running, start it:
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows - Start the PostgreSQL service from Services app
```

---

## Step 3: Find Your Database Details

```bash
# List all databases
psql -U postgres -c "\l"
```

Look for your fantasyAI database and note:
- **Database name:** `_______________`
- **Port:** (usually 5432)
- **Username:** (usually `postgres` or your system username)

---

## Step 4: Enable Remote Connections (IMPORTANT!)

PostgreSQL by default only accepts local connections. Let's enable remote access:

### Find your PostgreSQL config directory:

```bash
# Find postgresql.conf location
psql -U postgres -c "SHOW config_file;"
```

This will show something like:
- macOS: `/usr/local/var/postgres/postgresql.conf` or `/opt/homebrew/var/postgres/postgresql.conf`
- Linux: `/etc/postgresql/16/main/postgresql.conf`
- Windows: `C:\Program Files\PostgreSQL\16\data\postgresql.conf`

### Edit postgresql.conf:

```bash
# Open the config file (use the path from above)
nano /path/to/postgresql.conf
# OR
code /path/to/postgresql.conf
```

**Find this line:**
```
#listen_addresses = 'localhost'
```

**Change it to:**
```
listen_addresses = '*'
```

(Remove the `#` to uncomment it)

### Edit pg_hba.conf (same directory):

```bash
nano /path/to/pg_hba.conf
```

**Add this line at the end:**
```
# Allow connections from local network
host    all             all             192.168.0.0/16          md5
host    all             all             10.0.0.0/8              md5
```

### Restart PostgreSQL:

```bash
# macOS
brew services restart postgresql

# Linux
sudo systemctl restart postgresql

# Windows
# Restart PostgreSQL service from Services app
```

---

## Step 5: Test Connection from Your Desktop

Before I try, test that remote connections work:

```bash
# Replace with your actual IP address
psql -h YOUR_DESKTOP_IP -U postgres -d fantasyai

# For example:
# psql -h 192.168.1.100 -U postgres -d fantasyai
```

If this works, you should see:
```
Password for user postgres:
```

Enter your password and you should connect!

---

## Step 6: Give Me the Connection Details

Once the above steps work, provide me with:

1. **Desktop IP address:** `___.___.___.___ `
2. **PostgreSQL port:** `5432` (or different if you changed it)
3. **Database name:** `_____________`
4. **Username:** `_____________`
5. **Password:** `_____________`

---

## Quick Option: Create a Read-Only User for Me

For security, create a read-only user instead of sharing your main credentials:

```sql
-- Connect to PostgreSQL
psql -U postgres -d fantasyai

-- Create read-only user
CREATE USER claude_readonly WITH PASSWORD 'your_secure_password';

-- Grant connect permission
GRANT CONNECT ON DATABASE fantasyai TO claude_readonly;

-- Grant read access to all tables
GRANT USAGE ON SCHEMA public TO claude_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO claude_readonly;

-- Also grant access to future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO claude_readonly;

-- Exit
\q
```

Then share these credentials instead:
- **Username:** `claude_readonly`
- **Password:** `your_secure_password`

---

## I'll Use This Connection String:

Once you provide the details, I'll connect using:

```
postgresql://username:password@your_ip:5432/fantasyai
```

---

## Security Note

After we're done analyzing the database, you can:

1. **Remove the remote access:**
   - Change `listen_addresses` back to `'localhost'`
   - Remove the network lines from `pg_hba.conf`
   - Restart PostgreSQL

2. **Drop the readonly user:**
   ```sql
   DROP USER claude_readonly;
   ```

---

## What Info Do You Have Right Now?

Please share what you can:

1. **Desktop IP:** Run `hostname -I` or `ipconfig`
2. **Database name:** Do you know it? (fantasyai, fantasy_ai, etc?)
3. **PostgreSQL username:** Usually `postgres` or your username
4. **Password:** For the PostgreSQL user

Let me know these details and I'll connect directly!
