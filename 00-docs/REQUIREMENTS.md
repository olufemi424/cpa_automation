# CPA Automation Platform - Requirements

**Last Updated:** November 15, 2024
**Status:** Phase 2 In Progress

## Project Overview

**Goal:** Build an intelligent tax preparation automation platform that reduces filing time by 35% and missed deadlines by 90%.

**Target Users:**
- **CPA Firms:** Manage multiple clients, collaborate with team members
- **Tax Clients:** Upload documents, track progress, communicate with CPAs
- **Admin:** System configuration, user management, analytics

## Core Workflows

### 1. Client Onboarding (INTAKE)
- Client creates account or is invited by CPA
- Completes intake form (entity type, tax year, business info)
- System creates client record with status: INTAKE

### 2. Document Collection (INTAKE → PREPARATION)
- Client uploads tax documents (W-2, 1099s, receipts, etc.)
- AI classifies documents by type
- CPA verifies document completeness
- Status changes to PREPARATION when all required docs received

### 3. Tax Preparation (PREPARATION)
- CPA assigned to client reviews documents
- Creates tasks for data entry, calculations
- Moves client through workflow stages
- Tracks progress percentage

### 4. Review & Quality Check (REVIEW)
- Senior CPA or peer reviews prepared return
- Identifies issues, requests corrections
- Approves for filing when quality standards met

### 5. Filing & Completion (FILED → INVOICED)
- Return filed electronically or by mail
- Client notified of filing
- Invoice generated and sent
- Payment tracked

### 6. Communication Throughout
- In-app messaging between CPA and client
- AI-powered FAQ responses
- Email notifications for status changes
- Document upload confirmations

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL, -- ADMIN | CPA | CLIENT
    password_hash TEXT,
    image TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Accounts Table (Better Auth)
```sql
CREATE TABLE accounts (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    account_id TEXT NOT NULL, -- Equals user_id for credentials
    provider_id TEXT NOT NULL, -- 'credential' for email/password
    password TEXT, -- bcrypt hash
    access_token TEXT,
    refresh_token TEXT,
    expires_at BIGINT,
    UNIQUE(provider_id, account_id)
);
```

### Clients Table
```sql
CREATE TABLE clients (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id), -- Nullable for non-portal clients
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    entity_type TEXT NOT NULL, -- INDIVIDUAL | LLC | S_CORP | C_CORP | PARTNERSHIP | TRUST | OTHER
    tax_year INTEGER NOT NULL,
    status TEXT NOT NULL, -- INTAKE | PREPARATION | REVIEW | FILED | INVOICED | COMPLETED
    assigned_to_id UUID REFERENCES users(id), -- CPA assigned
    business_name TEXT,
    address TEXT,
    progress_percentage INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Documents Table
```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY,
    client_id UUID REFERENCES clients(id),
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT,
    file_type TEXT,
    document_type TEXT NOT NULL, -- W2 | 1099_MISC | 1099_NEC | 1099_INT | 1099_DIV | SCHEDULE_C | RECEIPT | INVOICE | STATEMENT | ID | OTHER
    is_verified BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP DEFAULT NOW()
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY,
    client_id UUID REFERENCES clients(id),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL, -- INTAKE | PREPARATION | REVIEW | FILED | INVOICED
    assigned_to_id UUID REFERENCES users(id),
    due_date TIMESTAMP,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Messages Table
```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY,
    client_id UUID REFERENCES clients(id),
    sender_id UUID REFERENCES users(id), -- Nullable for AI/system messages
    sender_type TEXT NOT NULL, -- USER | AI | SYSTEM
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Other Tables
- **session:** Better Auth session management
- **verification:** Email verification tokens
- **file_uploads:** Temporary file storage tracking
- **notifications:** User notification queue
- **audit_logs:** System activity tracking
- **ai_classifications:** Document AI classification results

## User Roles & Permissions

### ADMIN
- Full system access
- User management (create, edit, delete users)
- System configuration
- Analytics dashboard
- Audit log access

### CPA
- View assigned clients
- Update client status
- Upload/review documents
- Create tasks
- Send messages to clients
- Generate invoices
- View team analytics

### CLIENT
- View own profile
- Upload documents
- View task progress
- Send messages to assigned CPA
- View invoices
- Update contact information

## Functional Requirements

### FR-1: Authentication
- ✅ Email/password login (Better Auth)
- ✅ Session management (7-day expiry)
- ✅ Role-based access control
- ⏳ Password reset via email
- ⏳ Email verification for new accounts

### FR-2: Dashboard
- ✅ Three-panel layout (client list | workspace | chat)
- ✅ Client search and filtering
- ✅ Kanban board with 5 workflow stages
- ✅ Client selection across panels
- ✅ Error boundaries and error handling
- ✅ Loading states with spinners
- ✅ Custom hooks for data fetching
- ⏳ Drag-and-drop status updates
- ⏳ Real-time progress tracking

### FR-3: Client Management
- ✅ View all clients with assigned CPA
- ⏳ Create new client (onboarding form)
- ⏳ Edit client details
- ⏳ Archive completed clients
- ⏳ Client profile page with full history

### FR-4: Document Management
- ⏳ Drag-and-drop file upload
- ⏳ AI document classification
- ⏳ Document verification checklist
- ⏳ Document preview/download
- ⏳ Version history tracking

### FR-5: Task Management
- ⏳ Create tasks for clients
- ⏳ Assign tasks to CPAs
- ⏳ Set due dates and priorities
- ⏳ Task completion tracking
- ⏳ Automated task generation based on client type

### FR-6: Communication
- ⏳ In-app messaging (CPA ↔ Client)
- ⏳ Message templates for common scenarios
- ⏳ AI-powered FAQ responses
- ⏳ Email notifications
- ⏳ Message read receipts

### FR-7: Workflow Automation
- ⏳ Auto-advance clients when milestones met
- ⏳ Deadline reminders
- ⏳ Document completeness checks
- ⏳ Progress percentage calculation
- ⏳ Invoice generation on filing

### FR-8: Analytics & Reporting
- ⏳ CPA productivity metrics
- ⏳ Client pipeline visibility
- ⏳ Deadline adherence tracking
- ⏳ Revenue forecasting
- ⏳ Document processing statistics

## Non-Functional Requirements

### NFR-1: Performance
- Page load time < 2 seconds
- API response time < 500ms
- Support 100+ concurrent users
- Database queries optimized (no N+1)

### NFR-2: Security
- Password hashing with bcrypt (10 rounds)
- SQL injection prevention (Prisma ORM)
- XSS protection (React default escaping)
- CSRF token validation
- File upload virus scanning (future)

### NFR-3: Usability
- Mobile-responsive design
- Intuitive navigation
- Consistent color coding (status badges)
- Accessible (WCAG 2.1 Level AA)
- Keyboard shortcuts for power users

### NFR-4: Reliability
- 99% uptime target
- Database backups (daily)
- Error logging and monitoring
- Graceful error handling
- Session recovery

### NFR-5: Scalability
- Horizontal scaling capability
- Database connection pooling
- CDN for static assets
- Lazy loading for large lists
- Pagination for 50+ items

## API Endpoints (Implemented & Planned)

### Authentication
- `POST /api/auth/sign-in/email` - Login with email/password ✅
- `POST /api/auth/sign-up/email` - Register new user ⏳
- `POST /api/auth/sign-out` - Logout ✅
- `POST /api/auth/reset-password` - Request password reset ⏳

### Clients
- `GET /api/clients` - List all clients (with filters) ✅
  - ✅ Rate limiting (100 req/min)
  - ✅ Search by name/email
  - ✅ Filter by status
  - ✅ Error handling with proper responses
- `GET /api/clients/[id]` - Get client details ⏳
- `POST /api/clients` - Create new client ⏳
- `PATCH /api/clients/[id]` - Update client ⏳
- `DELETE /api/clients/[id]` - Archive client ⏳

### Documents
- `GET /api/clients/[id]/documents` - List client documents ⏳
- `POST /api/clients/[id]/documents` - Upload document ⏳
- `GET /api/documents/[id]` - Download document ⏳
- `PATCH /api/documents/[id]` - Update document metadata ⏳
- `DELETE /api/documents/[id]` - Delete document ⏳

### Tasks
- `GET /api/clients/[id]/tasks` - List client tasks ⏳
- `POST /api/clients/[id]/tasks` - Create task ⏳
- `PATCH /api/tasks/[id]` - Update task ⏳
- `DELETE /api/tasks/[id]` - Delete task ⏳

### Messages
- `GET /api/clients/[id]/messages` - Get message history ⏳
- `POST /api/clients/[id]/messages` - Send message ⏳
- `PATCH /api/messages/[id]/read` - Mark message as read ⏳

## Success Metrics

### User Adoption
- 80% of CPAs use platform daily within 30 days
- 60% of clients upload documents via portal (vs email)

### Efficiency Gains
- ↓35% average tax filing time (baseline: 8 hours → target: 5.2 hours)
- ↓90% missed deadlines (baseline: 20% → target: 2%)
- ↑50% client satisfaction scores

### Technical Metrics
- <500ms API response time (p95)
- <2s page load time
- 99% uptime
- Zero security incidents

## Future Enhancements (Post-POC)

### Phase 3: Integrations
- QuickBooks Online integration
- IRS e-file API
- DocuSign for client signatures
- Stripe for payment processing

### Phase 4: AI Features
- Automated data extraction from PDFs
- Tax optimization recommendations
- Predictive deadline alerts
- Smart document classification

### Phase 5: Advanced Features
- Multi-firm collaboration
- White-label branding
- Mobile apps (iOS/Android)
- Advanced reporting suite

---

**Status Legend:**
- ✅ Implemented and tested
- 🔄 In progress
- ⏳ Planned (not started)
- ❌ Deprioritized/cancelled
