# MySQL Workbench Setup

Connect Workbench to your server, then let **`npm run db:setup`** create everything from **your institute name** — no fixed `techacademy_crm` database or `admin123` passwords.

---

## Prerequisites

- MySQL Server **8.0+** running
- MySQL Workbench (optional — setup works from the terminal too)

```powershell
Get-Service -Name "MySQL*"
```

---

## Quick start (recommended)

### 1. Copy env template

```powershell
cd backend
copy .env.example .env
```

### 2. Run interactive setup

```powershell
npm install
npm run db:setup
```

You will be asked for:

| Prompt | Example | Notes |
|--------|---------|--------|
| **Institute name** | `Triton Academy` | Drives default database name → `triton_academy` |
| **Admin password** | *(you choose)* | Your login password — not hardcoded |
| **Admin email** | `admin@triton.local` | Press Enter for default |
| **MySQL root password** | *(your root pwd)* | One-time, to create DB + user |
| **Sample data?** | `Y` | Optional demo courses/students |

### 3. Use an existing schema (e.g. `triton`)

If you already created **triton** in Workbench, set in `.env` **before** `db:setup`:

```env
INSTITUTE_NAME=Triton
DATABASE_NAME=triton
```

Setup will use that schema name instead of generating one.

### 4. Start the API

```powershell
npm run dev
```

Login with **your** `ADMIN_EMAIL` and **your** `ADMIN_PASSWORD` from `.env`.

---

## What setup creates

| Item | Source |
|------|--------|
| Database name | `DATABASE_NAME` or slug from `INSTITUTE_NAME` |
| DB user + password | Generated (saved to `.env`) unless you set `DB_USER` / `DB_PASSWORD` |
| Tables | `sql/001_init.sql` |
| Institute profile | `INSTITUTE_NAME` in `institute_settings` |
| Admin account | `ADMIN_EMAIL` + bcrypt hash of `ADMIN_PASSWORD` |
| Sample rows | `seed_sample_data.sql` if you chose yes |
| `DATABASE_URL`, JWT secrets | Written to `.env` |

---

## Non-interactive setup (CI / scripting)

```env
INSTITUTE_NAME=Triton Academy
DATABASE_NAME=triton
ADMIN_EMAIL=admin@triton.local
ADMIN_PASSWORD=YourSecurePassword123
MYSQL_ROOT_PASSWORD=your_root_password
SEED_SAMPLE_DATA=false
SETUP_INTERACTIVE=false
```

```powershell
npm run db:setup
```

---

## Workbench: connect after setup

1. Connection name: anything (e.g. **SchoolManagementCRM**)
2. Host: `127.0.0.1`, port `3306`
3. User: value of `DB_USER` from `.env` (or `root` for admin tasks)
4. Default schema: value of `DATABASE_NAME` from `.env`

---

## Useful commands

| Command | Purpose |
|---------|---------|
| `npm run db:setup` | First-time institute + database setup |
| `npm run db:reset` | **Wipe and recreate** database (dev only — deletes all data) |
| `npm run db:reset-admin` | Apply new `ADMIN_PASSWORD` from `.env` |
| `npm run dev` | Start API |
| `npm run test:live` | Test API against your database |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Access denied for user | Re-run `npm run db:setup` or check `DATABASE_URL` in `.env` |
| Unknown database | Run `npm run db:setup` |
| Wrong login password | Set `ADMIN_PASSWORD` in `.env`, then `npm run db:reset-admin` |
| Want empty DB (no samples) | `SEED_SAMPLE_DATA=false` before setup |
| Schema out of date / migration errors | Add `MYSQL_ROOT_PASSWORD` to `.env`, then `npm run db:reset` |

---

## SQL files

| File | Role |
|------|------|
| `001_init.sql` | Table definitions (no fixed database name) |
| `seed_sample_data.sql` | Optional demo data only |
| `000_create_database.sql` | Legacy pointer — use `npm run db:setup` |
| `seed.sql` | Legacy pointer — use `npm run db:setup` |
