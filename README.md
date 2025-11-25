# CPA Automation Platform

Intelligent tax preparation automation platform built with Next.js, Prisma, PostgreSQL, and Better Auth.

## 🚀 Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- Git

### One-Command Setup

```bash
# Clone the repository (if not already done)
git clone https://github.com/olufemi424/cpa_automation.git
cd cpa_automation

# Copy environment file
cp .env.example .env

# Start everything with Docker Compose
docker compose up -d

# Wait ~30 seconds for database initialization, then access:
# - Application: http://localhost:3000
# - PgAdmin: http://localhost:8081
```

### What Gets Started

The `docker compose up` command starts:

1. **PostgreSQL Database** (port 5432)
   - Automatically initialized with schema and seed data
   - 15 pre-seeded users (1 admin, 3 CPAs, 11 clients)

2. **Redis** (port 6379)
   - For caching and session management

3. **Next.js Application** (port 3000)
   - Full-stack app with API routes
   - Connected to database automatically

4. **PgAdmin** (port 8081, optional)
   - Database management UI
   - Login: `admin@admin.com` / `admin`

## 📝 Default Login Credentials

After the containers start, you can log in with:

**Admin:**
- Email: `admin@cpacommand.com`
- Password: `password123`

**CPA:**
- Email: `sarah.cpa@cpacommand.com`
- Password: `password123`

**Client:**
- Email: `john.doe@example.com`
- Password: `password123`

## 🛠️ Docker Commands

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f app

# Stop all services
docker compose down

# Stop and remove all data (clean slate)
docker compose down -v

# Rebuild after code changes
docker compose up -d --build

# Check service status
docker compose ps

# Access app container shell
docker compose exec app sh

# Access database
docker compose exec postgres psql -U boilerplatedb_admin -d cpa_automation_db
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│  Next.js App (localhost:3000)           │
│  - Dashboard UI                         │
│  - API Routes                           │
│  - Better Auth                          │
└────────────┬────────────────────────────┘
             │
             ├──► PostgreSQL (localhost:5432)
             │    - 13 tables
             │    - Seeded with test data
             │
             └──► Redis (localhost:6379)
                  - Session storage
                  - Caching
```

## 📚 Documentation

All documentation is in the `00-docs/` folder:

- **[INDEX.md](./00-docs/INDEX.md)** - Quick reference guide
- **[REQUIREMENTS.md](./00-docs/REQUIREMENTS.md)** - Complete specifications
- **[TASKS.md](./00-docs/TASKS.md)** - Development task list
- **[IMPLEMENTATION_PLAN.md](./00-docs/IMPLEMENTATION_PLAN.md)** - 6-phase roadmap
- **[.github/copilot-instructions.md](./.github/copilot-instructions.md)** - AI coding guidelines

## 🔧 Local Development (Without Docker)

If you prefer to run without Docker:

```bash
# Install dependencies
cd app
npm install

# Start local PostgreSQL (you need PostgreSQL installed)
# Update app/.env with your local database credentials

# Run database migrations
npm run prisma:generate
npm run prisma:migrate:dev

# Start development server
npm run dev
```

Access at http://localhost:3000

## 🧪 Health Check

Check if the application is running:

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-11-15T...",
  "database": "connected"
}
```

## 📦 Project Structure

```
cpa-automation/
├── docker-compose.yml          # Main Docker setup
├── .env.example               # Environment template
├── 00-docs/                   # Documentation
├── .github/                   # GitHub config & AI instructions
└── app/                       # Next.js application
    ├── Dockerfile            # App container config
    ├── src/                  # Application code
    ├── prisma/               # Database schema
    └── scripts/              # Database init scripts
```

## 🔐 Security Notes

**For Production:**

1. Change `BETTER_AUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

2. Update database credentials in `.env`

3. Use environment-specific URLs

4. Enable HTTPS/SSL

5. Review and update CORS settings

## 🐛 Troubleshooting

### Database won't connect
```bash
# Check if PostgreSQL is ready
docker compose logs postgres

# Wait for initialization (can take 30 seconds on first run)
```

### App shows errors
```bash
# Check app logs
docker compose logs app

# Verify health endpoint
curl http://localhost:3000/api/health
```

### Port already in use
```bash
# Check what's using the ports
lsof -ti:3000  # App
lsof -ti:5432  # PostgreSQL
lsof -ti:6379  # Redis

# Stop conflicting services or change ports in docker-compose.yml
```

### Clean start (nuclear option)
```bash
docker compose down -v
docker system prune -a --volumes
docker compose up -d --build
```

## 📈 Current Status

**Phase 1:** ✅ Complete - Foundation & Authentication
**Phase 2:** 🔄 In Progress (15% complete) - Core Features
- ✅ Dashboard layout
- ✅ Client list with search
- ✅ Kanban board
- ⏳ Drag-and-drop
- ⏳ Document upload
- ⏳ Communication hub

See [TASKS.md](./00-docs/TASKS.md) for detailed progress.

## 🤝 Contributing

1. Read [copilot-instructions.md](./.github/copilot-instructions.md) for coding standards
2. Check [TASKS.md](./00-docs/TASKS.md) for available tasks
3. Follow the task workflow documented in copilot-instructions.md

## 📄 License

Private - Proprietary Software

## 🆘 Support

For issues or questions:
1. Check documentation in `00-docs/`
2. Review health check: `curl http://localhost:3000/api/health`
3. Check Docker logs: `docker compose logs -f`

---

**Built with:** Next.js 16 • React 19 • TypeScript • Prisma • PostgreSQL • Better Auth • Tailwind CSS • TanStack Query
