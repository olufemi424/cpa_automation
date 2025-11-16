-- =====================================================================
-- DATABASE DEBUG QUERIES for home_expense schema
-- =====================================================================

-- =====================================================================
-- 1. BASIC DATA INSPECTION
-- =====================================================================

-- Check all users
SELECT user_id, provider_user_id, email, first_name, last_name, status, created_at, updated_at FROM home_expense.users ORDER BY created_at DESC;

-- Check all roles
SELECT role_id, role_name, description FROM home_expense.roles ORDER BY role_id;

-- Check all event types
SELECT event_type_id, event_name, description FROM home_expense.event_types ORDER BY event_type_id;

-- =====================================================================
-- 2. RELATIONSHIP VERIFICATION
-- =====================================================================

-- Users with their roles
SELECT u.user_id, u.email, u.first_name, u.last_name, u.status, r.role_name, ur.granted_at FROM home_expense.users u LEFT JOIN home_expense.user_roles ur ON u.user_id = ur.user_id LEFT JOIN home_expense.roles r ON ur.role_id = r.role_id ORDER BY u.email, r.role_name;

-- Role assignments count
SELECT r.role_name, COUNT(ur.user_id) as user_count FROM home_expense.roles r LEFT JOIN home_expense.user_roles ur ON r.role_id = ur.role_id GROUP BY r.role_id, r.role_name ORDER BY user_count DESC;

-- Users without roles (potential issue)
SELECT u.user_id, u.email, u.first_name, u.last_name, u.status FROM home_expense.users u LEFT JOIN home_expense.user_roles ur ON u.user_id = ur.user_id WHERE ur.user_id IS NULL;

-- =====================================================================
-- 3. EVENT LOGGING ANALYSIS
-- =====================================================================

-- Recent events (last 50)
SELECT e.event_id, u.email, et.event_name, e.event_timestamp, e.event_details FROM home_expense.events e JOIN home_expense.users u ON e.user_id = u.user_id JOIN home_expense.event_types et ON e.event_type_id = et.event_type_id ORDER BY e.event_timestamp DESC LIMIT 50;

-- Event summary by type
SELECT et.event_name, COUNT(e.event_id) as event_count, MIN(e.event_timestamp) as first_event, MAX(e.event_timestamp) as last_event FROM home_expense.event_types et LEFT JOIN home_expense.events e ON et.event_type_id = e.event_type_id GROUP BY et.event_type_id, et.event_name ORDER BY event_count DESC;

-- Events per user
SELECT u.email, u.first_name, u.last_name, COUNT(e.event_id) as total_events, MAX(e.event_timestamp) as last_activity FROM home_expense.users u LEFT JOIN home_expense.events e ON u.user_id = e.user_id GROUP BY u.user_id, u.email, u.first_name, u.last_name ORDER BY total_events DESC;

-- Users with no events (potential issue)
SELECT u.user_id, u.email, u.first_name, u.last_name, u.created_at FROM home_expense.users u LEFT JOIN home_expense.events e ON u.user_id = e.user_id WHERE e.user_id IS NULL;

-- =====================================================================
-- 4. DATA INTEGRITY CHECKS
-- =====================================================================

-- Check for duplicate emails (should be empty due to unique constraint)
SELECT email, COUNT(*) as count FROM home_expense.users GROUP BY email HAVING COUNT(*) > 1;

-- Check for duplicate provider user IDs (should be empty)
SELECT provider_user_id, COUNT(*) as count FROM home_expense.users GROUP BY provider_user_id HAVING COUNT(*) > 1;

-- Check for orphaned user_roles (should be empty due to foreign keys)
SELECT ur.user_id, ur.role_id, 'Missing user' as issue FROM home_expense.user_roles ur LEFT JOIN home_expense.users u ON ur.user_id = u.user_id WHERE u.user_id IS NULL UNION ALL SELECT ur.user_id, ur.role_id, 'Missing role' as issue FROM home_expense.user_roles ur LEFT JOIN home_expense.roles r ON ur.role_id = r.role_id WHERE r.role_id IS NULL;

-- Check for orphaned events (should be empty due to foreign keys)
SELECT e.event_id, e.user_id, e.event_type_id, 'Missing user' as issue FROM home_expense.events e LEFT JOIN home_expense.users u ON e.user_id = u.user_id WHERE u.user_id IS NULL UNION ALL SELECT e.event_id, e.user_id, e.event_type_id, 'Missing event type' as issue FROM home_expense.events e LEFT JOIN home_expense.event_types et ON e.event_type_id = et.event_type_id WHERE et.event_type_id IS NULL;

-- =====================================================================
-- 5. STATUS AND HEALTH CHECKS
-- =====================================================================

-- User status distribution
SELECT status, COUNT(*) as count, ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM home_expense.users), 2) as percentage FROM home_expense.users GROUP BY status ORDER BY count DESC;

-- Email normalization check (all emails should be lowercase)
SELECT user_id, email, CASE WHEN email = LOWER(email) THEN 'OK' ELSE 'NEEDS_NORMALIZATION' END as email_case_status FROM home_expense.users WHERE email != LOWER(email);

-- Recent user activity (last 24 hours)
SELECT u.email, u.first_name, u.last_name, COUNT(e.event_id) as events_last_24h FROM home_expense.users u LEFT JOIN home_expense.events e ON u.user_id = e.user_id AND e.event_timestamp >= NOW() - INTERVAL '24 hours' GROUP BY u.user_id, u.email, u.first_name, u.last_name HAVING COUNT(e.event_id) > 0 ORDER BY events_last_24h DESC;

-- =====================================================================
-- 6. PERFORMANCE ANALYSIS
-- =====================================================================

-- Table sizes and row counts
SELECT 'users' as table_name, COUNT(*) as row_count FROM home_expense.users UNION ALL SELECT 'roles' as table_name, COUNT(*) as row_count FROM home_expense.roles UNION ALL SELECT 'user_roles' as table_name, COUNT(*) as row_count FROM home_expense.user_roles UNION ALL SELECT 'event_types' as table_name, COUNT(*) as row_count FROM home_expense.event_types UNION ALL SELECT 'events' as table_name, COUNT(*) as row_count FROM home_expense.events;

-- Check for old events (for cleanup considerations)
SELECT COUNT(*) as events_older_than_90_days, MIN(event_timestamp) as oldest_event, MAX(event_timestamp) as newest_event FROM home_expense.events WHERE event_timestamp < NOW() - INTERVAL '90 days';

-- =====================================================================
-- 7. SPECIFIC TROUBLESHOOTING QUERIES
-- =====================================================================

-- Find user by email (case-insensitive)
-- Usage: Replace 'user@example.com' with actual email
SELECT u.*, string_agg(r.role_name, ', ') as roles FROM home_expense.users u LEFT JOIN home_expense.user_roles ur ON u.user_id = ur.user_id LEFT JOIN home_expense.roles r ON ur.role_id = r.role_id WHERE LOWER(u.email) = LOWER('user@example.com') GROUP BY u.user_id, u.provider_user_id, u.email, u.first_name, u.last_name, u.status, u.created_at, u.updated_at;

-- Find user by provider ID
-- Usage: Replace 'provider123' with actual provider ID
SELECT u.*, string_agg(r.role_name, ', ') as roles FROM home_expense.users u LEFT JOIN home_expense.user_roles ur ON u.user_id = ur.user_id LEFT JOIN home_expense.roles r ON ur.role_id = r.role_id WHERE u.provider_user_id = 'provider123' GROUP BY u.user_id, u.provider_user_id, u.email, u.first_name, u.last_name, u.status, u.created_at, u.updated_at;

-- Check trigger functionality (updated_at should be recent for updated records)
SELECT user_id, email, created_at, updated_at, CASE WHEN updated_at > created_at THEN 'UPDATED' ELSE 'NEVER_UPDATED' END as update_status FROM home_expense.users ORDER BY updated_at DESC;

-- Event details analysis (check JSONB content)
SELECT e.event_id, u.email, et.event_name, e.event_timestamp, e.event_details, jsonb_typeof(e.event_details) as details_type, jsonb_array_length(e.event_details) as array_length FROM home_expense.events e JOIN home_expense.users u ON e.user_id = u.user_id JOIN home_expense.event_types et ON e.event_type_id = et.event_type_id WHERE e.event_details IS NOT NULL ORDER BY e.event_timestamp DESC LIMIT 20;

-- =====================================================================
-- 8. ADMIN QUERIES
-- =====================================================================

-- Get all admin users
SELECT u.user_id, u.email, u.first_name, u.last_name, u.status, ur.granted_at FROM home_expense.users u JOIN home_expense.user_roles ur ON u.user_id = ur.user_id JOIN home_expense.roles r ON ur.role_id = r.role_id WHERE r.role_name = 'admin' ORDER BY ur.granted_at;

-- Users created in last 7 days
SELECT user_id, email, first_name, last_name, status, created_at FROM home_expense.users WHERE created_at >= NOW() - INTERVAL '7 days' ORDER BY created_at DESC;

-- Most active users (by event count)
SELECT u.email, u.first_name, u.last_name, COUNT(e.event_id) as total_events, MAX(e.event_timestamp) as last_activity FROM home_expense.users u JOIN home_expense.events e ON u.user_id = e.user_id GROUP BY u.user_id, u.email, u.first_name, u.last_name ORDER BY total_events DESC LIMIT 10;
