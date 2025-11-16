# User Management Guide

## Current State

### Database Schema

Yes, we **DO have a database** that stores user roles. The `users` table contains:

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,        -- ADMIN | CPA | CLIENT
    password_hash TEXT,
    image TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Current Seeded Users

The database is currently seeded with:
- **1 ADMIN**: `admin@cpacommand.com` / `password123`
- **3 CPAs**:
  - `sarah.cpa@cpacommand.com` / `password123`
  - `mike.cpa@cpacommand.com` / `password123`
  - `jennifer.cpa@cpacommand.com` / `password123`
- **11 CLIENTs**: Various client users

## Problem: No User Management UI Yet

### What's Missing

Currently, there is **NO admin interface** to add new users (CPAs or CLIENTs). This is a gap that needs to be filled.

According to REQUIREMENTS.md, ADMIN should have:
- User management (create, edit, delete users)
- Full system access
- System configuration

### Temporary Solution: Direct Database Insert

Until we build the admin UI, new CPA users must be added directly to the database:

```sql
-- 1. Create the user
INSERT INTO users (id, email, name, role, email_verified, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'newcpa@cpacommand.com',
    'New CPA Name',
    'CPA',
    false,
    NOW(),
    NOW()
);

-- 2. Get the user ID
SELECT id FROM users WHERE email = 'newcpa@cpacommand.com';

-- 3. Create the Better Auth account with hashed password
-- (Password hash for 'password123' using bcrypt)
INSERT INTO accounts (id, user_id, account_id, provider_id, password)
VALUES (
    gen_random_uuid()::text,
    '<USER_ID_FROM_STEP_2>',
    '<USER_ID_FROM_STEP_2>',
    'credential',
    '$2a$10$...'  -- bcrypt hash of password
);
```

### Recommended Solution: Build Admin Panel

**Phase 3 or 4 should include:**

#### Admin User Management Features
1. **User List View**
   - Table showing all users
   - Filter by role (ADMIN, CPA, CLIENT)
   - Search by name/email
   - Status indicators

2. **Create User Form**
   - Email, name, role dropdown
   - Temporary password generation
   - Email invitation with password reset link
   - Role assignment

3. **Edit User**
   - Update name, email
   - Change role
   - Reset password
   - Activate/deactivate account

4. **Delete User**
   - Soft delete (mark as inactive)
   - Warning if user has assigned clients
   - Reassignment workflow

#### API Endpoints Needed

```typescript
// GET /api/admin/users - List all users
// POST /api/admin/users - Create new user
// GET /api/admin/users/[id] - Get user details
// PATCH /api/admin/users/[id] - Update user
// DELETE /api/admin/users/[id] - Delete user
```

#### Implementation Priority

**High Priority** (Should add to Phase 3):
- Create CPA user (ADMIN only)
- List all users
- Edit user details
- Deactivate user

**Medium Priority**:
- Bulk user import (CSV)
- Email invitations
- Password reset by admin

**Low Priority**:
- Audit log for user changes
- User activity tracking

## Workflow: How Admin Should Add a New CPA

### Ideal User Flow (Once Built)

1. **Admin logs in** → Sees admin dashboard
2. **Navigates to "Users"** → See user management panel
3. **Clicks "Add New User"** → Opens user creation form
4. **Fills in details:**
   - Email: `newcpa@example.com`
   - Name: `John Doe`
   - Role: `CPA` (dropdown)
   - Generate temporary password
5. **Clicks "Create & Send Invitation"**
6. **System:**
   - Creates user record in database
   - Generates secure temporary password
   - Sends email invitation with login link
   - Sets `email_verified = false`
7. **New CPA receives email** → Clicks link → Sets own password → Verified

### Temporary Workaround (Current State)

Since admin UI doesn't exist yet:
1. Admin contacts developer/database admin
2. Developer runs SQL script to create user
3. Developer provides credentials to new CPA
4. CPA logs in with provided credentials

## Next Steps

### Immediate (Phase 2.5 or 2.6)
- [x] Add authentication
- [x] Add role-based views
- [ ] **Add basic user management UI for ADMIN**
  - User list page
  - Create user form
  - Simple CRUD operations

### Phase 3
- [ ] Full admin panel with user management
- [ ] Email invitations
- [ ] Password reset by admin
- [ ] User activity logs

### Phase 4
- [ ] Advanced user management
- [ ] Bulk user import
- [ ] Role permissions customization
- [ ] Audit trail

## Security Considerations

### When Building User Management

1. **Authorization:**
   - Only ADMIN can create/edit/delete users
   - CPAs cannot modify their own role
   - Proper role checks on all endpoints

2. **Password Handling:**
   - Never store plain text passwords
   - Use bcrypt for hashing (as Better Auth does)
   - Enforce strong password requirements
   - Temporary passwords should expire

3. **Email Verification:**
   - Send verification emails
   - Require email verification before full access
   - Time-limited verification tokens

4. **Audit Logging:**
   - Log all user creation/modification
   - Track who made changes
   - Timestamp all actions

## Conclusion

**Yes, we have a database with roles**, but **no admin UI yet** to manage users. This is a critical gap that should be addressed soon, ideally in Phase 2.5 or early Phase 3.

Current workaround is direct database manipulation, but this is not sustainable for production use.
