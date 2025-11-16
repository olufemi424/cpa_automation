# Documentation Navigation Map

```
📦 CPA Automation Platform
│
├── 🤖 AI Instructions
│   └── .github/copilot-instructions.md ⭐ START HERE FOR AI
│       ├── Project context & architecture
│       ├── Coding standards & patterns
│       ├── Task management workflow
│       └── Quick reference commands
│
├── 📚 Core Documentation (00-docs/)
│   │
│   ├── README.md ← YOU ARE HERE
│   │   └── Documentation guide & navigation
│   │
│   ├── REQUIREMENTS.md 📋
│   │   ├── Project overview & goals
│   │   ├── Core workflows
│   │   ├── Database schema (13 tables)
│   │   ├── User roles & permissions
│   │   ├── Functional requirements (FR-1 to FR-8)
│   │   ├── API endpoints
│   │   └── Success metrics
│   │
│   ├── IMPLEMENTATION_PLAN.md 🗺️
│   │   ├── 6-phase timeline (95-112h)
│   │   ├── Phase objectives & deliverables
│   │   ├── Tech stack decisions
│   │   ├── Risk management
│   │   └── Milestones
│   │
│   ├── TASKS.md ✅ ⭐ CHECK BEFORE CODING
│   │   ├── Phase 1: Foundation ✅ COMPLETE
│   │   ├── Phase 2: Core Features 🔄 IN PROGRESS
│   │   ├── Phase 3-6: Planned ⏳
│   │   ├── Task status tracking
│   │   └── Time estimates
│   │
│   └── STYLE_GUIDE.md 🎨
│       ├── Color palette
│       ├── Typography
│       ├── Component patterns
│       └── Accessibility
│
├── 🔧 Technical Reference
│   ├── database-schema-documentation.md
│   │   └── Complete DB schema with relationships
│   │
│   ├── better-auth-docs.md
│   │   └── Authentication setup & troubleshooting
│   │
│   └── database-setup-complete.md
│       └── Setup instructions & seed data
│
├── 📊 Progress Reports
│   ├── phase-2-dashboard-complete.md
│   │   └── Dashboard implementation summary
│   │
│   └── product-flow-dashboard-wireframe.md
│       └── Original design wireframe
│
└── 📦 Archive
    └── archive/
        └── poc-implementation-plan.md (deprecated)
```

---

## 🎯 Quick Start Paths

### Path 1: "I'm an AI assistant starting work"
```
1. Read: .github/copilot-instructions.md (coding guidelines)
2. Check: 00-docs/TASKS.md (what to build next)
3. Reference: 00-docs/REQUIREMENTS.md (business logic)
4. Code: Follow patterns from copilot-instructions.md
5. Update: Mark task status in TASKS.md
```

### Path 2: "I'm a new developer joining the project"
```
1. Read: 00-docs/README.md (this file)
2. Read: 00-docs/REQUIREMENTS.md (understand the domain)
3. Review: 00-docs/IMPLEMENTATION_PLAN.md (see the roadmap)
4. Setup: Follow database-setup-complete.md
5. Code: Pick task from TASKS.md
6. Follow: Guidelines in .github/copilot-instructions.md
```

### Path 3: "I need to build a new feature"
```
1. Check: TASKS.md (is it already planned?)
2. Read: REQUIREMENTS.md (find related FR-X)
3. Review: IMPLEMENTATION_PLAN.md (which phase?)
4. Code: Follow copilot-instructions.md patterns
5. Test: Verify against acceptance criteria
6. Update: Mark complete in TASKS.md
```

### Path 4: "I need to style a component"
```
1. Read: STYLE_GUIDE.md (colors, spacing, patterns)
2. Check: existing components in app/src/components/
3. Follow: Tailwind utility classes
4. Test: Responsive on mobile/tablet/desktop
5. Verify: Accessibility with screen reader
```

### Path 5: "I need to fix a bug"
```
1. Check: TASKS.md (is it a known issue?)
2. Review: relevant docs (auth, database, etc.)
3. Check: copilot-instructions.md (error handling patterns)
4. Fix: Following existing code patterns
5. Test: Verify fix doesn't break other features
6. Document: If it's a common issue
```

---

## 📝 Documentation Hierarchy

### Level 1: Essential (Read First)
- **copilot-instructions.md** - How to code in this project
- **TASKS.md** - What to build next
- **README.md** - How to navigate docs

### Level 2: Planning (Read for Context)
- **REQUIREMENTS.md** - What we're building and why
- **IMPLEMENTATION_PLAN.md** - When and how we're building it

### Level 3: Reference (Read as Needed)
- **STYLE_GUIDE.md** - UI/UX standards
- **database-schema-documentation.md** - DB structure
- **better-auth-docs.md** - Auth implementation

### Level 4: Historical (Read for Background)
- **phase-2-dashboard-complete.md** - Progress reports
- **database-setup-complete.md** - Setup history
- **product-flow-dashboard-wireframe.md** - Original design

---

## 🔗 Cross-References

### Requirements → Tasks
Each task in TASKS.md should reference a requirement:
```markdown
- [ ] Build client onboarding form (Related: FR-3, REQUIREMENTS.md#client-management)
```

### Tasks → Implementation Plan
Tasks are organized by phase:
```markdown
Phase 2: Core Features (IMPLEMENTATION_PLAN.md)
├── 2.1 Client Onboarding (TASKS.md Phase 2.1)
└── 2.2 Kanban Board (TASKS.md Phase 2.2)
```

### Code → Docs
Code should reference documentation:
```typescript
// See: 00-docs/REQUIREMENTS.md#database-schema
// Database uses snake_case, API uses camelCase
const formatted = dbRecord.map(item => ({
  userId: item.user_id,
  createdAt: item.created_at,
}));
```

---

## 🎨 Document Formatting Standards

### Headings
```markdown
# Main Title (H1) - Once per document
## Section (H2) - Major sections
### Subsection (H3) - Sub-topics
#### Detail (H4) - Fine details
```

### Status Indicators
```markdown
✅ Complete
🔄 In Progress
⏳ Planned
⏸️ Blocked
❌ Cancelled
```

### Code Examples
````markdown
```typescript
// Always include language identifier
// Always show complete, runnable examples
const example = "like this";
```
````

### Links
```markdown
[Relative Links](./REQUIREMENTS.md) - For internal docs
[Absolute Links](https://example.com) - For external resources
```

---

## 🚦 Status at a Glance

| Document | Status | Last Updated | Priority |
|----------|--------|--------------|----------|
| copilot-instructions.md | ✅ Current | Nov 15, 2024 | ⭐⭐⭐ |
| TASKS.md | 🔄 Active | Nov 15, 2024 | ⭐⭐⭐ |
| REQUIREMENTS.md | ✅ Current | Nov 15, 2024 | ⭐⭐ |
| IMPLEMENTATION_PLAN.md | ✅ Current | Nov 15, 2024 | ⭐⭐ |
| README.md | ✅ Current | Nov 15, 2024 | ⭐⭐ |
| STYLE_GUIDE.md | ✅ Current | Nov 14, 2024 | ⭐ |
| database-schema-documentation.md | ✅ Current | Nov 14, 2024 | ⭐ |
| better-auth-docs.md | ✅ Current | Nov 14, 2024 | ⭐ |
| phase-2-dashboard-complete.md | ✅ Current | Nov 15, 2024 | Reference |

**Priority Legend:**
- ⭐⭐⭐ Critical - Read before coding
- ⭐⭐ Important - Read for context
- ⭐ Reference - Read as needed

---

**Remember:** Good documentation is like a good map - it should tell you where you are, where you're going, and how to get there.
