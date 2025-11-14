-- Clean up dependencies before dropping role
DO $$
BEGIN
    -- Revoke schema privileges if role exists
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'cpa_automation_app_user') THEN
        REVOKE USAGE ON SCHEMA cpa_automation FROM cpa_automation_app_user;

        -- Revoke default privileges for tables
        ALTER DEFAULT PRIVILEGES FOR ROLE "boilerplatedb_admin" IN SCHEMA cpa_automation
            REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLES FROM cpa_automation_app_user;

        -- Revoke default privileges for sequences
        ALTER DEFAULT PRIVILEGES FOR ROLE "boilerplatedb_admin" IN SCHEMA cpa_automation
            REVOKE USAGE, SELECT ON SEQUENCES FROM cpa_automation_app_user;
    END IF;
END $$;

-- Drop application user if exists
DROP ROLE IF EXISTS cpa_automation_app_user;

-- Create the application user role with restricted privileges
CREATE ROLE cpa_automation_app_user WITH
    LOGIN
    NOSUPERUSER
    NOCREATEDB
    NOCREATEROLE
    INHERIT
    NOREPLICATION
    CONNECTION LIMIT -1
    PASSWORD 'app_user_password123';

-- Create the cpa_automation schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS cpa_automation;

-- Grant usage on schema to app user
GRANT USAGE ON SCHEMA cpa_automation TO cpa_automation_app_user;

-- Default privileges for the app user
ALTER DEFAULT PRIVILEGES IN SCHEMA cpa_automation
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO cpa_automation_app_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA cpa_automation
    GRANT USAGE, SELECT ON SEQUENCES TO cpa_automation_app_user;

-- Comment explaining the roles
COMMENT ON ROLE cpa_automation_app_user IS 'Application role for cpa_automation_db with restricted privileges for day-to-day operations';
