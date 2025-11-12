# Enable PostgreSQL Remote Access Script
# Run this on your Windows desktop as Administrator

Write-Host "Enabling PostgreSQL Remote Access..." -ForegroundColor Green

# Find PostgreSQL data directory
$pgVersion = "16"
$possiblePaths = @(
    "C:\Program Files\PostgreSQL\$pgVersion\data",
    "C:\ProgramData\PostgreSQL\$pgVersion\data",
    "C:\PostgreSQL\$pgVersion\data"
)

$dataDir = $null
foreach ($path in $possiblePaths) {
    if (Test-Path "$path\postgresql.conf") {
        $dataDir = $path
        break
    }
}

if (-not $dataDir) {
    Write-Host "ERROR: Could not find PostgreSQL data directory" -ForegroundColor Red
    Write-Host "Please run this command and tell me the path:"
    Write-Host '& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -h localhost -U postgres -d fantasy_ai_local -c "SHOW data_directory;"'
    exit 1
}

Write-Host "Found PostgreSQL data directory: $dataDir" -ForegroundColor Cyan

# Backup original files
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
Copy-Item "$dataDir\postgresql.conf" "$dataDir\postgresql.conf.backup_$timestamp"
Copy-Item "$dataDir\pg_hba.conf" "$dataDir\pg_hba.conf.backup_$timestamp"
Write-Host "Created backups of config files" -ForegroundColor Yellow

# Update postgresql.conf
$postgresqlConf = Get-Content "$dataDir\postgresql.conf"
$listenFound = $false
$newConf = @()

foreach ($line in $postgresqlConf) {
    if ($line -match "^\s*#?\s*listen_addresses\s*=") {
        $newConf += "listen_addresses = '*'		# Enable remote connections"
        $listenFound = $true
    } else {
        $newConf += $line
    }
}

if (-not $listenFound) {
    # Add at the top if not found
    $newConf = @("listen_addresses = '*'		# Enable remote connections") + $newConf
}

$newConf | Out-File "$dataDir\postgresql.conf" -Encoding UTF8
Write-Host "Updated postgresql.conf" -ForegroundColor Green

# Update pg_hba.conf
$hbaConf = Get-Content "$dataDir\pg_hba.conf"
$remoteRuleExists = $hbaConf | Where-Object { $_ -match "192.168.1.0/24" }

if (-not $remoteRuleExists) {
    $hbaConf += ""
    $hbaConf += "# Allow remote connections from local network (added by script)"
    $hbaConf += "host    all             all             192.168.1.0/24          md5"
    $hbaConf += "host    all             all             0.0.0.0/0               md5"

    $hbaConf | Out-File "$dataDir\pg_hba.conf" -Encoding UTF8
    Write-Host "Updated pg_hba.conf" -ForegroundColor Green
} else {
    Write-Host "Remote access rules already exist in pg_hba.conf" -ForegroundColor Yellow
}

# Add Windows Firewall rule
Write-Host "Adding Windows Firewall rule..." -ForegroundColor Cyan
try {
    New-NetFirewallRule -DisplayName "PostgreSQL Remote Access" -Direction Inbound -Protocol TCP -LocalPort 5432 -Action Allow -ErrorAction SilentlyContinue
    Write-Host "Firewall rule added" -ForegroundColor Green
} catch {
    Write-Host "Firewall rule may already exist or need manual configuration" -ForegroundColor Yellow
}

# Restart PostgreSQL
Write-Host "Restarting PostgreSQL service..." -ForegroundColor Cyan
try {
    Restart-Service postgresql-x64-16 -ErrorAction Stop
    Write-Host "PostgreSQL restarted successfully!" -ForegroundColor Green
} catch {
    Write-Host "Could not restart automatically. Please restart manually:" -ForegroundColor Yellow
    Write-Host "Restart-Service postgresql-x64-16" -ForegroundColor White
}

Write-Host ""
Write-Host "===== SETUP COMPLETE =====" -ForegroundColor Green
Write-Host "Remote access is now enabled!"
Write-Host ""
Write-Host "IMPORTANT: Set a password for the postgres user:" -ForegroundColor Yellow
Write-Host '& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -h localhost -U postgres -d fantasy_ai_local -c "ALTER USER postgres WITH PASSWORD ''YourPasswordHere'';"' -ForegroundColor White
Write-Host ""
Write-Host "Then provide Claude with:" -ForegroundColor Cyan
Write-Host "  - IP: 192.168.1.249"
Write-Host "  - Database: fantasy_ai_local"
Write-Host "  - Username: postgres"
Write-Host "  - Password: (the password you just set)"
