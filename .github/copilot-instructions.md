# GitHub Copilot Instructions for CPA Automation Project

## Project Context
This is a **CPA tax preparation automation platform** built with Next.js 15, Prisma, PostgreSQL, and Better Auth. The system manages client workflows from intake through filing with AI-powered document processing and communication.

## Core Architecture
- **Frontend:** Next.js 15 App Router, React 19, Tailwind CSS, TanStack Query/Router/Table
- **Backend:** Next.js API Routes, Prisma ORM, PostgreSQL 14.2
- **Authentication:** Better Auth 1.3.34 with email/password (credentials stored in `accounts` table)
- **State Management:** TanStack Query for server state, React hooks for UI state

## Development Guidelines

### 1. File Organization
```
app/src/
├── app/
│   ├── api/           # API routes (server-side)
│   ├── auth/          # Authentication pages
│   ├── dashboard/     # Main dashboard pages
│   └── layout.tsx     # Root layout with providers
├── components/
│   ├── dashboard/     # Dashboard-specific components
│   ├── ui/            # Reusable UI components
│   └── providers.tsx  # Client-side providers (QueryClient)
├── lib/
│   ├── auth/          # Better Auth configuration
│   ├── db/            # Prisma client
│   └── utils/         # Utility functions
└── types/
    └── index.ts       # Shared TypeScript types
```

### 2. Component Standards
- **Use "use client" directive** for components with hooks, state, or event handlers
- **Server components by default** for pages and layouts when possible
- **Export named functions** for components: `export function ComponentName()`
- **TypeScript interfaces** for all props: `interface ComponentProps { ... }`
- **Colocation:** Keep related components in the same directory

### 3. API Route Patterns
```typescript
// app/src/app/api/[resource]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const data = await prisma.table.findMany({
      include: { relations: true },
    });
    return NextResponse.json(formatResponse(data));
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error message" },
      { status: 500 }
    );
  }
}
```

### 4. Database Field Mapping
**Database uses snake_case, API uses camelCase:**
```typescript
// Always map fields in API responses
const formatted = dbRecord.map(item => ({
  userId: item.user_id,
  createdAt: item.created_at,
  assignedToId: item.assigned_to_id,
  // ... etc
}));
```

### 5. Better Auth Integration
- **User model:** Extended with `role` field (ADMIN | CPA | CLIENT)
- **Accounts table:** Stores `password`, `providerId`, `accountId` (must equal `userId` for credentials)
- **Session checks:** Use cookie-based validation in middleware (Edge runtime compatible)
- **Field names:** Use `providerId` not `provider`, `accountId` not `email`

### 6. Styling with Tailwind
- **Use utility classes:** Prefer Tailwind over custom CSS
- **Responsive design:** Mobile-first with `sm:`, `md:`, `lg:` breakpoints
- **Color scheme:**
  - Primary: `blue-600`
  - Status badges: `gray-100` (Intake), `yellow-100` (Preparation), `blue-100` (Review), `green-100` (Filed), `purple-100` (Invoiced)
- **Spacing:** Consistent padding/margins (`p-4`, `gap-4`, `space-y-4`)

### 7. Task Management Workflow

#### When Starting a New Task:
1. **Read the current task list:** Check `/00-docs/TASKS.md`
2. **Update task status to "in-progress":**
   ```markdown
   - [ ] Task name → - [🔄] Task name
   ```
3. **Implement the feature** following the plan in `/00-docs/IMPLEMENTATION_PLAN.md`
4. **Test the implementation** (API endpoints, UI functionality)
5. **Mark task complete:**
   ```markdown
   - [🔄] Task name → - [✅] Task name
   ```

#### Creating New Tasks:
1. **Add to appropriate phase** in `/00-docs/TASKS.md`
2. **Format:** `- [ ] Task description (Estimated: Xh)`
3. **Include acceptance criteria** if complex
4. **Link to relevant requirements** in `/00-docs/REQUIREMENTS.md`

#### Task Status Indicators:
- `[ ]` - Not started
- `[🔄]` - In progress
- `[✅]` - Complete
- `[⏸️]` - Blocked/On hold
- `[❌]` - Cancelled

### 8. Code Quality Standards

#### TypeScript
- **Strict mode enabled:** No `any` types unless absolutely necessary
- **Interface over type:** Use `interface` for object shapes
- **Explicit return types:** For all exported functions
- **Null safety:** Handle undefined/null with optional chaining

#### Error Handling
```typescript
// API Routes
try {
  const result = await operation();
  return NextResponse.json(result);
} catch (error) {
  console.error("Operation failed:", error);
  return NextResponse.json(
    { error: "User-friendly message" },
    { status: 500 }
  );
}

// Client Components
const { data, error, isLoading } = useQuery({
  queryKey: ["resource"],
  queryFn: fetchResource,
});

if (error) return <ErrorState message={error.message} />;
if (isLoading) return <LoadingState />;
```

#### Performance
- **React Query caching:** Set appropriate `staleTime` and `cacheTime`
- **Avoid N+1 queries:** Use Prisma `include` for relations
- **Pagination:** Implement for lists over 50 items
- **Memoization:** Use `useMemo` for expensive calculations

### 9. Security Best Practices
- **Authentication required:** All dashboard routes protected by middleware
- **No sensitive data in client:** API keys, secrets in environment variables only
- **Input validation:** Validate all user input on server side
- **SQL injection prevention:** Always use Prisma (never raw SQL with user input)
- **XSS protection:** Next.js escapes by default, but sanitize rich text

### 10. Git Commit Conventions
```
feat: Add drag-and-drop to Kanban board
fix: Resolve authentication redirect loop
docs: Update task list with Phase 3 items
refactor: Simplify client API response formatting
style: Apply consistent spacing to dashboard components
test: Add unit tests for document classification
```

### 11. Testing Approach
- **API Testing:** Use `curl` or Postman to verify endpoints
- **Manual UI Testing:** Test in browser at http://localhost:3000
- **TypeScript Validation:** Run `npx tsc --noEmit` before commits
- **Database Integrity:** Verify with Prisma Studio (`npx prisma studio`)

### 12. Common Patterns

#### Fetching Data with React Query
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ["clients", filters],
  queryFn: async () => {
    const res = await fetch("/api/clients?" + new URLSearchParams(filters));
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  },
});
```

#### Updating Data with Mutations
```typescript
const mutation = useMutation({
  mutationFn: async (data: UpdateData) => {
    const res = await fetch("/api/resource", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Update failed");
    return res.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["resource"] });
  },
});
```

#### Prisma Relations
```typescript
// Always include related data in single query
const client = await prisma.clients.findUnique({
  where: { id },
  include: {
    users_clients_assigned_to_idTousers: true,
    documents: true,
    tasks: true,
  },
});
```

### 13. Environment Variables
```bash
# Required in .env
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="..."
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 14. When Stuck or Uncertain
1. **Check existing patterns:** Look at similar components/routes already implemented
2. **Review documentation:** See `/00-docs/` for requirements and plans
3. **Verify database schema:** Check `/00-docs/REQUIREMENTS.md` for table structures
4. **Test incrementally:** Build and test small pieces before moving forward
5. **Ask for clarification:** If requirements are ambiguous, ask the user

### 15. Documentation Requirements
- **Update TASKS.md** after completing each task
- **Document breaking changes** in implementation notes
- **Keep API endpoints documented** with examples in `/00-docs/API_REFERENCE.md` (create if needed)
- **Note technical decisions** that future developers should know

## Quick Reference

**Start Dev Server:** `cd app && npm run dev`
**Database Studio:** `cd app && npx prisma studio`
**Type Check:** `cd app && npx tsc --noEmit`
**Format Code:** `cd app && npm run format` (if configured)
**Test API:** `curl http://localhost:3000/api/[endpoint]`

**Login Credentials (Seeded):**
- Admin: `admin@cpacommand.com` / `password123`
- CPA: `sarah.cpa@cpacommand.com` / `password123`
- Client: `john.doe@example.com` / `password123`

---

**Remember:** This is a POC project. Focus on functionality over perfection. Ship working features quickly, iterate based on feedback.
