# CPA Automation Platform - Documentation Guide

**Last Updated:** November 15, 2024

## 📚 Documentation Structure

This project uses a structured documentation system to help AI assistants and developers navigate requirements, plans, and tasks efficiently.

### Core Documents

#### 1. **[../.github/copilot-instructions.md](../.github/copilot-instructions.md)** 🤖
**Purpose:** Instructions for AI assistants (GitHub Copilot, Cursor, etc.)

**Contains:**
- Project context and architecture
- Component and API patterns
- Code quality standards
- Task management workflow
- Security best practices
- Common coding patterns
- Quick reference commands

**When to Use:** AI assistants should read this FIRST when working on the project. Contains all guidelines for maintaining code consistency.

---

#### 2. **[REQUIREMENTS.md](./REQUIREMENTS.md)** 📋
**Purpose:** Complete functional and technical requirements

**Contains:**
- Project overview and goals
- Core workflows (onboarding, filing, etc.)
- Database schema (13 tables with relationships)
- User roles and permissions
- Functional requirements (FR-1 to FR-8)
- Non-functional requirements (performance, security, etc.)
- API endpoints (implemented and planned)
- Success metrics

**When to Use:**
- Starting a new feature
- Understanding business logic
- Designing database queries
- Creating API endpoints

---

#### 3. **[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)** 🗺️
**Purpose:** High-level roadmap and phase breakdown

**Contains:**
- 6-phase project timeline (95-112 hours)
- Phase objectives and deliverables
- Technical stack decisions
- Risk management
- Success criteria
- Milestones and deadlines

**When to Use:**
- Planning upcoming work
- Understanding project scope
- Checking progress against timeline
- Identifying dependencies between phases

---

#### 4. **[TASKS.md](./TASKS.md)** ✅
**Purpose:** Granular task tracking with status

**Contains:**
- All tasks by phase (Phase 1-6)
- Task status (not started, in-progress, complete, blocked)
- Time estimates for each task
- Sub-tasks and acceptance criteria
- Progress tracking (hours spent vs. estimated)

**When to Use:**
- Before starting work (check current tasks)
- During implementation (mark tasks in-progress)
- After completing work (mark tasks complete)
- Adding new tasks

**How AI Should Update:**
```markdown
# Before starting
- [ ] Task name → - [🔄] Task name

# After completing
- [🔄] Task name → - [✅] Task name
```

---

#### 5. **[STYLE_GUIDE.md](./STYLE_GUIDE.md)** 🎨
**Purpose:** UI/UX design standards

**Contains:**
- Color palette and usage
- Typography standards
- Component patterns
- Spacing and layout rules
- Accessibility guidelines

**When to Use:**
- Creating new UI components
- Styling existing components
- Ensuring visual consistency

---

### Supporting Documents

#### Technical Documentation

**[database-schema-documentation.md](./database-schema-documentation.md)**
- Complete database schema
- Table relationships
- Field descriptions
- Indexes and constraints

**[better-auth-docs.md](./better-auth-docs.md)**
- Better Auth configuration
- Authentication flow
- Session management
- Troubleshooting guide

**[database-setup-complete.md](./database-setup-complete.md)**
- Database setup instructions
- Seed data details
- Migration history

#### Progress Reports

**[phase-2-dashboard-complete.md](./phase-2-dashboard-complete.md)**
- Phase 2 progress report
- Features implemented
- Testing instructions
- Known limitations

**[product-flow-dashboard-wireframe.md](./product-flow-dashboard-wireframe.md)**
- Original wireframe design
- User flow descriptions
- Feature integration map

---

## 🔄 Workflow for AI Assistants

### When Starting Work

1. **Read** [../.github/copilot-instructions.md](../.github/copilot-instructions.md) for coding guidelines
2. **Check** [TASKS.md](./TASKS.md) for current tasks
3. **Review** [REQUIREMENTS.md](./REQUIREMENTS.md) for relevant requirements
4. **Consult** [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for context

### During Implementation

1. **Mark task in-progress** in [TASKS.md](./TASKS.md)
2. **Follow patterns** from [../.github/copilot-instructions.md](../.github/copilot-instructions.md)
3. **Reference** [STYLE_GUIDE.md](./STYLE_GUIDE.md) for UI work
4. **Test incrementally** as you build

### After Completion

1. **Mark task complete** in [TASKS.md](./TASKS.md)
2. **Update** [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) if needed
3. **Document** any important decisions
4. **Test** the full feature flow

### Creating New Tasks

1. **Add to** [TASKS.md](./TASKS.md) in appropriate phase
2. **Link to** relevant requirements in [REQUIREMENTS.md](./REQUIREMENTS.md)
3. **Estimate** time required
4. **Break down** into sub-tasks if complex

---

## 📖 Quick Navigation

### I want to...

**Understand the project**
→ Read [REQUIREMENTS.md](./REQUIREMENTS.md) Overview section

**Know what to build next**
→ Check [TASKS.md](./TASKS.md) current phase

**Learn coding standards**
→ Read [../.github/copilot-instructions.md](../.github/copilot-instructions.md)

**See the timeline**
→ Check [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) timeline

**Style a component**
→ Reference [STYLE_GUIDE.md](./STYLE_GUIDE.md)

**Understand database structure**
→ Read [database-schema-documentation.md](./database-schema-documentation.md)

**Fix authentication issues**
→ Check [better-auth-docs.md](./better-auth-docs.md)

**See what's been completed**
→ Look at [phase-2-dashboard-complete.md](./phase-2-dashboard-complete.md)

---

## 🎯 Best Practices

### For Documentation

1. **Keep docs updated** - Update as you build
2. **Be specific** - Include code examples
3. **Link related docs** - Cross-reference frequently
4. **Use consistent formatting** - Follow markdown standards
5. **Date stamp changes** - Track when docs were updated

### For Task Management

1. **One task at a time** - Mark in-progress, complete, move to next
2. **Update immediately** - Don't batch status changes
3. **Be granular** - Break large tasks into smaller pieces
4. **Include acceptance criteria** - Define "done"
5. **Link requirements** - Connect tasks to FR-X/NFR-X

### For Code

1. **Follow patterns** - Check existing code first
2. **Test incrementally** - Don't wait until the end
3. **Document decisions** - Explain non-obvious choices
4. **Handle errors** - Graceful error handling everywhere
5. **Type everything** - Strict TypeScript, no `any`

---

## 🚀 Getting Started

### For New AI Assistants

1. Read this document (README.md)
2. Read [../.github/copilot-instructions.md](../.github/copilot-instructions.md) thoroughly
3. Skim [REQUIREMENTS.md](./REQUIREMENTS.md) to understand the domain
4. Check [TASKS.md](./TASKS.md) to see current status
5. Ask user which task to work on

### For New Developers

1. Clone repository
2. Read [REQUIREMENTS.md](./REQUIREMENTS.md) completely
3. Review [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
4. Set up local environment (see [database-setup-complete.md](./database-setup-complete.md))
5. Pick a task from [TASKS.md](./TASKS.md)
6. Follow guidelines in [../.github/copilot-instructions.md](../.github/copilot-instructions.md)

---

## 📝 Document Update Log

| Date | Document | Change | Updated By |
|------|----------|--------|------------|
| Nov 15, 2024 | All | Initial documentation restructure | AI Assistant |
| Nov 15, 2024 | TASKS.md | Added Phase 2 progress | AI Assistant |
| Nov 15, 2024 | IMPLEMENTATION_PLAN.md | Updated timeline | AI Assistant |

---

## 🤝 Contributing

When contributing to documentation:

1. **Follow the structure** - Don't create new docs unnecessarily
2. **Update existing docs** - Keep information consolidated
3. **Use clear headings** - Make docs scannable
4. **Include examples** - Show, don't just tell
5. **Link generously** - Cross-reference related sections

---

## ❓ Questions?

If documentation is unclear or missing information:

1. Check other related documents
2. Look at existing code for patterns
3. Ask the user for clarification
4. Update documentation with the answer

**Remember:** Documentation should answer "What to build?" (REQUIREMENTS), "When to build it?" (IMPLEMENTATION_PLAN), "How to build it?" (copilot-instructions), and "What's the status?" (TASKS).

---

**Next:** Start with [../.github/copilot-instructions.md](../.github/copilot-instructions.md) to learn the project conventions.
