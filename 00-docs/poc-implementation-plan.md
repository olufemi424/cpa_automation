# CPA Command Center - POC Implementation Plan

## 🎯 POC Objective

Build a functional proof-of-concept that demonstrates the core automation capabilities of the CPA Command Center using TanStack, TypeScript, PostgreSQL, Prisma, and Better Auth with mocked external services.

---

## 📋 Tech Stack

- **Frontend**: React + TanStack Router + TanStack Query + TanStack Table
- **Backend**: Next.js API Routes (or tRPC)
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: Better Auth
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Charts**: Recharts
- **Deployment**: Vercel

---

## 🗂️ Phase 1: Project Foundation & Setup

### Step 1.1: Initialize Project Structure
**Duration**: 2-3 hours

**Tasks**:
- [ ] Create new Next.js project with TypeScript
  ```bash
  npx create-next-app@latest cpa-command-center --typescript --tailwind --app
  ```
- [ ] Install core dependencies
  ```bash
  npm install @tanstack/react-query @tanstack/react-router @tanstack/react-table
  npm install @prisma/client prisma
  npm install better-auth
  npm install zod react-hook-form @hookform/resolvers
  npm install recharts lucide-react
  ```
- [ ] Set up project folder structure:
  ```
  /src
    /app
      /api
      /dashboard
      /auth
    /components
      /clients
      /tasks
      /documents
      /chat
      /ui
    /lib
      /db
      /auth
      /mock
    /types
  /prisma
    schema.prisma
    seed.ts
  ```
- [ ] Create `.env` file with database connection string
- [ ] Initialize Git repository and create `.gitignore`

**Deliverables**: 
- Working Next.js app with all dependencies installed
- Organized folder structure
- Git repository initialized

---

### Step 1.2: Configure Prisma & Database Schema
**Duration**: 3-4 hours

**Tasks**:
- [ ] Initialize Prisma
  ```bash
  npx prisma init
  ```
- [ ] Design and implement Prisma schema with the following models:
  - **User** (id, email, password, name, role: ADMIN/CPA/CLIENT)
  - **Client** (id, name, email, phone, entityType, taxYear, status, assignedToId, createdAt, updatedAt)
  - **Document** (id, clientId, fileName, fileUrl, fileType, documentType: W2/1099/RECEIPT/OTHER, uploadedAt)
  - **Task** (id, clientId, title, description, status: INTAKE/PREPARATION/REVIEW/FILED/INVOICED, assignedToId, dueDate, createdAt, updatedAt)
  - **Message** (id, clientId, senderId, content, isAI, createdAt)
  - **TimeLog** (id, taskId, userId, hours, description, loggedAt)
  - **Invoice** (id, clientId, amount, status: PENDING/PAID, dueDate, paidAt, createdAt)

- [ ] Define relationships between models
- [ ] Run initial migration
  ```bash
  npx prisma migrate dev --name init
  ```
- [ ] Generate Prisma Client
  ```bash
  npx prisma generate
  ```

**Deliverables**:
- Complete `schema.prisma` file
- Database migrations created
- Prisma Client generated

---

### Step 1.3: Setup Better Auth
**Duration**: 2-3 hours

**Tasks**:
- [ ] Configure Better Auth with email/password provider
- [ ] Create auth configuration file (`/src/lib/auth/config.ts`)
- [ ] Set up role-based access control (ADMIN, CPA, CLIENT)
- [ ] Create auth API routes (`/api/auth/[...auth]`)
- [ ] Implement auth context provider
- [ ] Create protected route wrapper component
- [ ] Build login page (`/app/auth/login/page.tsx`)
- [ ] Build registration page (`/app/auth/register/page.tsx`)
- [ ] Add password hashing and session management

**Deliverables**:
- Working authentication system
- Login/Register pages
- Protected routes implementation
- Session management

---

### Step 1.4: Create Seed Data & Mock Utilities
**Duration**: 2-3 hours

**Tasks**:
- [ ] Create seed script (`/prisma/seed.ts`) with:
  - 3 admin/CPA users
  - 15 mock clients (3 in each workflow stage)
  - 30+ mock documents (various types)
  - 20+ mock tasks
  - Sample messages and time logs
  - Sample invoices

- [ ] Create mock data utilities (`/src/lib/mock/`):
  - `mockAIResponses.ts` - FAQ question-answer pairs
  - `mockOCR.ts` - Document type detection logic
  - `mockEmailService.ts` - Email notification logger
  - `mockPaymentService.ts` - Payment processing simulator

- [ ] Run seed script
  ```bash
  npx prisma db seed
  ```

**Deliverables**:
- Populated database with realistic test data
- Mock service utilities for external integrations
- Documented seed data structure

---

## 🏗️ Phase 2: Core Features Development

### Step 2.1: Build Client Onboarding System
**Duration**: 4-5 hours

**Tasks**:
- [ ] Create onboarding form component (`/components/clients/ClientOnboardingForm.tsx`)
  - Personal info fields (name, email, phone)
  - Entity type selector (Individual, LLC, S-Corp, C-Corp)
  - Tax year selector
  - Form validation with Zod schema

- [ ] Build document upload component (`/components/documents/DocumentUpload.tsx`)
  - Drag-and-drop file upload UI
  - File type validation (PDF, PNG, JPG)
  - Multiple file selection
  - Upload progress indicator
  - Preview uploaded files

- [ ] Implement mock document classification
  - Auto-detect document type based on filename/content
  - Tag documents (W-2, 1099, Receipt, etc.)
  - Store metadata in database

- [ ] Create API routes:
  - `POST /api/clients` - Create new client
  - `POST /api/clients/[id]/documents` - Upload documents
  - `GET /api/clients/[id]` - Get client details
  - `GET /api/clients` - List all clients

- [ ] Build client invite system
  - Generate invite links
  - Email template (mocked)
  - Track invitation status

**Deliverables**:
- Complete onboarding flow
- Document upload with mock classification
- Client management API
- Client list view

---

### Step 2.2: Implement Task Management & Kanban Board
**Duration**: 5-6 hours

**Tasks**:
- [ ] Create Kanban board component (`/components/tasks/TaskBoard.tsx`)
  - 5 columns: Intake → Preparation → Review → Filed → Invoiced
  - Drag-and-drop functionality (react-beautiful-dnd or @dnd-kit)
  - Client cards showing key info
  - Status indicators and progress badges

- [ ] Build task detail modal/drawer
  - Task information display
  - Assigned staff member
  - Due date with countdown
  - Notes and attachments
  - Time tracking widget

- [ ] Implement task CRUD operations
  - Create new tasks
  - Update task status (drag-drop or manual)
  - Assign tasks to team members
  - Set/update due dates
  - Add task notes

- [ ] Create API routes:
  - `GET /api/tasks` - List all tasks with filters
  - `POST /api/tasks` - Create new task
  - `PATCH /api/tasks/[id]` - Update task
  - `DELETE /api/tasks/[id]` - Delete task
  - `PATCH /api/tasks/[id]/status` - Update status

- [ ] Add automated reminders (mocked)
  - Check overdue tasks
  - Generate reminder notifications
  - Log reminders to console

- [ ] Build staff assignment UI
  - Dropdown to assign clients/tasks to staff
  - Workload indicator per staff member
  - Reassignment functionality

**Deliverables**:
- Functional Kanban board with drag-drop
- Task management system
- Staff assignment features
- Mock automated reminders

---

### Step 2.3: Develop Communication Hub
**Duration**: 4-5 hours

**Tasks**:
- [ ] Create chat panel component (`/components/chat/ChatPanel.tsx`)
  - Message thread display
  - Input field with send button
  - Timestamp and sender info
  - Auto-scroll to latest message

- [ ] Build AI FAQ bot
  - Create mock AI response system
  - Predefined Q&A pairs (IRS-related questions)
  - Pattern matching for common questions
  - Fallback responses
  - "Ask AI" button/toggle

- [ ] Implement message templates
  - Create template management UI
  - Common message templates (status updates, reminders, requests)
  - Template variables (client name, deadline, etc.)
  - Quick insert functionality

- [ ] Create API routes:
  - `GET /api/messages/[clientId]` - Get message history
  - `POST /api/messages` - Send new message
  - `POST /api/messages/ai` - Get AI response
  - `GET /api/templates` - Get message templates
  - `POST /api/templates` - Create template

- [ ] Build notification system (mocked)
  - Status update notifications
  - New message alerts
  - Deadline reminders
  - Console log for email/SMS notifications

- [ ] Add real-time updates (TanStack Query polling)
  - Poll for new messages every 5-10 seconds
  - Optimistic updates for sent messages
  - Unread message counter

**Deliverables**:
- Working chat interface
- AI FAQ bot with mock responses
- Message template system
- Mock notification system

---

### Step 2.4: Build Client & Staff Dashboard
**Duration**: 4-5 hours

**Tasks**:
- [ ] Create main dashboard layout (`/app/dashboard/page.tsx`)
  - Navigation sidebar (Clients, Tasks, Messages, Reports)
  - Client list panel
  - Main workspace panel
  - Chat panel (collapsible)

- [ ] Build client list component (`/components/clients/ClientList.tsx`)
  - Searchable/filterable list
  - Client status badges
  - Quick view details
  - Click to select client

- [ ] Create client overview panel (`/components/clients/ClientOverview.tsx`)
  - Client information summary
  - Document checklist with status icons
  - Progress bar (% complete)
  - Assigned staff member
  - Next deadline
  - Quick actions (upload, message, update status)

- [ ] Build deadline calendar view (`/components/calendar/DeadlineCalendar.tsx`)
  - Month/week view
  - Deadline markers
  - Color-coded by urgency
  - Click to view client details

- [ ] Implement staff workload indicator
  - Active client count per staff
  - Task distribution visualization
  - Overdue task alerts

- [ ] Create API routes:
  - `GET /api/dashboard/stats` - Dashboard statistics
  - `GET /api/dashboard/deadlines` - Upcoming deadlines
  - `GET /api/staff/workload` - Staff workload data

**Deliverables**:
- Complete dashboard UI matching wireframe
- Client management interface
- Calendar view with deadlines
- Staff workload visualization

---

## 📊 Phase 3: Analytics & Reporting

### Step 3.1: Build Analytics Dashboard
**Duration**: 3-4 hours

**Tasks**:
- [ ] Create analytics page (`/app/dashboard/reports/page.tsx`)
- [ ] Build key metric cards
  - Total clients by status
  - Returns filed this week/month
  - Average processing time
  - Revenue summary (from invoices)
  - Outstanding invoices

- [ ] Implement chart components using Recharts:
  - Returns completed per week (line/bar chart)
  - Revenue trend over time (line chart)
  - Client type distribution (pie/donut chart)
  - Task completion rate (bar chart)
  - Staff productivity (bar chart)

- [ ] Add filter controls
  - Date range picker
  - Staff member filter
  - Client type filter
  - Status filter

- [ ] Create API routes:
  - `GET /api/analytics/overview` - Overview statistics
  - `GET /api/analytics/clients` - Client analytics
  - `GET /api/analytics/revenue` - Revenue analytics
  - `GET /api/analytics/tasks` - Task analytics

- [ ] Implement CSV export (mocked)
  - Export button
  - Generate CSV data
  - Download trigger
  - Console log for QuickBooks integration

**Deliverables**:
- Analytics dashboard with charts
- Key performance metrics
- Filter and export functionality

---

## 💰 Phase 4: Billing & Time Tracking (Basic)

### Step 4.1: Implement Time Tracking & Billing
**Duration**: 3-4 hours

**Tasks**:
- [ ] Create time tracking widget (`/components/billing/TimeTracker.tsx`)
  - Start/stop timer
  - Manual time entry
  - Task association
  - Description field
  - Time log history

- [ ] Build invoice generation (mocked)
  - Auto-generate invoice when task status → INVOICED
  - Calculate total from time logs
  - Invoice preview component
  - PDF generation (mocked with console log)

- [ ] Create billing summary component (`/components/billing/BillingSummary.tsx`)
  - Outstanding invoices
  - Paid invoices
  - Total revenue
  - Payment history per client

- [ ] Implement payment flow (mocked)
  - Payment form UI
  - Mock Stripe integration
  - Payment confirmation
  - Update invoice status

- [ ] Create API routes:
  - `POST /api/time-logs` - Log time
  - `GET /api/time-logs/[taskId]` - Get task time logs
  - `POST /api/invoices` - Create invoice
  - `GET /api/invoices` - List invoices
  - `PATCH /api/invoices/[id]/pay` - Mark invoice as paid

**Deliverables**:
- Time tracking system
- Invoice generation (mocked)
- Payment processing UI (mocked)
- Billing summary views

---

## 🎨 Phase 5: UI/UX Polish & Testing

### Step 5.1: UI Refinement
**Duration**: 2-3 hours

**Tasks**:
- [ ] Implement consistent styling with Tailwind
- [ ] Add loading states and skeletons
- [ ] Implement error boundaries and error messages
- [ ] Add toast notifications for actions
- [ ] Improve responsive design for mobile/tablet
- [ ] Add smooth transitions and animations
- [ ] Implement dark mode toggle (optional)
- [ ] Add helpful tooltips and hints
- [ ] Create empty states for lists/tables
- [ ] Polish form validation feedback

**Deliverables**:
- Polished, consistent UI
- Responsive design
- Better user feedback mechanisms

---

### Step 5.2: Testing & Bug Fixes
**Duration**: 3-4 hours

**Tasks**:
- [ ] Test all user flows end-to-end:
  - Client onboarding → Document upload → Task creation
  - Task workflow progression through all stages
  - Chat and AI FAQ interactions
  - Time tracking and invoice generation
  - Dashboard and analytics views

- [ ] Test with seed data:
  - Different user roles (Admin, CPA, Client)
  - Multiple clients in different stages
  - Edge cases (no documents, overdue tasks, etc.)

- [ ] Fix identified bugs and issues
- [ ] Verify all API routes work correctly
- [ ] Test TanStack Query caching behavior
- [ ] Validate form submissions and error handling
- [ ] Check authentication and authorization
- [ ] Test database queries for performance

**Deliverables**:
- Bug-free POC
- Documented known limitations
- Test coverage report

---

## 🚀 Phase 6: Deployment & Documentation

### Step 6.1: Prepare for Deployment
**Duration**: 2-3 hours

**Tasks**:
- [ ] Set up PostgreSQL database on Railway/Supabase/Neon
- [ ] Configure environment variables for production
- [ ] Run Prisma migrations on production database
- [ ] Seed production database with demo data
- [ ] Configure Better Auth for production domain
- [ ] Set up Vercel project
- [ ] Configure build settings
- [ ] Test production build locally

**Deliverables**:
- Production database configured
- Environment variables set
- Production build tested

---

### Step 6.2: Deploy & Document
**Duration**: 2-3 hours

**Tasks**:
- [ ] Deploy to Vercel
  ```bash
  vercel --prod
  ```
- [ ] Verify deployment works correctly
- [ ] Test all features in production
- [ ] Create comprehensive README.md:
  - Project overview
  - Tech stack documentation
  - Setup instructions (local development)
  - Environment variables guide
  - Database setup and seeding
  - API endpoints documentation
  - Mock services explanation
  - Deployment guide
  - Known limitations and future enhancements

- [ ] Document API endpoints (optional: use Swagger/OpenAPI)
- [ ] Create demo user credentials
- [ ] Record demo video or screenshots (optional)
- [ ] Create handoff document for full implementation

**Deliverables**:
- Deployed POC on Vercel
- Comprehensive documentation
- Demo credentials
- Implementation handoff guide

---

## 📈 Success Criteria

### POC Must Demonstrate:

✅ **Authentication & Authorization**
- Users can register/login
- Role-based access control works
- Sessions are managed properly

✅ **Client Onboarding**
- New clients can be added
- Documents can be uploaded
- Auto-tagging works (mocked)

✅ **Task Management**
- Kanban board displays clients by status
- Tasks can be created and updated
- Drag-drop changes task status
- Staff can be assigned

✅ **Communication**
- Chat interface works
- AI FAQ responds to questions (mocked)
- Message templates can be used
- Notifications are triggered (mocked)

✅ **Analytics**
- Dashboard shows key metrics
- Charts display data correctly
- Filters work as expected

✅ **Billing (Basic)**
- Time can be tracked
- Invoices can be generated (mocked)
- Payment flow exists (mocked)

---

## ⏱️ Estimated Timeline

| Phase | Duration | Target Completion |
|-------|----------|-------------------|
| Phase 1: Foundation | 10-13 hours | Week 1 |
| Phase 2: Core Features | 17-21 hours | Week 2-3 |
| Phase 3: Analytics | 3-4 hours | Week 3 |
| Phase 4: Billing | 3-4 hours | Week 3 |
| Phase 5: Polish & Testing | 5-7 hours | Week 4 |
| Phase 6: Deployment | 4-6 hours | Week 4 |
| **Total** | **42-55 hours** | **4 weeks** |

---

## 🔄 Post-POC Path to Full Implementation

### Immediate Next Steps After POC Validation:

1. **Replace Mock Services with Real Integrations**
   - Integrate actual OCR service (Google Vision, AWS Textract)
   - Connect OpenAI API for real AI responses
   - Integrate Stripe for payments
   - Add email service (SendGrid, Resend)
   - Add SMS notifications (Twilio)

2. **Enhanced Features**
   - Calendar integration (Google Calendar, Outlook)
   - Video meeting links (Zoom, Google Meet)
   - E-signature integration (DocuSign, HelloSign)
   - QuickBooks/Xero integration
   - Advanced document parsing and auto-fill

3. **Security & Compliance**
   - Implement encryption for sensitive data
   - Add audit logging
   - HIPAA/SOC 2 compliance measures
   - Two-factor authentication
   - IP whitelisting for admin access

4. **Scalability Improvements**
   - Implement caching (Redis)
   - Add background job processing (BullMQ)
   - Set up CDN for file storage
   - Database optimization and indexing
   - Load balancing and rate limiting

5. **Mobile & White-Label**
   - Build mobile app (React Native)
   - White-label customization system
   - Multi-tenant architecture
   - Custom domain support

---

## 📝 Notes

- All external API calls are mocked to avoid costs during POC
- Focus is on demonstrating workflow and UI/UX
- Database schema is production-ready
- Architecture allows easy integration of real services
- Code should be clean and well-documented for handoff

---

**Last Updated**: November 13, 2025
