# CPA Automation Database Schema Documentation

## Overview

**Database**: `cpa_automation_db`
**Schema**: `cpa_automation`
**PostgreSQL Version**: 14.2
**Character Encoding**: UTF8

---

## Table of Contents

1. [Entity Relationship Diagram](#entity-relationship-diagram)
2. [Database Tables](#database-tables)
3. [Enumerations](#enumerations)
4. [Relationships & Foreign Keys](#relationships--foreign-keys)
5. [Indexes](#indexes)
6. [Triggers & Functions](#triggers--functions)
7. [Data Flow Diagrams](#data-flow-diagrams)

---

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         CPA AUTOMATION DATABASE SCHEMA                          │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐         ┌──────────────────────┐
│       USERS          │         │      CLIENTS         │         │     DOCUMENTS        │
├──────────────────────┤         ├──────────────────────┤         ├──────────────────────┤
│ • id (PK)            │◄────────│ • id (PK)            │◄────────│ • id (PK)            │
│ • email (UNIQUE)     │         │ • user_id (FK)       │         │ • client_id (FK)     │
│ • password_hash      │         │ • name               │         │ • file_name          │
│ • name               │         │ • email              │         │ • file_url           │
│ • role (ENUM)        │         │ • phone              │         │ • file_size          │
│ • status (ENUM)      │         │ • entity_type (ENUM) │         │ • file_type          │
│ • phone              │         │ • tax_year           │         │ • document_type      │
│ • avatar_url         │         │ • status (ENUM)      │         │   (ENUM)             │
│ • last_login_at      │    ┌────│ • assigned_to_id(FK) │         │ • is_verified        │
│ • created_at         │    │    │ • business_name      │         │ • uploaded_by_id(FK) │
│ • updated_at         │    │    │ • ein                │         │ • notes              │
└──────────────────────┘    │    │ • ssn_last_four      │         │ • uploaded_at        │
         ▲                  │    │ • address_line1      │         └──────────────────────┘
         │                  │    │ • address_line2      │                  │
         │                  │    │ • city               │                  │
         │                  │    │ • state              │                  │
    Assigned To             │    │ • zip_code           │                  │
         │                  │    │ • country            │                  │
         │                  │    │ • notes              │                  │
         │                  │    │ • progress_%         │                  │
         │                  │    │ • created_at         │                  │
         │                  │    │ • updated_at         │                  │
         │                  │    └──────────────────────┘                  │
         │                  │             ▲                                │
         │                  │             │                                │
         │                  │             │                                │
         │                  └─────────────┼────────────────────────────────┘
         │                                │
         │                                │
┌────────┴─────────────┐      ┌──────────┴───────────┐       ┌──────────────────────┐
│      TASKS           │      │     MESSAGES         │       │   TIME_LOGS          │
├──────────────────────┤      ├──────────────────────┤       ├──────────────────────┤
│ • id (PK)            │      │ • id (PK)            │       │ • id (PK)            │
│ • client_id (FK)     │──────│ • client_id (FK)     │       │ • task_id (FK)       │
│ • title              │      │ • sender_id (FK)     │       │ • user_id (FK)       │
│ • description        │      │ • sender_type (ENUM) │       │ • hours              │
│ • status (ENUM)      │      │ • content            │       │ • hourly_rate        │
│ • assigned_to_id(FK) │──┐   │ • is_read            │       │ • description        │
│ • due_date           │  │   │ • read_at            │       │ • logged_at          │
│ • priority           │  │   │ • parent_message_id  │       │ • created_at         │
│ • is_completed       │  │   │   (FK, self-ref)     │       └──────────────────────┘
│ • completed_at       │  │   │ • created_at         │                   │
│ • created_by_id (FK) │  │   └──────────────────────┘                   │
│ • created_at         │  │            ▲                                 │
│ • updated_at         │  │            │                                 │
└──────────────────────┘  │            │                                 │
         │                │            │                                 │
         │                └────────────┼─────────────────────────────────┘
         │                             │
         ▼                             │
┌──────────────────────┐               │
│     INVOICES         │               │
├──────────────────────┤               │
│ • id (PK)            │               │
│ • client_id (FK)     │───────────────┘
│ • invoice_number     │
│   (UNIQUE)           │
│ • amount             │
│ • tax                │
│ • total              │
│ • status (ENUM)      │
│ • due_date           │
│ • paid_at            │
│ • payment_method     │
│ • notes              │
│ • created_by_id (FK) │
│ • created_at         │
│ • updated_at         │
└──────────────────────┘


         Supporting Tables
         ═════════════════

┌──────────────────────────┐        ┌──────────────────────────┐
│   MESSAGE_TEMPLATES      │        │    AI_FAQ_RESPONSES      │
├──────────────────────────┤        ├──────────────────────────┤
│ • id (PK)                │        │ • id (PK)                │
│ • name                   │        │ • question               │
│ • subject                │        │ • keywords (ARRAY)       │
│ • content                │        │ • response               │
│ • category               │        │ • category               │
│ • variables (JSONB)      │        │ • usage_count            │
│ • created_by_id (FK)     │        │ • created_at             │
│ • created_at             │        │ • updated_at             │
│ • updated_at             │        └──────────────────────────┘
└──────────────────────────┘

┌──────────────────────────┐
│      AUDIT_LOG           │
├──────────────────────────┤
│ • id (PK)                │
│ • user_id (FK)           │
│ • action                 │
│ • entity_type            │
│ • entity_id              │
│ • old_values (JSONB)     │
│ • new_values (JSONB)     │
│ • ip_address             │
│ • user_agent             │
│ • created_at             │
└──────────────────────────┘
```

---

## Database Tables

### 1. USERS
**Purpose**: Central authentication and user management table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique user identifier |
| email | CITEXT | NOT NULL, UNIQUE | Case-insensitive email |
| password_hash | TEXT | NOT NULL | Hashed password (bcrypt) |
| name | VARCHAR(255) | NOT NULL | User's full name |
| role | user_role | NOT NULL, DEFAULT 'CLIENT' | ADMIN, CPA, or CLIENT |
| status | user_status | NOT NULL, DEFAULT 'active' | Account status |
| phone | VARCHAR(20) | NULL | Contact phone number |
| avatar_url | TEXT | NULL | Profile picture URL |
| last_login_at | TIMESTAMPTZ | NULL | Last login timestamp |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Account creation time |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update time |

**Indexes**:
- `idx_users_email` on (email)
- `idx_users_role` on (role)
- `idx_users_status` on (status)

---

### 2. CLIENTS
**Purpose**: Store client information and track their position in the workflow

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique client identifier |
| user_id | UUID | FK → users(id) | Link to user account (optional) |
| name | VARCHAR(255) | NOT NULL | Client's full name |
| email | CITEXT | NOT NULL | Client's email |
| phone | VARCHAR(20) | NULL | Contact phone |
| entity_type | entity_type | NOT NULL | Tax entity type |
| tax_year | INTEGER | NOT NULL | Tax year being filed |
| status | client_status | NOT NULL, DEFAULT 'INTAKE' | Workflow stage |
| assigned_to_id | UUID | FK → users(id) | Assigned CPA |
| business_name | VARCHAR(255) | NULL | Business name (if applicable) |
| ein | VARCHAR(20) | NULL | Employer ID Number |
| ssn_last_four | VARCHAR(4) | NULL | Last 4 digits of SSN |
| address_line1 | VARCHAR(255) | NULL | Street address |
| address_line2 | VARCHAR(255) | NULL | Apt/Suite number |
| city | VARCHAR(100) | NULL | City |
| state | VARCHAR(50) | NULL | State |
| zip_code | VARCHAR(10) | NULL | ZIP code |
| country | VARCHAR(100) | DEFAULT 'USA' | Country |
| notes | TEXT | NULL | Internal notes |
| progress_percentage | INTEGER | DEFAULT 0, CHECK 0-100 | Completion progress |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update |

**Indexes**:
- `idx_clients_user_id` on (user_id)
- `idx_clients_status` on (status)
- `idx_clients_assigned_to` on (assigned_to_id)
- `idx_clients_tax_year` on (tax_year)
- `idx_clients_entity_type` on (entity_type)

---

### 3. DOCUMENTS
**Purpose**: Track uploaded tax documents and supporting files

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Document identifier |
| client_id | UUID | FK → clients(id), NOT NULL | Owner client |
| file_name | VARCHAR(255) | NOT NULL | Original filename |
| file_url | TEXT | NOT NULL | Storage URL/path |
| file_size | BIGINT | NULL | File size in bytes |
| file_type | VARCHAR(100) | NULL | MIME type |
| document_type | document_type | NOT NULL | Classified doc type |
| is_verified | BOOLEAN | DEFAULT FALSE | Verification status |
| uploaded_by_id | UUID | FK → users(id) | Uploader |
| notes | TEXT | NULL | Document notes |
| uploaded_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Upload timestamp |

**Indexes**:
- `idx_documents_client_id` on (client_id)
- `idx_documents_document_type` on (document_type)
- `idx_documents_uploaded_at` on (uploaded_at)

---

### 4. TASKS
**Purpose**: Kanban-style task management and workflow tracking

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Task identifier |
| client_id | UUID | FK → clients(id), NOT NULL | Related client |
| title | VARCHAR(255) | NOT NULL | Task title |
| description | TEXT | NULL | Task details |
| status | task_status | NOT NULL, DEFAULT 'INTAKE' | Current stage |
| assigned_to_id | UUID | FK → users(id) | Assigned staff |
| due_date | DATE | NULL | Task deadline |
| priority | VARCHAR(20) | DEFAULT 'MEDIUM' | Priority level |
| is_completed | BOOLEAN | DEFAULT FALSE | Completion flag |
| completed_at | TIMESTAMPTZ | NULL | Completion time |
| created_by_id | UUID | FK → users(id) | Task creator |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update |

**Indexes**:
- `idx_tasks_client_id` on (client_id)
- `idx_tasks_status` on (status)
- `idx_tasks_assigned_to` on (assigned_to_id)
- `idx_tasks_due_date` on (due_date)
- `idx_tasks_is_completed` on (is_completed)

---

### 5. MESSAGES
**Purpose**: Communication hub for CPA-client interactions and AI responses

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Message identifier |
| client_id | UUID | FK → clients(id), NOT NULL | Related client |
| sender_id | UUID | FK → users(id) | Sender (NULL for AI/system) |
| sender_type | message_sender_type | NOT NULL, DEFAULT 'USER' | Message source type |
| content | TEXT | NOT NULL | Message content |
| is_read | BOOLEAN | DEFAULT FALSE | Read status |
| read_at | TIMESTAMPTZ | NULL | Read timestamp |
| parent_message_id | UUID | FK → messages(id) | Thread parent (self-ref) |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Send time |

**Indexes**:
- `idx_messages_client_id` on (client_id)
- `idx_messages_sender_id` on (sender_id)
- `idx_messages_created_at` on (created_at)
- `idx_messages_is_read` on (is_read)

---

### 6. MESSAGE_TEMPLATES
**Purpose**: Pre-defined message templates for common communications

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Template identifier |
| name | VARCHAR(255) | NOT NULL | Template name |
| subject | VARCHAR(255) | NULL | Email subject |
| content | TEXT | NOT NULL | Template content |
| category | VARCHAR(100) | NULL | Template category |
| variables | JSONB | NULL | Template variables |
| created_by_id | UUID | FK → users(id) | Creator |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update |

**Indexes**:
- `idx_message_templates_category` on (category)

---

### 7. TIME_LOGS
**Purpose**: Track time spent on tasks for billing purposes

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Log identifier |
| task_id | UUID | FK → tasks(id), NOT NULL | Related task |
| user_id | UUID | FK → users(id), NOT NULL | Staff member |
| hours | DECIMAL(10,2) | NOT NULL, CHECK > 0 | Hours worked |
| hourly_rate | DECIMAL(10,2) | NULL | Billing rate |
| description | TEXT | NULL | Work description |
| logged_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Log timestamp |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation |

**Indexes**:
- `idx_time_logs_task_id` on (task_id)
- `idx_time_logs_user_id` on (user_id)
- `idx_time_logs_logged_at` on (logged_at)

---

### 8. INVOICES
**Purpose**: Billing and payment tracking

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Invoice identifier |
| client_id | UUID | FK → clients(id), NOT NULL | Billed client |
| invoice_number | VARCHAR(50) | NOT NULL, UNIQUE | Invoice number |
| amount | DECIMAL(10,2) | NOT NULL, CHECK >= 0 | Subtotal |
| tax | DECIMAL(10,2) | DEFAULT 0 | Tax amount |
| total | DECIMAL(10,2) | NOT NULL, CHECK >= 0 | Total amount |
| status | invoice_status | NOT NULL, DEFAULT 'DRAFT' | Payment status |
| due_date | DATE | NULL | Payment due date |
| paid_at | TIMESTAMPTZ | NULL | Payment timestamp |
| payment_method | VARCHAR(50) | NULL | Payment method |
| notes | TEXT | NULL | Invoice notes |
| created_by_id | UUID | FK → users(id) | Invoice creator |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update |

**Indexes**:
- `idx_invoices_client_id` on (client_id)
- `idx_invoices_status` on (status)
- `idx_invoices_due_date` on (due_date)
- `idx_invoices_invoice_number` on (invoice_number)

---

### 9. AI_FAQ_RESPONSES
**Purpose**: Mock AI chatbot responses for common tax questions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Response identifier |
| question | TEXT | NOT NULL | FAQ question |
| keywords | TEXT[] | NOT NULL | Search keywords array |
| response | TEXT | NOT NULL | Answer text |
| category | VARCHAR(100) | NULL | Question category |
| usage_count | INTEGER | DEFAULT 0 | Times used |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update |

**Indexes**:
- `idx_ai_faq_category` on (category)
- `idx_ai_faq_keywords` on (keywords) using GIN

---

### 10. AUDIT_LOG
**Purpose**: Track all important system events for compliance and debugging

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Log entry identifier |
| user_id | UUID | FK → users(id) | Acting user |
| action | VARCHAR(100) | NOT NULL | Action performed |
| entity_type | VARCHAR(100) | NULL | Affected entity type |
| entity_id | UUID | NULL | Affected entity ID |
| old_values | JSONB | NULL | Before state |
| new_values | JSONB | NULL | After state |
| ip_address | VARCHAR(45) | NULL | Client IP |
| user_agent | TEXT | NULL | Browser/client info |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Event time |

**Indexes**:
- `idx_audit_log_user_id` on (user_id)
- `idx_audit_log_action` on (action)
- `idx_audit_log_created_at` on (created_at)

---

## Enumerations

### user_role
```sql
CREATE TYPE cpa_automation.user_role AS ENUM (
    'ADMIN',    -- System administrators
    'CPA',      -- Certified Public Accountants
    'CLIENT'    -- Tax clients
);
```

### user_status
```sql
CREATE TYPE cpa_automation.user_status AS ENUM (
    'active',    -- Active account
    'inactive',  -- Temporarily disabled
    'pending'    -- Awaiting activation
);
```

### entity_type
```sql
CREATE TYPE cpa_automation.entity_type AS ENUM (
    'INDIVIDUAL',   -- Personal tax return (1040)
    'LLC',          -- Limited Liability Company
    'S_CORP',       -- S Corporation
    'C_CORP',       -- C Corporation
    'PARTNERSHIP',  -- Partnership
    'TRUST',        -- Trust
    'OTHER'         -- Other entity types
);
```

### client_status
```sql
CREATE TYPE cpa_automation.client_status AS ENUM (
    'INTAKE',       -- Initial onboarding
    'PREPARATION',  -- Return being prepared
    'REVIEW',       -- Under review
    'FILED',        -- Successfully filed
    'INVOICED',     -- Invoice generated
    'COMPLETED'     -- Fully completed
);
```

### document_type
```sql
CREATE TYPE cpa_automation.document_type AS ENUM (
    'W2',           -- W-2 wage statement
    '1099_MISC',    -- 1099-MISC
    '1099_NEC',     -- 1099-NEC (non-employee compensation)
    '1099_INT',     -- 1099-INT (interest)
    '1099_DIV',     -- 1099-DIV (dividends)
    'SCHEDULE_C',   -- Schedule C business income
    'RECEIPT',      -- Business receipt/expense
    'INVOICE',      -- Invoice
    'STATEMENT',    -- Bank/financial statement
    'ID',           -- Identification document
    'OTHER'         -- Other documents
);
```

### task_status
```sql
CREATE TYPE cpa_automation.task_status AS ENUM (
    'INTAKE',       -- Initial stage
    'PREPARATION',  -- Being worked on
    'REVIEW',       -- Under review
    'FILED',        -- Completed filing
    'INVOICED'      -- Billed
);
```

### invoice_status
```sql
CREATE TYPE cpa_automation.invoice_status AS ENUM (
    'DRAFT',        -- Not yet sent
    'PENDING',      -- Sent, awaiting payment
    'PAID',         -- Payment received
    'OVERDUE',      -- Past due date
    'CANCELLED'     -- Cancelled invoice
);
```

### message_sender_type
```sql
CREATE TYPE cpa_automation.message_sender_type AS ENUM (
    'USER',     -- Human user (CPA or client)
    'AI',       -- AI chatbot
    'SYSTEM'    -- System notification
);
```

---

## Relationships & Foreign Keys

### Primary Relationships

```
users (1) ──────< (M) clients [user_id]
  └─ One user can have multiple client records

users (1) ──────< (M) clients [assigned_to_id]
  └─ One CPA can be assigned to multiple clients

clients (1) ─────< (M) documents [client_id]
  └─ One client can have multiple documents

clients (1) ─────< (M) tasks [client_id]
  └─ One client can have multiple tasks

clients (1) ─────< (M) messages [client_id]
  └─ One client can have multiple messages

clients (1) ─────< (M) invoices [client_id]
  └─ One client can have multiple invoices

tasks (1) ───────< (M) time_logs [task_id]
  └─ One task can have multiple time log entries

users (1) ───────< (M) time_logs [user_id]
  └─ One user can log time to multiple tasks

users (1) ───────< (M) messages [sender_id]
  └─ One user can send multiple messages

messages (1) ────< (M) messages [parent_message_id]
  └─ Self-referential: messages can be replies to other messages
```

### Cascade Behaviors

```
ON DELETE CASCADE:
├─ clients.user_id → users.id
│  └─ If user deleted, delete associated client records
├─ documents.client_id → clients.id
│  └─ If client deleted, delete all documents
├─ tasks.client_id → clients.id
│  └─ If client deleted, delete all tasks
├─ messages.client_id → clients.id
│  └─ If client deleted, delete all messages
├─ invoices.client_id → clients.id
│  └─ If client deleted, delete all invoices
└─ time_logs.task_id → tasks.id
   └─ If task deleted, delete all time logs

ON DELETE SET NULL:
├─ clients.assigned_to_id → users.id
│  └─ If CPA deleted, set assigned_to_id to NULL
├─ tasks.assigned_to_id → users.id
│  └─ If staff deleted, unassign tasks
├─ documents.uploaded_by_id → users.id
│  └─ If uploader deleted, keep document but clear uploader
└─ invoices.created_by_id → users.id
   └─ If creator deleted, keep invoice but clear creator
```

---

## Indexes

### Purpose of Each Index

**Performance Optimization**:
```
Fast Lookups:
├─ idx_users_email          → Login queries
├─ idx_clients_status       → Kanban board filtering
├─ idx_tasks_assigned_to    → Staff workload queries
└─ idx_messages_is_read     → Unread message counts

Efficient JOINs:
├─ idx_clients_user_id      → User-to-client relationships
├─ idx_documents_client_id  → Client documents listing
├─ idx_tasks_client_id      → Client tasks listing
└─ idx_time_logs_task_id    → Task billing calculations

Date-based Queries:
├─ idx_tasks_due_date       → Deadline calendar views
├─ idx_documents_uploaded_at → Recent uploads
└─ idx_audit_log_created_at → Audit trail searches

Specialized:
├─ idx_ai_faq_keywords (GIN) → Full-text keyword search
└─ idx_invoices_invoice_number → Invoice lookup
```

---

## Triggers & Functions

### Auto-Update Timestamp Trigger

```sql
CREATE OR REPLACE FUNCTION cpa_automation.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
```

**Applied to Tables**:
- users
- clients
- tasks
- message_templates
- invoices
- ai_faq_responses

**Trigger Definition** (example):
```sql
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON cpa_automation.users
    FOR EACH ROW
    EXECUTE FUNCTION cpa_automation.update_updated_at_column();
```

---

## Data Flow Diagrams

### Client Onboarding Flow

```
┌─────────────┐
│   CLIENT    │
│  SIGN UP    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  CREATE users RECORD            │
│  role = 'CLIENT'                │
│  status = 'active'              │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  CREATE clients RECORD          │
│  user_id → users.id             │
│  status = 'INTAKE'              │
│  assigned_to_id = <CPA>         │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  CREATE task RECORD             │
│  client_id → clients.id         │
│  status = 'INTAKE'              │
│  title = "Initial onboarding"  │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  SEND welcome message           │
│  CREATE messages RECORD         │
│  sender_type = 'SYSTEM'         │
└─────────────────────────────────┘
```

### Document Upload & Classification Flow

```
┌─────────────┐
│   CLIENT    │
│  UPLOADS    │
│  DOCUMENT   │
└──────┬──────┘
       │
       ▼
┌────────────────────────────────────┐
│  STORE file to S3/local storage    │
│  Get file_url                      │
└──────┬─────────────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│  MOCK AI: Classify document type   │
│  Based on filename pattern:        │
│  - "*w2*" → W2                     │
│  - "*1099*" → 1099_MISC            │
│  - "*receipt*" → RECEIPT           │
└──────┬─────────────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│  CREATE documents RECORD           │
│  client_id → clients.id            │
│  document_type = <classified>      │
│  is_verified = FALSE               │
└──────┬─────────────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│  UPDATE clients                    │
│  progress_percentage += increment  │
└──────┬─────────────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│  NOTIFY assigned CPA               │
│  CREATE messages RECORD            │
│  sender_type = 'SYSTEM'            │
│  content = "New document uploaded" │
└────────────────────────────────────┘
```

### Task Workflow State Machine

```
     START
       │
       ▼
  ┌─────────┐
  │ INTAKE  │◄──────────┐
  └────┬────┘           │
       │                │
       │ Assign CPA     │ Need more docs
       │ Upload docs    │
       ▼                │
  ┌─────────────┐       │
  │ PREPARATION │───────┘
  └────┬────────┘
       │
       │ Complete return
       │
       ▼
  ┌─────────┐
  │ REVIEW  │
  └────┬────┘
       │
       │ Approve
       ▼
  ┌─────────┐
  │  FILED  │
  └────┬────┘
       │
       │ Generate invoice
       ▼
  ┌──────────┐
  │ INVOICED │
  └────┬─────┘
       │
       │ Payment received
       ▼
     END
```

### Billing & Time Tracking Flow

```
┌─────────────┐
│     CPA     │
│  WORKS ON   │
│    TASK     │
└──────┬──────┘
       │
       ▼
┌──────────────────────────────┐
│  CREATE time_logs RECORD     │
│  task_id → tasks.id          │
│  user_id → users.id (CPA)    │
│  hours = <time spent>        │
│  hourly_rate = <CPA rate>    │
└──────┬───────────────────────┘
       │
       │ (Multiple time logs)
       │
       ▼
┌──────────────────────────────┐
│  Task status → 'FILED'       │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  AGGREGATE time_logs         │
│  SUM(hours * hourly_rate)    │
│  GROUP BY task.client_id     │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  CREATE invoices RECORD      │
│  client_id → clients.id      │
│  amount = <total>            │
│  status = 'PENDING'          │
│  invoice_number = auto-gen   │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  UPDATE clients              │
│  status = 'INVOICED'         │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  SEND invoice to client      │
│  (Email notification mock)   │
└──────────────────────────────┘
```

### Message Thread Structure

```
messages Table (Self-referential)

┌─────────────────────────────────────────┐
│ id: msg-001                             │
│ parent_message_id: NULL                 │
│ sender_type: 'USER'                     │
│ content: "Hi, I have a question..."     │
└──────────────┬──────────────────────────┘
               │
               ├─────────────────────────────────┐
               │                                 │
               ▼                                 ▼
┌──────────────────────────────┐  ┌──────────────────────────────┐
│ id: msg-002                  │  │ id: msg-003                  │
│ parent_message_id: msg-001   │  │ parent_message_id: msg-001   │
│ sender_type: 'AI'            │  │ sender_type: 'USER' (CPA)    │
│ content: "AI response..."    │  │ content: "Let me help..."    │
└──────────────────────────────┘  └──────────┬───────────────────┘
                                             │
                                             ▼
                                  ┌──────────────────────────────┐
                                  │ id: msg-004                  │
                                  │ parent_message_id: msg-003   │
                                  │ sender_type: 'USER' (Client) │
                                  │ content: "Thank you!"        │
                                  └──────────────────────────────┘
```

---

## Query Patterns

### Common Queries

**1. Get Client Dashboard Data**
```sql
SELECT
    c.id,
    c.name,
    c.status,
    c.progress_percentage,
    u.name as assigned_cpa,
    COUNT(DISTINCT d.id) as document_count,
    COUNT(DISTINCT t.id) as task_count,
    COUNT(DISTINCT CASE WHEN m.is_read = FALSE THEN m.id END) as unread_messages
FROM cpa_automation.clients c
LEFT JOIN cpa_automation.users u ON c.assigned_to_id = u.id
LEFT JOIN cpa_automation.documents d ON c.id = d.client_id
LEFT JOIN cpa_automation.tasks t ON c.id = t.client_id
LEFT JOIN cpa_automation.messages m ON c.id = m.client_id
WHERE c.id = $1
GROUP BY c.id, u.name;
```

**2. Kanban Board - Clients by Status**
```sql
SELECT
    c.*,
    u.name as assigned_cpa_name,
    COUNT(d.id) as document_count,
    MAX(t.due_date) as next_deadline
FROM cpa_automation.clients c
LEFT JOIN cpa_automation.users u ON c.assigned_to_id = u.id
LEFT JOIN cpa_automation.documents d ON c.id = d.client_id
LEFT JOIN cpa_automation.tasks t ON c.id = t.client_id AND t.is_completed = FALSE
WHERE c.status = $1
GROUP BY c.id, u.name
ORDER BY c.created_at DESC;
```

**3. Staff Workload Report**
```sql
SELECT
    u.id,
    u.name,
    u.role,
    COUNT(DISTINCT c.id) as active_clients,
    COUNT(DISTINCT t.id) as active_tasks,
    COUNT(DISTINCT CASE WHEN t.due_date < CURRENT_DATE THEN t.id END) as overdue_tasks
FROM cpa_automation.users u
LEFT JOIN cpa_automation.clients c ON u.id = c.assigned_to_id AND c.status NOT IN ('COMPLETED', 'INVOICED')
LEFT JOIN cpa_automation.tasks t ON u.id = t.assigned_to_id AND t.is_completed = FALSE
WHERE u.role IN ('CPA', 'ADMIN')
GROUP BY u.id, u.name, u.role
ORDER BY active_clients DESC;
```

**4. Revenue Analytics**
```sql
SELECT
    DATE_TRUNC('month', i.created_at) as month,
    COUNT(*) as invoice_count,
    SUM(CASE WHEN i.status = 'PAID' THEN i.total ELSE 0 END) as paid_amount,
    SUM(CASE WHEN i.status = 'PENDING' THEN i.total ELSE 0 END) as pending_amount,
    SUM(CASE WHEN i.status = 'OVERDUE' THEN i.total ELSE 0 END) as overdue_amount
FROM cpa_automation.invoices i
WHERE i.created_at >= DATE_TRUNC('year', CURRENT_DATE)
GROUP BY DATE_TRUNC('month', i.created_at)
ORDER BY month DESC;
```

**5. AI FAQ Keyword Search**
```sql
SELECT
    question,
    response,
    category,
    usage_count
FROM cpa_automation.ai_faq_responses
WHERE keywords @> ARRAY[$1]  -- Contains keyword
ORDER BY usage_count DESC
LIMIT 5;
```

---

## Data Integrity Rules

### Business Logic Constraints

```
✓ Users
  - Email must be unique (enforced by UNIQUE constraint)
  - Password must be hashed (application-level validation)
  - Phone format validation (application-level)

✓ Clients
  - Progress percentage must be 0-100 (CHECK constraint)
  - Cannot be assigned to non-CPA users (application-level)
  - Tax year must be realistic (application-level: 1900-current+1)

✓ Documents
  - Must be associated with a client (NOT NULL on client_id)
  - File size should be reasonable (application-level: max 50MB)

✓ Tasks
  - Due date cannot be in past for new tasks (application-level)
  - Status must match client status flow (application-level)

✓ Time Logs
  - Hours must be positive (CHECK constraint: hours > 0)
  - Cannot log more than 24 hours per day (application-level)

✓ Invoices
  - Invoice number must be unique (UNIQUE constraint)
  - Amount, tax, total must be >= 0 (CHECK constraints)
  - total should equal amount + tax (application-level)
```

---

## Migration Strategy

### Initial Setup
```bash
# Run SQL scripts in order:
1. 01_001_init.sql          # Extensions
2. 02_002_db_user_roles.sql # Roles and permissions
3. 03_cpa_automation_schema.sql # Tables and types
4. 04_data_seed.sql         # Seed data (dev only)
```

### Future Migrations
```
For Prisma-managed migrations:
1. Update prisma/schema.prisma
2. Run: npx prisma migrate dev --name <description>
3. Commit migration files to version control
```

---

## Security Considerations

### Implemented
✅ Role-based database user (`cpa_automation_app_user`)
✅ Schema-based isolation
✅ Foreign key constraints for referential integrity
✅ Indexes on sensitive lookups to prevent table scans
✅ UUID primary keys (harder to enumerate)
✅ Password hashing (application-level)

### Future Implementation
🔒 Row-level security (RLS) policies
🔒 Encryption at rest
🔒 Audit logging for PII access
🔒 Data retention policies
🔒 Backup and disaster recovery
🔒 GDPR compliance (right to deletion)

---

## Performance Optimization

### Current Optimizations
- Strategic indexes on foreign keys
- GIN index for full-text search on FAQ keywords
- Timestamp indexes for time-series queries
- Composite indexes where needed (future)

### Future Optimizations
- Materialized views for analytics dashboards
- Partitioning for time_logs and audit_log tables (by date)
- Read replicas for reporting queries
- Connection pooling (PgBouncer)
- Query result caching (Redis)

---

## Backup & Recovery

### Recommended Strategy
```bash
# Daily backups
pg_dump -U boilerplatedb_admin -d cpa_automation_db -F c -f backup_$(date +%Y%m%d).dump

# Point-in-time recovery setup
# Enable WAL archiving in postgresql.conf
wal_level = replica
archive_mode = on
archive_command = 'cp %p /path/to/archive/%f'
```

---

## Maintenance

### Regular Tasks
```sql
-- Analyze tables for query optimization
ANALYZE cpa_automation.users;
ANALYZE cpa_automation.clients;
ANALYZE cpa_automation.tasks;

-- Vacuum to reclaim space
VACUUM ANALYZE cpa_automation.audit_log;

-- Check table sizes
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'cpa_automation'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

**Document Version**: 1.0
**Last Updated**: November 14, 2025
**Schema Version**: POC v0.0.1
