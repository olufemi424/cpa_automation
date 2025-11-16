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
- [✅] Implement drag-and-drop between columns (2h)
  - [✅] Set up DndContext and SortableContext
  - [✅] Make client cards draggable with useSortable
  - [✅] Handle drop events with handleDragEnd
  - [✅] Optimistic UI updates with TanStack Query mutations
  - [✅] Add drag overlay for visual feedback
  - [✅] Create DroppableColumn component with useDroppable
- [✅] Create PATCH /api/clients/[id] endpoint (1h)
  - [✅] Validate client ID and status
  - [✅] Update client status in database
  - [✅] Recalculate progress percentage automatically
  - [✅] Return updated client with formatted response
  - [✅] Add authorization checks with canAccessClient
  - [✅] Fix TypeScript errors with ApiResponse type system
  - [✅] Move rate limiting and auth checks outside withErrorHandling wrapper
- [✅] Create GET /api/clients/[id] endpoint (0.5h)
  - [✅] Fetch single client with relations (documents, tasks)
  - [✅] Format response with camelCase fields
  - [✅] Add authorization checks
  - [✅] Include progress percentage calculation
- [✅] Add task creation UI (1.5h)
  - [✅] Task form modal with validation
  - [✅] Fields: title, description, assignee, due date
  - [✅] Submit to API with error handling
  - [✅] Integrated "Add Task" button on client cards
- [✅] Build POST /api/tasks endpoint (1h)
  - [✅] Create task linked to client
  - [✅] Validate assignee is CPA or ADMIN
  - [✅] Set default status (INTAKE)
  - [✅] Authorization checks with canAccessClient
  - [✅] Format response with camelCase fields

**Subtotal:** 8-9 hours (Complete)

### 2.3 Communication Hub ✅ COMPLETE
- [✅] Implement GET /api/messages endpoint (0.5h)
  - [✅] Fetch messages for client with authorization
  - [✅] Include sender info from users table
  - [✅] Sort by timestamp ascending
  - [✅] Format response with camelCase fields
- [✅] Implement POST /api/messages endpoint (1h)
  - [✅] Create message record with client_id and sender_id
  - [✅] Mark as unread by default
  - [✅] Validate content length (max 5000 characters)
  - [✅] Support parent message ID for threading
  - [✅] Return formatted message with sender info
- [✅] Create message list component (1.5h)
  - [✅] Display messages with sender name and avatar
  - [✅] Show timestamp with relative formatting
  - [✅] Different styling for current user vs others
  - [✅] Auto-scroll to latest message on new messages
  - [✅] Date headers to group messages by day
- [✅] Build message input component (0.5h)
  - [✅] Textarea with auto-resize
  - [✅] Character counter (5000 max)
  - [✅] Enter to send (Shift+Enter for newline)
  - [✅] Send button with loading state
  - [✅] Error handling with retry
- [✅] Integrate into ChatPanel (0.5h)
  - [✅] Create useMessages custom hook with TanStack Query
  - [✅] Create useSendMessage mutation hook
  - [✅] Polling every 30 seconds for new messages
  - [✅] Optimistic updates on send
  - [ ] Add message templates (Future enhancement)
  - [ ] Mock AI FAQ responses (Future enhancement)

**Subtotal:** 4 hours (Complete)

### 2.4 Client Dashboard ✅ COMPLETE
- [✅] Create dashboard layout component (0.5h)
- [✅] Build client list with search/filters (1h)
- [✅] Integrate Kanban board into layout (0.5h)
- [✅] Add chat panel placeholder (0.5h)
- [✅] Implement sign-out button with Better Auth (0.5h)
- [✅] Add role-based dashboard views (ADMIN/CPA/CLIENT) (1h)
- [✅] Create authorization helpers and middleware (1h)
- [✅] Add role-based API filtering for clients endpoint (0.5h)
- [✅] Create client overview panel (2h)
  - [✅] Display selected client details
  - [✅] Document checklist with upload status
  - [✅] Progress bar with percentage
  - [✅] Assigned CPA info
  - [✅] Next deadline display
  - [✅] Quick action buttons
- [✅] Build client profile page (1.5h)
  - [✅] Route: /dashboard/clients/[id]
  - [✅] Full client details with tabbed interface
  - [✅] Document list with upload status
  - [✅] Task list with due dates
  - [✅] Message history placeholder
  - [✅] Edit client button (UI ready)
- [✅] Add navigation menu (0.5h)
  - [✅] Sidebar with links: Dashboard, Clients, Tasks, Messages, Reports
  - [✅] Active state styling with route-based highlighting
  - [✅] Collapsible sidebar for desktop
  - [✅] Bottom navigation bar for mobile
  - [✅] Role-based menu filtering

**Subtotal:** 9.5 hours (Complete)

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

**Phase 2 Total:** 27.5 hours (estimated) | **Completed:** ~23.5 hours | **Remaining:** ~4 hours (Client onboarding features)

---

## Phase 3: Advanced Features ⏳ PLANNED

### 3.1 User Management (Admin)
- [ ] Create admin user management UI (Estimated: 3h)
  - [ ] User list page with search and filters
  - [ ] User creation form (email, password, role selection)
  - [ ] User edit modal
  - [ ] User deletion with confirmation
  - [ ] Role badge indicators
  - [ ] Active/inactive status toggle
- [ ] Build POST /api/admin/users endpoint (Estimated: 1h)
  - [ ] Validate admin authentication with requireRole('ADMIN')
  - [ ] Hash password with bcrypt
  - [ ] Create user record in database
  - [ ] Create accounts record for credentials provider
  - [ ] Return created user (exclude password)
- [ ] Build GET /api/admin/users endpoint (Estimated: 0.5h)
  - [ ] Fetch all users with role filtering
  - [ ] Include account information
  - [ ] Exclude sensitive data (passwords)
  - [ ] Sort by creation date
- [ ] Build PATCH /api/admin/users/[id] endpoint (Estimated: 1h)
  - [ ] Update user profile (name, email, role)
  - [ ] Optional password reset
  - [ ] Validate role changes (prevent last admin deletion)
  - [ ] Return updated user
- [ ] Build DELETE /api/admin/users/[id] endpoint (Estimated: 0.5h)
  - [ ] Soft delete or archive user
  - [ ] Prevent deletion of last admin
  - [ ] Handle cascade deletion of related data
  - [ ] Return success status
- [ ] Add CPA assignment management (Estimated: 1.5h)
  - [ ] Bulk client reassignment UI
  - [ ] CPA workload visibility
  - [ ] Auto-assignment algorithm settings

**Subtotal:** 7-8 hours

### 3.2 Document Management
- [ ] Implement document preview (PDF viewer) (Estimated: 2h)
- [ ] Add document version history (Estimated: 1.5h)
- [ ] Create document verification workflow (Estimated: 2h)
- [ ] Build document download endpoint (Estimated: 0.5h)
- [ ] Add document deletion with confirmation (Estimated: 1h)

**Subtotal:** 6-7 hours

### 3.3 Task Automation
- [ ] Auto-create tasks based on client entity type (Estimated: 2h)
- [ ] Implement task due date reminders (Estimated: 1.5h)
- [ ] Add task priority levels (Estimated: 1h)
- [ ] Create task templates (Estimated: 1.5h)
- [ ] Build bulk task assignment (Estimated: 1h)

**Subtotal:** 6-7 hours

### 3.4 Notifications
- [ ] Create notification system (in-app) (Estimated: 2h)
- [ ] Add email notifications for status changes (Estimated: 2h)
- [ ] Implement real-time updates (WebSockets/Polling) (Estimated: 3h)
- [ ] Build notification preferences page (Estimated: 1.5h)

**Subtotal:** 7-8 hours

### 3.5 Real-Time Chat Enhancements
- [ ] Implement WebSocket connection for instant messaging (Estimated: 3h)
  - [ ] Set up WebSocket server (Socket.io or native WebSocket)
  - [ ] Replace polling with WebSocket subscriptions
  - [ ] Handle connection state (connected, reconnecting, disconnected)
  - [ ] Add reconnection logic with exponential backoff
- [ ] Add typing indicators (Estimated: 1h)
  - [ ] Show "User is typing..." when other party types
  - [ ] Debounce typing events
  - [ ] Clear indicator after timeout
- [ ] Implement read receipts (Estimated: 1.5h)
  - [ ] Mark messages as read when viewed
  - [ ] Show read status on sender's side
  - [ ] Update is_read field in database
- [ ] Add message threading support (Estimated: 2h)
  - [ ] UI for replying to specific messages
  - [ ] Thread view with parent message context
  - [ ] Parent message ID already supported in schema
- [ ] Create message search functionality (Estimated: 1.5h)
  - [ ] Search input with autocomplete
  - [ ] Full-text search across message content
  - [ ] Jump to message in timeline

**Subtotal:** 8-9 hours

**Phase 3 Total:** 26-30 hours (estimated)

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
| Phase 2 | 🔄 In Progress | 27.5h | ~23.5h | ~4h |
| Phase 3 | ⏳ Planned | 34-39h | 0h | 34-39h |
| Phase 4 | ⏳ Planned | 14-16h | 0h | 14-16h |
| Phase 5 | ⏳ Planned | 25-28h | 0h | 25-28h |
| Phase 6 | ⏳ Planned | 10-12h | 0h | 10-12h |
| **Total** | | **120-139h** | **~35.5h** | **~84.5-103.5h** |

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
