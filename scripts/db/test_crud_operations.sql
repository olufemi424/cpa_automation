-- ==============================================================================
-- HOME EXPENSE APP - USER DATA QUERY TEST
-- ==============================================================================
-- Simple query to fetch all data for a specific user
-- ==============================================================================

-- Set the schema context
SET search_path TO home_expense;

-- ==============================================================================
-- USER DATA RETRIEVAL FOR TESTING
-- ==============================================================================

-- Find a test user (or create one if needed)
-- First, let's see what users exist
SELECT user_id, provider_user_id, email, first_name, last_name, status
FROM users
LIMIT 5;

-- Create a test user if none exists
INSERT INTO users (provider_user_id, email, first_name, last_name, status)
VALUES ('test_user_123', 'testuser@example.com', 'Test', 'User', 'active')
ON CONFLICT (provider_user_id) DO NOTHING;

-- Get the test user's ID
SELECT user_id, provider_user_id, email, first_name, last_name
FROM users
WHERE email = 'testuser@example.com';

-- ==============================================================================
-- FETCH ALL USER DATA
-- ==============================================================================

-- Replace 'testuser@example.com' with actual user email or use the user_id directly
WITH user_data AS (
    SELECT user_id FROM users WHERE email = 'testuser@example.com'
)

-- Get user's expenses for the current month
SELECT
    'EXPENSES' as data_type,
    e.id,
    e.name,
    e.amount,
    e.category_name,
    e.date,
    e.month,
    e.created_at
FROM expenses e
JOIN user_data u ON e.user_id = u.user_id
WHERE e.month = DATE_TRUNC('month', CURRENT_DATE)
ORDER BY e.date DESC

UNION ALL

-- Get user's monthly income
SELECT
    'INCOME' as data_type,
    mi.id,
    mi.amount::text as name,
    mi.amount,
    'Monthly Income' as category_name,
    mi.month as date,
    mi.month,
    mi.created_at
FROM monthly_income mi
JOIN user_data u ON mi.user_id = u.user_id
WHERE mi.month = DATE_TRUNC('month', CURRENT_DATE)

ORDER BY created_at DESC;

-- ==============================================================================
-- SUMMARY QUERIES FOR USER
-- ==============================================================================

-- Get user's spending summary for current month
WITH user_data AS (
    SELECT user_id FROM users WHERE email = 'testuser@example.com'
)
SELECT
    COUNT(e.id) as total_expenses,
    COALESCE(SUM(e.amount), 0) as total_spent,
    COALESCE(mi.amount, 0) as monthly_income,
    COALESCE(mi.amount, 0) - COALESCE(SUM(e.amount), 0) as balance
FROM user_data u
LEFT JOIN expenses e ON e.user_id = u.user_id
    AND e.month = DATE_TRUNC('month', CURRENT_DATE)
LEFT JOIN monthly_income mi ON mi.user_id = u.user_id
    AND mi.month = DATE_TRUNC('month', CURRENT_DATE)
GROUP BY mi.amount;

-- Get user's expense categories breakdown
WITH user_data AS (
    SELECT user_id FROM users WHERE email = 'testuser@example.com'
)
SELECT
    e.category_name,
    COUNT(*) as expense_count,
    SUM(e.amount) as total_amount,
    AVG(e.amount) as average_amount
FROM expenses e
JOIN user_data u ON e.user_id = u.user_id
WHERE e.month = DATE_TRUNC('month', CURRENT_DATE)
GROUP BY e.category_name
ORDER BY total_amount DESC;
-- 2. TEST CATEGORY OPERATIONS
-- ==============================================================================

-- READ: Get all categories (should have default ones from seed data)
SELECT id, name, icon, color, is_default, created_at
FROM categories
ORDER BY name;

-- CREATE: Add a custom category
INSERT INTO categories (name, icon, color, is_default)
VALUES ('Travel', 'airplane', '#8b5cf6', false)
ON CONFLICT (name) DO NOTHING;

-- UPDATE: Update category color
UPDATE categories
SET color = '#7c3aed'
WHERE name = 'Travel';

-- READ: Verify category was updated
SELECT id, name, icon, color, is_default
FROM categories
WHERE name = 'Travel';

-- ==============================================================================
-- 3. TEST EXPENSE OPERATIONS (Core CRUD)
-- ==============================================================================

-- Get test user and category IDs for expense operations
DO $$
DECLARE
    test_user_id UUID;
    home_category_id UUID;
    lifestyle_category_id UUID;
    new_expense_id UUID;
BEGIN
    -- Get test user
    SELECT user_id INTO test_user_id FROM users WHERE email = 'test@example.com';

    -- Get category IDs
    SELECT id INTO home_category_id FROM categories WHERE name = 'Home';
    SELECT id INTO lifestyle_category_id FROM categories WHERE name = 'Lifestyle';

    -- CREATE: Add expenses for the current month
    INSERT INTO expenses (user_id, category_id, category_name, name, amount, date, month)
    VALUES
        (test_user_id, home_category_id, 'Home', 'Rent Payment', 1200.00, CURRENT_DATE, DATE_TRUNC('month', CURRENT_DATE)),
        (test_user_id, lifestyle_category_id, 'Lifestyle', 'Groceries', 85.50, CURRENT_DATE, DATE_TRUNC('month', CURRENT_DATE)),
        (test_user_id, home_category_id, 'Home', 'Utilities', 150.00, CURRENT_DATE - INTERVAL '2 days', DATE_TRUNC('month', CURRENT_DATE)),
        (test_user_id, lifestyle_category_id, 'Lifestyle', 'Coffee', 4.50, CURRENT_DATE - INTERVAL '1 day', DATE_TRUNC('month', CURRENT_DATE));

    -- Get the ID of the last inserted expense
    SELECT id INTO new_expense_id FROM expenses WHERE user_id = test_user_id AND name = 'Coffee';

    RAISE NOTICE 'Created expense ID: %', new_expense_id;
END $$;

-- READ: Get all expenses for current month
SELECT e.id, e.name, e.amount, e.category_name, e.date, e.created_at,
       c.icon, c.color
FROM expenses e
JOIN categories c ON e.category_id = c.id
WHERE e.user_id = (SELECT user_id FROM users WHERE email = 'test@example.com')
  AND e.month = DATE_TRUNC('month', CURRENT_DATE)
ORDER BY e.date DESC;

-- READ: Get expenses by category
SELECT category_name, COUNT(*) as expense_count, SUM(amount) as total_amount
FROM expenses
WHERE user_id = (SELECT user_id FROM users WHERE email = 'test@example.com')
  AND month = DATE_TRUNC('month', CURRENT_DATE)
GROUP BY category_name
ORDER BY total_amount DESC;

-- UPDATE: Update an expense
UPDATE expenses
SET name = 'Premium Coffee', amount = 6.00, updated_at = NOW()
WHERE user_id = (SELECT user_id FROM users WHERE email = 'test@example.com')
  AND name = 'Coffee';

-- READ: Verify expense was updated
SELECT id, name, amount, category_name, date, updated_at
FROM expenses
WHERE user_id = (SELECT user_id FROM users WHERE email = 'test@example.com')
  AND name = 'Premium Coffee';

-- DELETE: Delete an expense
DELETE FROM expenses
WHERE user_id = (SELECT user_id FROM users WHERE email = 'test@example.com')
  AND name = 'Premium Coffee';

-- READ: Verify expense was deleted
SELECT COUNT(*) as remaining_expenses
FROM expenses
WHERE user_id = (SELECT user_id FROM users WHERE email = 'test@example.com')
  AND month = DATE_TRUNC('month', CURRENT_DATE);

-- ==============================================================================
-- 4. TEST MONTHLY INCOME OPERATIONS
-- ==============================================================================

-- CREATE: Set monthly income
INSERT INTO monthly_income (user_id, amount, month)
VALUES (
    (SELECT user_id FROM users WHERE email = 'test@example.com'),
    4500.00,
    DATE_TRUNC('month', CURRENT_DATE)
)
ON CONFLICT (user_id, month) DO UPDATE SET
    amount = EXCLUDED.amount,
    updated_at = NOW();

-- READ: Get monthly income
SELECT id, amount, month, created_at, updated_at
FROM monthly_income
WHERE user_id = (SELECT user_id FROM users WHERE email = 'test@example.com')
  AND month = DATE_TRUNC('month', CURRENT_DATE);

-- UPDATE: Update monthly income (via upsert)
INSERT INTO monthly_income (user_id, amount, month)
VALUES (
    (SELECT user_id FROM users WHERE email = 'test@example.com'),
    5000.00,
    DATE_TRUNC('month', CURRENT_DATE)
)
ON CONFLICT (user_id, month) DO UPDATE SET
    amount = EXCLUDED.amount,
    updated_at = NOW();

-- READ: Verify income was updated
SELECT id, amount, month, updated_at
FROM monthly_income
WHERE user_id = (SELECT user_id FROM users WHERE email = 'test@example.com')
  AND month = DATE_TRUNC('month', CURRENT_DATE);

-- DELETE: Delete monthly income
DELETE FROM monthly_income
WHERE user_id = (SELECT user_id FROM users WHERE email = 'test@example.com')
  AND month = DATE_TRUNC('month', CURRENT_DATE);

-- ==============================================================================
-- 5. TEST COMPREHENSIVE QUERIES (Dashboard-style)
-- ==============================================================================

-- Re-insert income for dashboard testing
INSERT INTO monthly_income (user_id, amount, month)
VALUES (
    (SELECT user_id FROM users WHERE email = 'test@example.com'),
    4500.00,
    DATE_TRUNC('month', CURRENT_DATE)
)
ON CONFLICT (user_id, month) DO UPDATE SET
    amount = EXCLUDED.amount,
    updated_at = NOW();

-- READ: Monthly summary (income vs expenses)
SELECT
    mi.amount as monthly_income,
    COALESCE(SUM(e.amount), 0) as total_expenses,
    (mi.amount - COALESCE(SUM(e.amount), 0)) as remaining_balance,
    COUNT(e.id) as expense_count
FROM monthly_income mi
LEFT JOIN expenses e ON mi.user_id = e.user_id AND mi.month = e.month
WHERE mi.user_id = (SELECT user_id FROM users WHERE email = 'test@example.com')
  AND mi.month = DATE_TRUNC('month', CURRENT_DATE)
GROUP BY mi.id, mi.amount;

-- READ: Category breakdown for current month
SELECT
    e.category_name,
    COUNT(e.id) as expense_count,
    SUM(e.amount) as category_total,
    ROUND(AVG(e.amount), 2) as avg_expense,
    c.icon,
    c.color
FROM expenses e
JOIN categories c ON e.category_id = c.id
WHERE e.user_id = (SELECT user_id FROM users WHERE email = 'test@example.com')
  AND e.month = DATE_TRUNC('month', CURRENT_DATE)
GROUP BY e.category_name, c.icon, c.color
ORDER BY category_total DESC;

-- READ: Recent expenses (last 10)
SELECT
    e.id,
    e.name,
    e.amount,
    e.category_name,
    e.date,
    e.created_at,
    c.icon,
    c.color
FROM expenses e
JOIN categories c ON e.category_id = c.id
WHERE e.user_id = (SELECT user_id FROM users WHERE email = 'test@example.com')
ORDER BY e.date DESC, e.created_at DESC
LIMIT 10;

-- ==============================================================================
-- 6. TEST EVENT LOGGING
-- ==============================================================================

-- READ: Get event types
SELECT event_type_id, event_name, description
FROM event_types
ORDER BY event_name;

-- CREATE: Log an event
INSERT INTO events (user_id, event_type_id, event_details)
VALUES (
    (SELECT user_id FROM users WHERE email = 'test@example.com'),
    (SELECT event_type_id FROM event_types WHERE event_name = 'USER_LOGIN'),
    '{"ip": "127.0.0.1", "user_agent": "Test Browser"}'::jsonb
);

-- READ: Get recent events for user
SELECT
    e.event_id,
    et.event_name,
    e.event_timestamp,
    e.event_details
FROM events e
JOIN event_types et ON e.event_type_id = et.event_type_id
WHERE e.user_id = (SELECT user_id FROM users WHERE email = 'test@example.com')
ORDER BY e.event_timestamp DESC
LIMIT 5;

-- ==============================================================================
-- 7. CLEANUP (Optional - Run to clean up test data)
-- ==============================================================================

-- Uncomment the following lines to clean up test data after testing

-- DELETE FROM events WHERE user_id = (SELECT user_id FROM users WHERE email = 'test@example.com');
-- DELETE FROM expenses WHERE user_id = (SELECT user_id FROM users WHERE email = 'test@example.com');
-- DELETE FROM monthly_income WHERE user_id = (SELECT user_id FROM users WHERE email = 'test@example.com');
-- DELETE FROM user_roles WHERE user_id = (SELECT user_id FROM users WHERE email = 'test@example.com');
-- DELETE FROM users WHERE email = 'test@example.com';
-- DELETE FROM categories WHERE name = 'Travel';

-- ==============================================================================
-- 8. PERFORMANCE CHECK
-- ==============================================================================

-- Check if indexes are being used efficiently
EXPLAIN (ANALYZE, BUFFERS)
SELECT e.id, e.name, e.amount, e.category_name, e.date
FROM expenses e
WHERE e.user_id = (SELECT user_id FROM users WHERE email = 'test@example.com')
  AND e.month = DATE_TRUNC('month', CURRENT_DATE)
ORDER BY e.date DESC;

-- Check monthly income query performance
EXPLAIN (ANALYZE, BUFFERS)
SELECT mi.amount, mi.month
FROM monthly_income mi
WHERE mi.user_id = (SELECT user_id FROM users WHERE email = 'test@example.com')
  AND mi.month = DATE_TRUNC('month', CURRENT_DATE);

-- ==============================================================================
-- SUMMARY
-- ==============================================================================
-- This script tests all CRUD operations for:
-- ✓ Users (CREATE, READ, UPDATE)
-- ✓ Categories (CREATE, READ, UPDATE)
-- ✓ Expenses (CREATE, READ, UPDATE, DELETE)
-- ✓ Monthly Income (CREATE, READ, UPDATE, DELETE)
-- ✓ Events (CREATE, READ)
-- ✓ Complex queries for dashboard functionality
-- ✓ Performance checks with EXPLAIN
-- ==============================================================================

-- ==============================================================================
-- SIMPLE CRUD OPERATIONS TEST
-- ==============================================================================

-- Get user ID for testing (replace with actual user ID)
-- You can copy a user_id from the first query results
\set test_user_id '00000000-0000-0000-0000-000000000000'

-- CREATE: Add a test expense
INSERT INTO expenses (user_id, category_id, category_name, name, amount, date, month)
SELECT
    u.user_id,
    c.id,
    c.name,
    'Test Grocery Shopping',
    45.67,
    CURRENT_DATE,
    DATE_TRUNC('month', CURRENT_DATE)
FROM users u
CROSS JOIN categories c
WHERE u.email = 'testuser@example.com'
AND c.name = 'Food'
LIMIT 1;

-- READ: Get the created expense
SELECT id, name, amount, category_name, date
FROM expenses
WHERE user_id = (SELECT user_id FROM users WHERE email = 'testuser@example.com')
AND name = 'Test Grocery Shopping';

-- UPDATE: Update the expense amount
UPDATE expenses
SET amount = 52.34, name = 'Updated Grocery Shopping'
WHERE user_id = (SELECT user_id FROM users WHERE email = 'testuser@example.com')
AND name = 'Test Grocery Shopping';

-- READ: Verify the update
SELECT id, name, amount, category_name, date
FROM expenses
WHERE user_id = (SELECT user_id FROM users WHERE email = 'testuser@example.com')
AND name = 'Updated Grocery Shopping';

-- DELETE: Remove the test expense
DELETE FROM expenses
WHERE user_id = (SELECT user_id FROM users WHERE email = 'testuser@example.com')
AND name = 'Updated Grocery Shopping';

-- VERIFY: Confirm deletion
SELECT COUNT(*) as remaining_test_expenses
FROM expenses
WHERE user_id = (SELECT user_id FROM users WHERE email = 'testuser@example.com')
AND name IN ('Test Grocery Shopping', 'Updated Grocery Shopping');

-- ==============================================================================
-- INCOME CRUD TEST
-- ==============================================================================

-- CREATE/UPDATE: Set monthly income (upsert)
INSERT INTO monthly_income (user_id, amount, month)
SELECT
    user_id,
    5000.00,
    DATE_TRUNC('month', CURRENT_DATE)
FROM users
WHERE email = 'testuser@example.com'
ON CONFLICT (user_id, month)
DO UPDATE SET
    amount = EXCLUDED.amount,
    updated_at = NOW();

-- READ: Get monthly income
SELECT id, amount, month, created_at
FROM monthly_income
WHERE user_id = (SELECT user_id FROM users WHERE email = 'testuser@example.com')
AND month = DATE_TRUNC('month', CURRENT_DATE);

-- UPDATE: Update income amount
UPDATE monthly_income
SET amount = 5500.00
WHERE user_id = (SELECT user_id FROM users WHERE email = 'testuser@example.com')
AND month = DATE_TRUNC('month', CURRENT_DATE);

-- READ: Verify income update
SELECT id, amount, month, updated_at
FROM monthly_income
WHERE user_id = (SELECT user_id FROM users WHERE email = 'testuser@example.com')
AND month = DATE_TRUNC('month', CURRENT_DATE);
