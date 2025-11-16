# CPA Automation - Task List

**Last Updated:** November 15, 2024
**Current Phase:** Phase 2 - Core Features

## Task Status Guide
- `[ ]` Not started
- `[🔄]` In progress
- `[✅]` Complete
- `[⏸️]` Blocked/On hold
- `[❌]` Cancelled

---

## Phase 1: Foundation & Setup ✅ COMPLETE

### 1.1 Project Setup
- [✅] Initialize Next.js 15 project with TypeScript
- [✅] Configure Tailwind CSS
- [✅] Set up Prisma with PostgreSQL
- [✅] Install core dependencies (TanStack Query, Better Auth)
- [✅] Configure environment variables

### 1.2 Database Setup
- [✅] Create database schema (13 tables)
- [✅] Set up Prisma client
- [✅] Create seed data script (15 users, 11 clients)
- [✅] Run migrations and seed database
- [✅] Verify data integrity with Prisma Studio

### 1.3 Authentication
- [✅] Configure Better Auth with email/password provider
- [✅] Create login page with form
- [✅] Set up authentication middleware
- [✅] Implement session management
- [✅] Test login flow with seeded users
- [✅] Fix accounts table schema (add password, providerId fields)
- [✅] Fix middleware for Edge runtime compatibility

### 1.4 Project Structure
- [✅] Set up app router structure
- [✅] Create component directories
- [✅] Configure TypeScript paths (@/ alias)
- [✅] Set up providers (QueryClient)

**Phase 1 Time:** 10-13 hours (estimated) | **Actual:** ~12 hours

---

## Phase 2: Core Features 🔄 IN PROGRESS

### 2.1 Client Onboarding
- [ ] Create client onboarding form component (Estimated: 1.5h)
  - [ ] Form fields: name, email, phone, entity type, tax year, business name
  - [ ] Validation with Zod schema
  - [ ] Loading and error states
- [ ] Build POST /api/clients endpoint (Estimated: 1h)
  - [ ] Validate input data
  - [ ] Create client record in database
  - [ ] Auto-assign CPA based on availability
  - [ ] Return created client with 201 status
- [ ] Create document upload component (Estimated: 2h)
  - [ ] Drag-and-drop file upload UI
  - [ ] File type validation (PDF, images, common tax docs)
  - [ ] Progress indicator for uploads
  - [ ] Document list with status icons
- [ ] Implement POST /api/documents endpoint (Estimated: 1h)
  - [ ] File storage (local or S3)
  - [ ] Create document record in database
  - [ ] Return document metadata
- [ ] Mock AI document classification (Estimated: 0.5h)
  - [ ] Classify by filename patterns (w2, 1099, etc.)
  - [ ] Store classification in database
  - [ ] Display classification confidence

**Subtotal:** 4-5 hours

### 2.2 Kanban Board & Task Management
- [✅] Create Kanban board component (1.5h)
- [✅] Display clients in workflow columns (0.5h)
- [✅] Add client API endpoint (0.5h)
- [✅] Install @dnd-kit for drag-and-drop (0.5h)
- [✅] Add error handling and rate limiting to API (1h)
- [✅] Create custom hooks for data fetching (1h)
- [✅] Add loading and error UI components (0.5h)
- [ ] Implement drag-and-drop between columns (Estimated: 2h)
  - [ ] Set up DndContext and SortableContext
  - [ ] Make client cards draggable
  - [ ] Handle drop events
  - [ ] Optimistic UI updates
- [ ] Create PATCH /api/clients/[id] endpoint (Estimated: 1h)
  - [ ] Validate client ID and status
  - [ ] Update client status in database
  - [ ] Recalculate progress percentage
  - [ ] Return updated client
- [ ] Add task creation UI (Estimated: 1.5h)
  - [ ] Task form modal/drawer
  - [ ] Fields: title, description, assignee, due date
  - [ ] Submit to API
- [ ] Build POST /api/tasks endpoint (Estimated: 1h)
  - [ ] Create task linked to client
  - [ ] Assign to CPA
  - [ ] Set status and due date

**Subtotal:** 5-6 hours (2.5h complete, 2.5-3.5h remaining)

### 2.3 Communication Hub
- [ ] Create message list component (Estimated: 1.5h)
  - [ ] Display messages in chat panel
  - [ ] Show sender, timestamp, read status
  - [ ] Auto-scroll to latest message
- [ ] Build message input component (Estimated: 0.5h)
  - [ ] Text input with send button
  - [ ] Character counter
  - [ ] Enter to send (Shift+Enter for newline)
- [ ] Implement GET /api/messages endpoint (Estimated: 0.5h)
  - [ ] Fetch messages for client
  - [ ] Include sender info
  - [ ] Sort by timestamp
- [ ] Implement POST /api/messages endpoint (Estimated: 1h)
  - [ ] Create message record
  - [ ] Mark as unread for recipient
  - [ ] Return created message
- [ ] Add message templates (Estimated: 1h)
  - [ ] Pre-written templates for common scenarios
  - [ ] Template picker UI
  - [ ] Variable substitution (client name, etc.)
- [ ] Mock AI FAQ responses (Estimated: 1.5h)
  - [ ] Pattern matching for common questions
  - [ ] Auto-suggest responses
  - [ ] CPA can edit before sending

**Subtotal:** 4-5 hours

### 2.4 Client Dashboard
- [✅] Create dashboard layout component (0.5h)
- [✅] Build client list with search/filters (1h)
- [✅] Integrate Kanban board into layout (0.5h)
- [✅] Add chat panel placeholder (0.5h)
- [✅] Implement sign-out button with Better Auth (0.5h)
- [✅] Add role-based dashboard views (ADMIN/CPA/CLIENT) (1h)
- [✅] Create authorization helpers and middleware (1h)
- [✅] Add role-based API filtering for clients endpoint (0.5h)
- [ ] Create client overview panel (Estimated: 2h)
  - [ ] Display selected client details
  - [ ] Document checklist with upload status
  - [ ] Progress bar with percentage
  - [ ] Assigned CPA info
  - [ ] Next deadline display
  - [ ] Quick action buttons
- [ ] Build client profile page (Estimated: 1.5h)
  - [ ] Route: /dashboard/clients/[id]
  - [ ] Full client details
  - [ ] Document list
  - [ ] Task list
  - [ ] Message history
  - [ ] Edit client button
  - [ ] Add navigation menu (Estimated: 0.5h)
  - [ ] Sidebar with links: Dashboard, Clients, Tasks, Messages, Reports
  - [ ] Active state styling

**Subtotal:** 4-5 hours (5.5h complete, 0h remaining for core features)

### 2.5 Authentication & Authorization ✅ COMPLETE
- [✅] Implement sign-out functionality (0.5h)
  - [✅] Add sign-out button to dashboard header
  - [✅] Integrate Better Auth signOut method
  - [✅] Redirect to login after sign-out
  - [✅] Loading state during sign-out
- [✅] Create role-based dashboard views (1h)
  - [✅] CLIENT view: Simplified portal with progress tracking
  - [✅] CPA view: Full Kanban board with assigned clients
  - [✅] ADMIN view: Full Kanban board with all clients + admin badge
  - [✅] Conditional rendering based on user role
- [✅] Implement authorization helpers (1h)
  - [✅] Create getAuthUser helper
  - [✅] Create requireAuth middleware
  - [✅] Create requireRole middleware
  - [✅] Add role checking utilities (isAdmin, isCPA, isClient)
  - [✅] Add canAccessClient permission checker
- [✅] Add role-based API authorization (0.5h)
  - [✅] Update clients API with role-based filtering
  - [✅] ADMIN sees all clients
  - [✅] CPA sees only assigned clients
  - [✅] CLIENT sees only their own data

**Subtotal:** 3 hours (Complete)

**Phase 2 Total:** 17-21 hours (estimated) | **Completed:** ~8.5 hours | **Remaining:** ~8.5-12.5 hours---

## Phase 3: Advanced Features ⏳ PLANNED

### 3.1 Document Management
- [ ] Implement document preview (PDF viewer) (Estimated: 2h)
- [ ] Add document version history (Estimated: 1.5h)
- [ ] Create document verification workflow (Estimated: 2h)
- [ ] Build document download endpoint (Estimated: 0.5h)
- [ ] Add document deletion with confirmation (Estimated: 1h)

**Subtotal:** 6-7 hours

### 3.2 Task Automation
- [ ] Auto-create tasks based on client entity type (Estimated: 2h)
- [ ] Implement task due date reminders (Estimated: 1.5h)
- [ ] Add task priority levels (Estimated: 1h)
- [ ] Create task templates (Estimated: 1.5h)
- [ ] Build bulk task assignment (Estimated: 1h)

**Subtotal:** 6-7 hours

### 3.3 Notifications
- [ ] Create notification system (in-app) (Estimated: 2h)
- [ ] Add email notifications for status changes (Estimated: 2h)
- [ ] Implement real-time updates (WebSockets/Polling) (Estimated: 3h)
- [ ] Build notification preferences page (Estimated: 1.5h)

**Subtotal:** 7-8 hours

**Phase 3 Total:** 19-22 hours (estimated)

---

## Phase 4: Analytics & Reporting ⏳ PLANNED

### 4.1 CPA Analytics
- [ ] Create CPA productivity dashboard (Estimated: 3h)
- [ ] Build client pipeline visualization (Estimated: 2h)
- [ ] Add deadline adherence metrics (Estimated: 1.5h)
- [ ] Implement time tracking (Estimated: 2.5h)

**Subtotal:** 8-9 hours

### 4.2 Client Reporting
- [ ] Build client progress report (Estimated: 2h)
- [ ] Create document status report (Estimated: 1.5h)
- [ ] Add invoice generation (Estimated: 2h)
- [ ] Implement PDF export (Estimated: 1.5h)

**Subtotal:** 6-7 hours

**Phase 4 Total:** 14-16 hours (estimated)

---

## Phase 5: Polish & Optimization ⏳ PLANNED

### 5.1 UI/UX Enhancements
- [ ] Add loading skeletons for all data fetches (Estimated: 2h)
- [ ] Implement empty states with helpful CTAs (Estimated: 1.5h)
- [ ] Add animations and transitions (Estimated: 2h)
- [ ] Improve mobile responsiveness (Estimated: 3h)
- [ ] Accessibility audit and fixes (Estimated: 2h)

**Subtotal:** 9-10 hours

### 5.2 Performance Optimization
- [ ] Implement pagination for large lists (Estimated: 2h)
- [ ] Add database indexes for common queries (Estimated: 1h)
- [ ] Optimize image loading (next/image) (Estimated: 1h)
- [ ] Set up React Query devtools (Estimated: 0.5h)
- [ ] Profile and optimize slow queries (Estimated: 2h)

**Subtotal:** 5-6 hours

### 5.3 Testing & Quality
- [ ] Write unit tests for utilities (Estimated: 3h)
- [ ] Add API endpoint tests (Estimated: 3h)
- [ ] Create integration tests for workflows (Estimated: 4h)
- [ ] Set up CI/CD pipeline (Estimated: 2h)

**Subtotal:** 11-12 hours

**Phase 5 Total:** 25-28 hours (estimated)

---

## Phase 6: Deployment & Documentation ⏳ PLANNED

### 6.1 Deployment
- [ ] Set up production database (Estimated: 1h)
- [ ] Configure environment variables (Estimated: 0.5h)
- [ ] Deploy to Vercel/hosting platform (Estimated: 1h)
- [ ] Set up domain and SSL (Estimated: 0.5h)
- [ ] Run production smoke tests (Estimated: 1h)

**Subtotal:** 3-4 hours

### 6.2 Documentation
- [ ] Write API documentation (Estimated: 2h)
- [ ] Create user guide (CPA users) (Estimated: 2h)
- [ ] Create user guide (Client users) (Estimated: 1.5h)
- [ ] Document deployment process (Estimated: 1h)
- [ ] Record demo video (Estimated: 1.5h)

**Subtotal:** 7-8 hours

**Phase 6 Total:** 10-12 hours (estimated)

---

## Total Project Estimate

| Phase | Status | Time Estimate | Time Spent | Remaining |
|-------|--------|---------------|------------|-----------|
| Phase 1 | ✅ Complete | 10-13h | ~12h | 0h |
| Phase 2 | 🔄 In Progress | 17-21h | ~2.5h | ~14.5-18.5h |
| Phase 3 | ⏳ Planned | 19-22h | 0h | 19-22h |
| Phase 4 | ⏳ Planned | 14-16h | 0h | 14-16h |
| Phase 5 | ⏳ Planned | 25-28h | 0h | 25-28h |
| Phase 6 | ⏳ Planned | 10-12h | 0h | 10-12h |
| **Total** | | **95-112h** | **~14.5h** | **~80.5-97.5h** |

---

## How to Use This Task List

### For AI Assistants:
1. **Before starting work:** Read current phase tasks
2. **Mark task in-progress:** Change `[ ]` to `[🔄]` when you begin
3. **Mark task complete:** Change `[🔄]` to `[✅]` when done
4. **Update time spent:** Note actual time in commit message
5. **Create new tasks:** Add to appropriate phase with estimate
6. **Link to requirements:** Reference FR-X or NFR-X from REQUIREMENTS.md

### For Developers:
1. Work on one task at a time
2. Test thoroughly before marking complete
3. Update documentation as you go
4. Commit after each completed task
5. Note any blockers or issues in task comments

### Creating New Tasks:
```markdown
- [ ] Task description (Estimated: Xh)
  - [ ] Sub-task 1
  - [ ] Sub-task 2
  - Acceptance Criteria:
    - [ ] Criteria 1
    - [ ] Criteria 2
  - Related: FR-X, Issue #Y
```

---

**Next Up:** Complete Phase 2.2 drag-and-drop functionality
