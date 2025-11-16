/******************************
	FEATURE: cpa-automation-core-schema
	RELEASE: 0.0.1 (POC)
	AUTHOR:  CPA Command Center
	Database: cpa_automation_db
	Schema: cpa_automation
******************************/

-- Switch to the correct database
\c cpa_automation_db;

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Ensure we're using the correct schema and can access extensions
SET search_path TO cpa_automation, public;

/* ----------------------------------------------------------------------
   Enumerations / lookup types
   ------------------------------------------------------------------- */

-- User roles
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE cpa_automation.user_role AS ENUM ('ADMIN', 'CPA', 'CLIENT');
    END IF;
END $$;

-- User account status
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
        CREATE TYPE cpa_automation.user_status AS ENUM ('active', 'inactive', 'pending');
    END IF;
END $$;

-- Entity types for clients
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'entity_type') THEN
        CREATE TYPE cpa_automation.entity_type AS ENUM ('INDIVIDUAL', 'LLC', 'S_CORP', 'C_CORP', 'PARTNERSHIP', 'TRUST', 'OTHER');
    END IF;
END $$;

-- Client status in workflow
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'client_status') THEN
        CREATE TYPE cpa_automation.client_status AS ENUM ('INTAKE', 'PREPARATION', 'REVIEW', 'FILED', 'INVOICED', 'COMPLETED');
    END IF;
END $$;

-- Document types
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_type') THEN
        CREATE TYPE cpa_automation.document_type AS ENUM ('W2', '1099_MISC', '1099_NEC', '1099_INT', '1099_DIV', 'SCHEDULE_C', 'RECEIPT', 'INVOICE', 'STATEMENT', 'ID', 'OTHER');
    END IF;
END $$;

-- Task status
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
        CREATE TYPE cpa_automation.task_status AS ENUM ('INTAKE', 'PREPARATION', 'REVIEW', 'FILED', 'INVOICED');
    END IF;
END $$;

-- Invoice status
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invoice_status') THEN
        CREATE TYPE cpa_automation.invoice_status AS ENUM ('DRAFT', 'PENDING', 'PAID', 'OVERDUE', 'CANCELLED');
    END IF;
END $$;

-- Message sender type
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'message_sender_type') THEN
        CREATE TYPE cpa_automation.message_sender_type AS ENUM ('USER', 'AI', 'SYSTEM');
    END IF;
END $$;

/* ----------------------------------------------------------------------
   USERS: Authentication and user management
   ------------------------------------------------------------------- */
CREATE TABLE IF NOT EXISTS cpa_automation.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email public.CITEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    role cpa_automation.user_role NOT NULL DEFAULT 'CLIENT',
    status cpa_automation.user_status NOT NULL DEFAULT 'active',
    "emailVerified" BOOLEAN DEFAULT false,
    image TEXT,
    phone VARCHAR(20),
    avatar_url TEXT,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON cpa_automation.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON cpa_automation.users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON cpa_automation.users(status);

/* ----------------------------------------------------------------------
   SESSIONS: Better Auth session management
   ------------------------------------------------------------------- */
CREATE TABLE IF NOT EXISTS cpa_automation.session (
    id TEXT PRIMARY KEY,
    "userId" UUID NOT NULL REFERENCES cpa_automation.users(id) ON DELETE CASCADE,
    "expiresAt" TIMESTAMPTZ NOT NULL,
    token TEXT NOT NULL UNIQUE,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_session_user_id ON cpa_automation.session("userId");
CREATE INDEX IF NOT EXISTS idx_session_token ON cpa_automation.session(token);

/* ----------------------------------------------------------------------
   ACCOUNTS: Better Auth OAuth accounts (future use)
   ------------------------------------------------------------------- */
CREATE TABLE IF NOT EXISTS cpa_automation.accounts (
    id TEXT PRIMARY KEY,
    "userId" UUID NOT NULL REFERENCES cpa_automation.users(id) ON DELETE CASCADE,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    password TEXT,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE("providerId", "accountId")
);

CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON cpa_automation.accounts("userId");

/* ----------------------------------------------------------------------
   VERIFICATION: Better Auth email verification tokens
   ------------------------------------------------------------------- */
CREATE TABLE IF NOT EXISTS cpa_automation.verification (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    "expiresAt" TIMESTAMPTZ NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verification_identifier ON cpa_automation.verification(identifier);

/* ----------------------------------------------------------------------
   CLIENTS: Client information and onboarding
   ------------------------------------------------------------------- */
CREATE TABLE IF NOT EXISTS cpa_automation.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES cpa_automation.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email public.CITEXT NOT NULL,
    phone VARCHAR(20),
    entity_type cpa_automation.entity_type NOT NULL,
    tax_year INTEGER NOT NULL,
    status cpa_automation.client_status NOT NULL DEFAULT 'INTAKE',
    assigned_to_id UUID REFERENCES cpa_automation.users(id) ON DELETE SET NULL,
    business_name VARCHAR(255),
    ein VARCHAR(20),
    ssn_last_four VARCHAR(4),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(10),
    country VARCHAR(100) DEFAULT 'USA',
    notes TEXT,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clients_user_id ON cpa_automation.clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON cpa_automation.clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_assigned_to ON cpa_automation.clients(assigned_to_id);
CREATE INDEX IF NOT EXISTS idx_clients_tax_year ON cpa_automation.clients(tax_year);
CREATE INDEX IF NOT EXISTS idx_clients_entity_type ON cpa_automation.clients(entity_type);

/* ----------------------------------------------------------------------
   DOCUMENTS: Uploaded files and document management
   ------------------------------------------------------------------- */
CREATE TABLE IF NOT EXISTS cpa_automation.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES cpa_automation.clients(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(100),
    document_type cpa_automation.document_type NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    uploaded_by_id UUID REFERENCES cpa_automation.users(id) ON DELETE SET NULL,
    notes TEXT,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_client_id ON cpa_automation.documents(client_id);
CREATE INDEX IF NOT EXISTS idx_documents_document_type ON cpa_automation.documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_at ON cpa_automation.documents(uploaded_at);

/* ----------------------------------------------------------------------
   TASKS: Task management and workflow tracking
   ------------------------------------------------------------------- */
CREATE TABLE IF NOT EXISTS cpa_automation.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES cpa_automation.clients(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status cpa_automation.task_status NOT NULL DEFAULT 'INTAKE',
    assigned_to_id UUID REFERENCES cpa_automation.users(id) ON DELETE SET NULL,
    due_date DATE,
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_by_id UUID REFERENCES cpa_automation.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_client_id ON cpa_automation.tasks(client_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON cpa_automation.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON cpa_automation.tasks(assigned_to_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON cpa_automation.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_is_completed ON cpa_automation.tasks(is_completed);

/* ----------------------------------------------------------------------
   MESSAGES: Communication hub and chat history
   ------------------------------------------------------------------- */
CREATE TABLE IF NOT EXISTS cpa_automation.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES cpa_automation.clients(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES cpa_automation.users(id) ON DELETE SET NULL,
    sender_type cpa_automation.message_sender_type NOT NULL DEFAULT 'USER',
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    parent_message_id UUID REFERENCES cpa_automation.messages(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_client_id ON cpa_automation.messages(client_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON cpa_automation.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON cpa_automation.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON cpa_automation.messages(is_read);

/* ----------------------------------------------------------------------
   MESSAGE_TEMPLATES: Pre-defined message templates
   ------------------------------------------------------------------- */
CREATE TABLE IF NOT EXISTS cpa_automation.message_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    content TEXT NOT NULL,
    category VARCHAR(100),
    variables JSONB,
    created_by_id UUID REFERENCES cpa_automation.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_message_templates_category ON cpa_automation.message_templates(category);

/* ----------------------------------------------------------------------
   TIME_LOGS: Time tracking for billing
   ------------------------------------------------------------------- */
CREATE TABLE IF NOT EXISTS cpa_automation.time_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES cpa_automation.tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES cpa_automation.users(id) ON DELETE CASCADE,
    hours DECIMAL(10, 2) NOT NULL CHECK (hours > 0),
    hourly_rate DECIMAL(10, 2),
    description TEXT,
    logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_time_logs_task_id ON cpa_automation.time_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_time_logs_user_id ON cpa_automation.time_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_time_logs_logged_at ON cpa_automation.time_logs(logged_at);

/* ----------------------------------------------------------------------
   INVOICES: Billing and payment tracking
   ------------------------------------------------------------------- */
CREATE TABLE IF NOT EXISTS cpa_automation.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES cpa_automation.clients(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    tax DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    status cpa_automation.invoice_status NOT NULL DEFAULT 'DRAFT',
    due_date DATE,
    paid_at TIMESTAMPTZ,
    payment_method VARCHAR(50),
    notes TEXT,
    created_by_id UUID REFERENCES cpa_automation.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON cpa_automation.invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON cpa_automation.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON cpa_automation.invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON cpa_automation.invoices(invoice_number);

/* ----------------------------------------------------------------------
   AI_FAQ_RESPONSES: Mock AI responses for FAQ bot
   ------------------------------------------------------------------- */
CREATE TABLE IF NOT EXISTS cpa_automation.ai_faq_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    keywords TEXT[] NOT NULL,
    response TEXT NOT NULL,
    category VARCHAR(100),
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_faq_category ON cpa_automation.ai_faq_responses(category);
CREATE INDEX IF NOT EXISTS idx_ai_faq_keywords ON cpa_automation.ai_faq_responses USING GIN(keywords);

/* ----------------------------------------------------------------------
   AUDIT_LOG: Track important system events
   ------------------------------------------------------------------- */
CREATE TABLE IF NOT EXISTS cpa_automation.audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES cpa_automation.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON cpa_automation.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON cpa_automation.audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON cpa_automation.audit_log(created_at);

/* ----------------------------------------------------------------------
   Triggers for updated_at timestamps
   ------------------------------------------------------------------- */
CREATE OR REPLACE FUNCTION cpa_automation.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
DO $$
DECLARE
    t text;
BEGIN
    FOREACH t IN ARRAY ARRAY['users', 'clients', 'tasks', 'message_templates', 'invoices', 'ai_faq_responses']
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_%I_updated_at ON cpa_automation.%I;
            CREATE TRIGGER update_%I_updated_at
                BEFORE UPDATE ON cpa_automation.%I
                FOR EACH ROW
                EXECUTE FUNCTION cpa_automation.update_updated_at_column();
        ', t, t, t, t);
    END LOOP;
END $$;

-- Grant permissions to app user
GRANT USAGE ON SCHEMA cpa_automation TO cpa_automation_app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA cpa_automation TO cpa_automation_app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA cpa_automation TO cpa_automation_app_user;

-- Comments for documentation
COMMENT ON SCHEMA cpa_automation IS 'CPA Command Center - Automation and workflow management for tax preparation';
COMMENT ON TABLE cpa_automation.users IS 'User accounts for CPAs, admins, and clients';
COMMENT ON TABLE cpa_automation.clients IS 'Client information and tax filing details';
COMMENT ON TABLE cpa_automation.documents IS 'Uploaded tax documents and supporting files';
COMMENT ON TABLE cpa_automation.tasks IS 'Task management and workflow tracking';
COMMENT ON TABLE cpa_automation.messages IS 'Communication between CPAs and clients';
COMMENT ON TABLE cpa_automation.time_logs IS 'Time tracking for billing purposes';
COMMENT ON TABLE cpa_automation.invoices IS 'Billing and payment tracking';
COMMENT ON TABLE cpa_automation.ai_faq_responses IS 'Mock AI responses for FAQ chatbot';
