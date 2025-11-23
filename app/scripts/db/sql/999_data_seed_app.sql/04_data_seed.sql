/******************************
	FEATURE: cpa-automation-seed-data
	RELEASE: 0.0.1 (POC)
	DESCRIPTION: Seed data for testing and demo purposes
	Database: cpa_automation_db
	Schema: cpa_automation
******************************/

-- Switch to the correct database
\c cpa_automation_db;

-- Ensure we're using the correct schema
SET search_path TO cpa_automation;

/* ----------------------------------------------------------------------
   USERS: Create demo users (CPAs, Admins, and Clients)
   ------------------------------------------------------------------- */
-- Password for all users: 'password123' (hashed with bcrypt)
-- NOTE: In production, use proper password hashing with better-auth

-- Password for all users: 'password123' (correctly hashed with bcrypt)
INSERT INTO cpa_automation.users (id, email, password_hash, name, role, status, phone) VALUES
-- Admin
('00000000-0000-0000-0000-000000000001', 'admin@cpacommand.com', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.', 'John Administrator', 'ADMIN', 'active', '555-0001'),

-- CPAs
('00000000-0000-0000-0000-000000000002', 'sarah.cpa@cpacommand.com', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.', 'Sarah Johnson', 'CPA', 'active', '555-0002'),
('00000000-0000-0000-0000-000000000003', 'mike.cpa@cpacommand.com', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.', 'Mike Chen', 'CPA', 'active', '555-0003'),
('00000000-0000-0000-0000-000000000004', 'lisa.cpa@cpacommand.com', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.', 'Lisa Rodriguez', 'CPA', 'active', '555-0004'),

-- Clients
('00000000-0000-0000-0000-000000000010', 'john.doe@example.com', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.', 'John Doe', 'CLIENT', 'active', '555-1001'),
('00000000-0000-0000-0000-000000000011', 'jane.smith@example.com', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.', 'Jane Smith', 'CLIENT', 'active', '555-1002'),
('00000000-0000-0000-0000-000000000012', 'bob.wilson@example.com', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.', 'Bob Wilson', 'CLIENT', 'active', '555-1003'),
('00000000-0000-0000-0000-000000000013', 'alice.brown@example.com', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.', 'Alice Brown', 'CLIENT', 'active', '555-1004'),
('00000000-0000-0000-0000-000000000014', 'charlie.davis@example.com', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.', 'Charlie Davis', 'CLIENT', 'active', '555-1005'),
('00000000-0000-0000-0000-000000000015', 'emma.garcia@example.com', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.', 'Emma Garcia', 'CLIENT', 'active', '555-1006'),
('00000000-0000-0000-0000-000000000016', 'david.martinez@example.com', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.', 'David Martinez', 'CLIENT', 'active', '555-1007'),
('00000000-0000-0000-0000-000000000017', 'sophia.lee@example.com', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.', 'Sophia Lee', 'CLIENT', 'active', '555-1008'),
('00000000-0000-0000-0000-000000000018', 'oliver.johnson@techstartup.com', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.', 'Oliver Johnson', 'CLIENT', 'active', '555-1009'),
('00000000-0000-0000-0000-000000000019', 'mia.anderson@smallbiz.com', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.', 'Mia Anderson', 'CLIENT', 'active', '555-1010'),
('00000000-0000-0000-0000-000000000020', 'noah.thomas@realestate.com', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.', 'Noah Thomas', 'CLIENT', 'active', '555-1011'),
('00000000-0000-0000-0000-000000000021', 'patricia.white@example.com', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.', 'Patricia White', 'CLIENT', 'active', '555-1012'),
('00000000-0000-0000-0000-000000000022', 'robert.green@example.com', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.', 'Robert Green', 'CLIENT', 'active', '555-1013'),
('00000000-0000-0000-0000-000000000023', 'linda.taylor@example.com', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.', 'Linda Taylor', 'CLIENT', 'active', '555-1014'),
('00000000-0000-0000-0000-000000000024', 'james.moore@example.com', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.', 'James Moore', 'CLIENT', 'active', '555-1015');

/* ----------------------------------------------------------------------
   ACCOUNTS: Credential accounts for Better Auth email/password
   Better Auth uses userId as accountId for credential provider
   Password is stored in the accounts table for credential provider
   ------------------------------------------------------------------- */
INSERT INTO cpa_automation.accounts (id, "userId", "accountId", "providerId", password) VALUES
-- Admin
('acc-admin', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'credential', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.'),
-- CPAs
('acc-sarah', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'credential', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.'),
('acc-mike', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'credential', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.'),
('acc-lisa', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', 'credential', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.'),
-- Clients
('acc-john', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000010', 'credential', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.'),
('acc-jane', '00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000011', 'credential', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.'),
('acc-bob', '00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000012', 'credential', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.'),
('acc-alice', '00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000013', 'credential', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.'),
('acc-charlie', '00000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000014', 'credential', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.'),
('acc-emma', '00000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000015', 'credential', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.'),
('acc-david', '00000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000016', 'credential', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.'),
('acc-sophia', '00000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000017', 'credential', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.'),
('acc-oliver', '00000000-0000-0000-0000-000000000018', '00000000-0000-0000-0000-000000000018', 'credential', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.'),
('acc-mia', '00000000-0000-0000-0000-000000000019', '00000000-0000-0000-0000-000000000019', 'credential', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.'),
('acc-noah', '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000020', 'credential', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.'),
('acc-patricia', '00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000021', 'credential', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.'),
('acc-robert', '00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000022', 'credential', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.'),
('acc-linda', '00000000-0000-0000-0000-000000000023', '00000000-0000-0000-0000-000000000023', 'credential', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.'),
('acc-james', '00000000-0000-0000-0000-000000000024', '00000000-0000-0000-0000-000000000024', 'credential', '$2b$10$aq3zWwIet9/CyGjF6zKmV.2UJgq/vMANrUJlh6WLSOC3AJEbfFlg.');

/* ----------------------------------------------------------------------
   CLIENTS: Create demo clients in various workflow stages
   ------------------------------------------------------------------- */
INSERT INTO cpa_automation.clients (id, user_id, name, email, phone, entity_type, tax_year, status, assigned_to_id, business_name, address_line1, city, state, zip_code, progress_percentage, notes) VALUES
-- INTAKE (3 clients)
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'John Doe', 'john.doe@example.com', '555-1001', 'INDIVIDUAL', 2024, 'INTAKE', '00000000-0000-0000-0000-000000000002', NULL, '123 Main St', 'New York', 'NY', '10001', 15, 'New client, waiting for W-2'),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000011', 'Jane Smith', 'jane.smith@example.com', '555-1002', 'INDIVIDUAL', 2024, 'INTAKE', '00000000-0000-0000-0000-000000000002', NULL, '456 Oak Ave', 'Los Angeles', 'CA', '90001', 10, 'Uploaded partial documents'),
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000012', 'Bob Wilson', 'bob.wilson@example.com', '555-1003', 'LLC', 2024, 'INTAKE', '00000000-0000-0000-0000-000000000003', 'Wilson Consulting LLC', '789 Elm St', 'Chicago', 'IL', '60601', 20, 'Need Schedule C information'),

-- PREPARATION (3 clients)
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000013', 'Alice Brown', 'alice.brown@example.com', '555-1004', 'INDIVIDUAL', 2024, 'PREPARATION', '00000000-0000-0000-0000-000000000002', NULL, '321 Pine Rd', 'Houston', 'TX', '77001', 45, 'All documents received, preparing return'),
('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000014', 'Charlie Davis', 'charlie.davis@example.com', '555-1005', 'S_CORP', 2024, 'PREPARATION', '00000000-0000-0000-0000-000000000003', 'Davis Tech Solutions', '654 Maple Dr', 'Phoenix', 'AZ', '85001', 50, 'S-Corp return in progress'),
('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000015', 'Emma Garcia', 'emma.garcia@example.com', '555-1006', 'INDIVIDUAL', 2024, 'PREPARATION', '00000000-0000-0000-0000-000000000004', NULL, '987 Cedar Ln', 'Philadelphia', 'PA', '19101', 40, 'Multiple 1099s to reconcile'),

-- REVIEW (3 clients)
('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000016', 'David Martinez', 'david.martinez@example.com', '555-1007', 'INDIVIDUAL', 2024, 'REVIEW', '00000000-0000-0000-0000-000000000002', NULL, '147 Birch St', 'San Antonio', 'TX', '78201', 70, 'Return completed, under review'),
('10000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000017', 'Sophia Lee', 'sophia.lee@example.com', '555-1008', 'LLC', 2024, 'REVIEW', '00000000-0000-0000-0000-000000000003', 'Lee Design Studio', '258 Spruce Ave', 'San Diego', 'CA', '92101', 75, 'Partnership return ready for final review'),
('10000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000018', 'Oliver Johnson', 'oliver.johnson@techstartup.com', '555-1009', 'C_CORP', 2024, 'REVIEW', '00000000-0000-0000-0000-000000000004', 'TechStartup Inc', '369 Willow Blvd', 'Dallas', 'TX', '75201', 80, 'C-Corp return under senior review'),

-- FILED (3 clients)
('10000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000019', 'Mia Anderson', 'mia.anderson@smallbiz.com', '555-1010', 'LLC', 2024, 'FILED', '00000000-0000-0000-0000-000000000002', 'Anderson Small Business', '741 Ash St', 'San Jose', 'CA', '95101', 95, 'Return filed on 03/10/2025'),
('10000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000020', 'Noah Thomas', 'noah.thomas@realestate.com', '555-1011', 'INDIVIDUAL', 2024, 'FILED', '00000000-0000-0000-0000-000000000003', NULL, '852 Poplar Ct', 'Austin', 'TX', '78701', 100, 'Successfully filed, awaiting payment'),
('10000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000021', 'Patricia White', 'patricia.white@example.com', '555-1012', 'INDIVIDUAL', 2024, 'FILED', '00000000-0000-0000-0000-000000000004', NULL, '963 Juniper Way', 'Jacksonville', 'FL', '32201', 100, 'Filed 2 weeks ago'),

-- INVOICED (3 clients)
('10000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000022', 'Robert Green', 'robert.green@example.com', '555-1013', 'S_CORP', 2023, 'INVOICED', '00000000-0000-0000-0000-000000000002', 'Green Enterprises', '159 Magnolia Dr', 'Columbus', 'OH', '43201', 100, 'Invoice sent 01/15/2025'),
('10000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000023', 'Linda Taylor', 'linda.taylor@example.com', '555-1014', 'INDIVIDUAL', 2023, 'INVOICED', '00000000-0000-0000-0000-000000000003', NULL, '357 Hickory Ln', 'Fort Worth', 'TX', '76101', 100, 'Payment pending'),
('10000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000024', 'James Moore', 'james.moore@example.com', '555-1015', 'LLC', 2023, 'COMPLETED', '00000000-0000-0000-0000-000000000004', 'Moore Consulting', '486 Cypress Ave', 'Charlotte', 'NC', '28201', 100, 'Completed and paid');

/* ----------------------------------------------------------------------
   DOCUMENTS: Sample documents for clients
   ------------------------------------------------------------------- */
INSERT INTO cpa_automation.documents (client_id, file_name, file_url, file_size, file_type, document_type, is_verified, uploaded_by_id) VALUES
-- John Doe (INTAKE)
('10000000-0000-0000-0000-000000000001', 'john_doe_drivers_license.pdf', '/uploads/documents/john_doe_drivers_license.pdf', 245678, 'application/pdf', 'ID', TRUE, '00000000-0000-0000-0000-000000000010'),
('10000000-0000-0000-0000-000000000001', '2024_w2_acme_corp.pdf', '/uploads/documents/2024_w2_acme_corp.pdf', 189234, 'application/pdf', 'W2', FALSE, '00000000-0000-0000-0000-000000000010'),

-- Jane Smith (INTAKE)
('10000000-0000-0000-0000-000000000002', 'jane_smith_id.jpg', '/uploads/documents/jane_smith_id.jpg', 567890, 'image/jpeg', 'ID', TRUE, '00000000-0000-0000-0000-000000000011'),

-- Bob Wilson (INTAKE - LLC)
('10000000-0000-0000-0000-000000000003', 'wilson_llc_1099_misc.pdf', '/uploads/documents/wilson_llc_1099_misc.pdf', 234567, 'application/pdf', '1099_MISC', TRUE, '00000000-0000-0000-0000-000000000012'),
('10000000-0000-0000-0000-000000000003', 'wilson_business_receipts_q1.pdf', '/uploads/documents/wilson_business_receipts_q1.pdf', 456789, 'application/pdf', 'RECEIPT', FALSE, '00000000-0000-0000-0000-000000000012'),

-- Alice Brown (PREPARATION)
('10000000-0000-0000-0000-000000000004', 'alice_brown_w2_2024.pdf', '/uploads/documents/alice_brown_w2_2024.pdf', 198765, 'application/pdf', 'W2', TRUE, '00000000-0000-0000-0000-000000000013'),
('10000000-0000-0000-0000-000000000004', 'alice_1099_int_bank.pdf', '/uploads/documents/alice_1099_int_bank.pdf', 123456, 'application/pdf', '1099_INT', TRUE, '00000000-0000-0000-0000-000000000013'),
('10000000-0000-0000-0000-000000000004', 'alice_1099_div_brokerage.pdf', '/uploads/documents/alice_1099_div_brokerage.pdf', 145678, 'application/pdf', '1099_DIV', TRUE, '00000000-0000-0000-0000-000000000013'),

-- Charlie Davis (PREPARATION - S-Corp)
('10000000-0000-0000-0000-000000000005', 'davis_tech_k1_2024.pdf', '/uploads/documents/davis_tech_k1_2024.pdf', 345678, 'application/pdf', 'STATEMENT', TRUE, '00000000-0000-0000-0000-000000000014'),
('10000000-0000-0000-0000-000000000005', 'davis_business_expenses.pdf', '/uploads/documents/davis_business_expenses.pdf', 567890, 'application/pdf', 'RECEIPT', TRUE, '00000000-0000-0000-0000-000000000014'),

-- Emma Garcia (PREPARATION)
('10000000-0000-0000-0000-000000000006', 'emma_w2_primary.pdf', '/uploads/documents/emma_w2_primary.pdf', 187654, 'application/pdf', 'W2', TRUE, '00000000-0000-0000-0000-000000000015'),
('10000000-0000-0000-0000-000000000006', 'emma_1099_nec_freelance.pdf', '/uploads/documents/emma_1099_nec_freelance.pdf', 234567, 'application/pdf', '1099_NEC', TRUE, '00000000-0000-0000-0000-000000000015'),
('10000000-0000-0000-0000-000000000006', 'emma_1099_nec_consulting.pdf', '/uploads/documents/emma_1099_nec_consulting.pdf', 245678, 'application/pdf', '1099_NEC', TRUE, '00000000-0000-0000-0000-000000000015'),

-- David Martinez (REVIEW)
('10000000-0000-0000-0000-000000000007', 'david_w2_2024.pdf', '/uploads/documents/david_w2_2024.pdf', 198765, 'application/pdf', 'W2', TRUE, '00000000-0000-0000-0000-000000000016'),
('10000000-0000-0000-0000-000000000007', 'david_mortgage_interest.pdf', '/uploads/documents/david_mortgage_interest.pdf', 123456, 'application/pdf', 'STATEMENT', TRUE, '00000000-0000-0000-0000-000000000016');

/* ----------------------------------------------------------------------
   TASKS: Sample tasks for workflow management
   ------------------------------------------------------------------- */
INSERT INTO cpa_automation.tasks (client_id, title, description, status, assigned_to_id, due_date, priority, is_completed, created_by_id) VALUES
-- INTAKE tasks
('10000000-0000-0000-0000-000000000001', 'Collect W-2 from employer', 'Client needs to upload W-2 from Acme Corp', 'INTAKE', '00000000-0000-0000-0000-000000000002', '2025-03-20', 'HIGH', FALSE, '00000000-0000-0000-0000-000000000002'),
('10000000-0000-0000-0000-000000000001', 'Verify client identity', 'Review uploaded ID document', 'INTAKE', '00000000-0000-0000-0000-000000000002', '2025-03-15', 'MEDIUM', FALSE, '00000000-0000-0000-0000-000000000002'),
('10000000-0000-0000-0000-000000000002', 'Request missing 1099 forms', 'Client may have additional 1099 income', 'INTAKE', '00000000-0000-0000-0000-000000000002', '2025-03-22', 'MEDIUM', FALSE, '00000000-0000-0000-0000-000000000002'),
('10000000-0000-0000-0000-000000000003', 'Review LLC business expenses', 'Categorize and verify business expenses', 'INTAKE', '00000000-0000-0000-0000-000000000003', '2025-03-25', 'MEDIUM', FALSE, '00000000-0000-0000-0000-000000000003'),

-- PREPARATION tasks
('10000000-0000-0000-0000-000000000004', 'Prepare Form 1040', 'All documents received, ready to prepare', 'PREPARATION', '00000000-0000-0000-0000-000000000002', '2025-03-28', 'HIGH', FALSE, '00000000-0000-0000-0000-000000000002'),
('10000000-0000-0000-0000-000000000004', 'Calculate itemized deductions', 'Compare standard vs itemized', 'PREPARATION', '00000000-0000-0000-0000-000000000002', '2025-03-28', 'MEDIUM', FALSE, '00000000-0000-0000-0000-000000000002'),
('10000000-0000-0000-0000-000000000005', 'Prepare S-Corp return', 'Form 1120S and K-1 schedules', 'PREPARATION', '00000000-0000-0000-0000-000000000003', '2025-03-30', 'HIGH', FALSE, '00000000-0000-0000-0000-000000000003'),
('10000000-0000-0000-0000-000000000006', 'Reconcile multiple 1099-NECs', 'Verify all freelance income reported', 'PREPARATION', '00000000-0000-0000-0000-000000000004', '2025-03-29', 'MEDIUM', FALSE, '00000000-0000-0000-0000-000000000004'),

-- REVIEW tasks
('10000000-0000-0000-0000-000000000007', 'Senior review of Form 1040', 'QC check before e-filing', 'REVIEW', '00000000-0000-0000-0000-000000000002', '2025-04-01', 'HIGH', FALSE, '00000000-0000-0000-0000-000000000002'),
('10000000-0000-0000-0000-000000000008', 'Review partnership allocations', 'Verify K-1 distributions', 'REVIEW', '00000000-0000-0000-0000-000000000003', '2025-04-02', 'HIGH', FALSE, '00000000-0000-0000-0000-000000000003'),
('10000000-0000-0000-0000-000000000009', 'C-Corp tax provision review', 'Complex return - partner review needed', 'REVIEW', '00000000-0000-0000-0000-000000000001', '2025-04-03', 'HIGH', FALSE, '00000000-0000-0000-0000-000000000004'),

-- FILED tasks
('10000000-0000-0000-0000-000000000010', 'E-file Form 1120 and schedules', 'Submit to IRS', 'FILED', '00000000-0000-0000-0000-000000000002', '2025-03-15', 'HIGH', TRUE, '00000000-0000-0000-0000-000000000002'),
('10000000-0000-0000-0000-000000000011', 'E-file Form 1040', 'Return filed successfully', 'FILED', '00000000-0000-0000-0000-000000000003', '2025-03-12', 'HIGH', TRUE, '00000000-0000-0000-0000-000000000003'),

-- INVOICED tasks
('10000000-0000-0000-0000-000000000013', 'Generate invoice for S-Corp return', 'Calculate billable hours', 'INVOICED', '00000000-0000-0000-0000-000000000002', '2025-01-20', 'MEDIUM', TRUE, '00000000-0000-0000-0000-000000000002');

/* ----------------------------------------------------------------------
   MESSAGES: Sample communication history
   ------------------------------------------------------------------- */
INSERT INTO cpa_automation.messages (client_id, sender_id, sender_type, content, is_read) VALUES
-- John Doe messages
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'USER', 'Hi John, welcome to CPA Command Center! I''ve been assigned as your CPA. Please upload your W-2 when you have it.', TRUE),
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'USER', 'Thanks Sarah! I uploaded my ID, still waiting on my W-2 from my employer.', TRUE),
('10000000-0000-0000-0000-000000000001', NULL, 'AI', 'When is the tax filing deadline for 2024? The federal tax filing deadline for 2024 is April 15, 2025. If you need more time, you can file for an extension which gives you until October 15, 2025.', FALSE),

-- Alice Brown messages
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'USER', 'Hi Alice, I''ve received all your documents and I''m starting to prepare your return. Should be ready for review by end of week.', TRUE),
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000013', 'USER', 'That''s great, thank you! Do I qualify for any deductions?', TRUE),
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'USER', 'Based on your documents, you qualify for the standard deduction. I''ll also check if itemizing would be better for you.', TRUE),

-- David Martinez messages
('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002', 'USER', 'David, your return is complete and under final review. You should expect it to be filed by April 1st.', TRUE),
('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000016', 'USER', 'Excellent! What''s my estimated refund?', FALSE),

-- System notifications
('10000000-0000-0000-0000-000000000010', NULL, 'SYSTEM', 'Your 2024 tax return has been successfully filed with the IRS. Confirmation number: 2025-1234-5678', TRUE),
('10000000-0000-0000-0000-000000000011', NULL, 'SYSTEM', 'Your tax return has been accepted by the IRS. You can expect your refund in 21 days.', TRUE);

/* ----------------------------------------------------------------------
   MESSAGE_TEMPLATES: Pre-defined templates
   ------------------------------------------------------------------- */
INSERT INTO cpa_automation.message_templates (name, subject, content, category, variables, created_by_id) VALUES
('Welcome New Client', 'Welcome to CPA Command Center', 'Hi {{client_name}}, welcome to our tax preparation service! I''m {{cpa_name}}, your assigned CPA. Please upload your tax documents at your earliest convenience.', 'onboarding', '{"client_name": "string", "cpa_name": "string"}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('Document Request', 'Missing Documents', 'Hi {{client_name}}, we''re missing the following documents: {{missing_docs}}. Please upload them by {{deadline}} to avoid delays.', 'document_request', '{"client_name": "string", "missing_docs": "string", "deadline": "date"}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('Review Complete', 'Your Tax Return is Ready for Filing', 'Hi {{client_name}}, your tax return has been reviewed and is ready to file. Please review and approve before {{deadline}}.', 'status_update', '{"client_name": "string", "deadline": "date"}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('Return Filed', 'Tax Return Successfully Filed', 'Great news {{client_name}}! Your {{tax_year}} tax return has been filed with the IRS. Confirmation: {{confirmation_number}}', 'status_update', '{"client_name": "string", "tax_year": "number", "confirmation_number": "string"}'::jsonb, '00000000-0000-0000-0000-000000000001'),
('Invoice Reminder', 'Payment Reminder', 'Hi {{client_name}}, this is a friendly reminder that invoice #{{invoice_number}} for ${{amount}} is due on {{due_date}}.', 'billing', '{"client_name": "string", "invoice_number": "string", "amount": "number", "due_date": "date"}'::jsonb, '00000000-0000-0000-0000-000000000001');

/* ----------------------------------------------------------------------
   TIME_LOGS: Sample time tracking entries
   ------------------------------------------------------------------- */
INSERT INTO cpa_automation.time_logs (task_id, user_id, hours, hourly_rate, description) VALUES
((SELECT id FROM cpa_automation.tasks WHERE title = 'Prepare Form 1040'), '00000000-0000-0000-0000-000000000002', 2.5, 150.00, 'Initial review and data entry'),
((SELECT id FROM cpa_automation.tasks WHERE title = 'Calculate itemized deductions'), '00000000-0000-0000-0000-000000000002', 1.0, 150.00, 'Comparing standard vs itemized deductions'),
((SELECT id FROM cpa_automation.tasks WHERE title = 'Prepare S-Corp return'), '00000000-0000-0000-0000-000000000003', 4.5, 175.00, 'Form 1120S preparation and K-1 schedules'),
((SELECT id FROM cpa_automation.tasks WHERE title = 'Senior review of Form 1040'), '00000000-0000-0000-0000-000000000002', 0.75, 150.00, 'Quality control review'),
((SELECT id FROM cpa_automation.tasks WHERE title = 'E-file Form 1120 and schedules'), '00000000-0000-0000-0000-000000000002', 0.5, 150.00, 'Electronic filing process');

/* ----------------------------------------------------------------------
   INVOICES: Sample billing records
   ------------------------------------------------------------------- */
INSERT INTO cpa_automation.invoices (client_id, invoice_number, amount, tax, total, status, due_date, paid_at, created_by_id) VALUES
('10000000-0000-0000-0000-000000000010', 'INV-2025-001', 650.00, 0.00, 650.00, 'PAID', '2025-04-01', '2025-03-25 10:30:00', '00000000-0000-0000-0000-000000000002'),
('10000000-0000-0000-0000-000000000011', 'INV-2025-002', 425.00, 0.00, 425.00, 'PENDING', '2025-04-15', NULL, '00000000-0000-0000-0000-000000000003'),
('10000000-0000-0000-0000-000000000012', 'INV-2025-003', 375.00, 0.00, 375.00, 'PAID', '2025-03-30', '2025-03-28 14:20:00', '00000000-0000-0000-0000-000000000004'),
('10000000-0000-0000-0000-000000000013', 'INV-2025-004', 875.00, 0.00, 875.00, 'PENDING', '2025-02-15', NULL, '00000000-0000-0000-0000-000000000002'),
('10000000-0000-0000-0000-000000000014', 'INV-2025-005', 325.00, 0.00, 325.00, 'OVERDUE', '2025-02-28', NULL, '00000000-0000-0000-0000-000000000003');

/* ----------------------------------------------------------------------
   AI_FAQ_RESPONSES: Mock AI bot responses
   ------------------------------------------------------------------- */
INSERT INTO cpa_automation.ai_faq_responses (question, keywords, response, category) VALUES
('When is the tax filing deadline?', ARRAY['deadline', 'due date', 'when', 'file'], 'The federal tax filing deadline for 2024 is April 15, 2025. If you need more time, you can file for an extension which gives you until October 15, 2025 to submit your return.', 'deadlines'),
('What documents do I need?', ARRAY['documents', 'need', 'required', 'upload'], 'Common documents needed include: W-2s from employers, 1099 forms for contract work or investment income, mortgage interest statements (1098), student loan interest, charitable donation receipts, and business expense receipts if self-employed.', 'documents'),
('How do I track my refund?', ARRAY['refund', 'track', 'status', 'where is'], 'You can track your federal refund using the IRS "Where''s My Refund?" tool at IRS.gov. You''ll need your Social Security number, filing status, and exact refund amount. Refunds typically arrive within 21 days of e-filing.', 'refunds'),
('Can I deduct home office expenses?', ARRAY['home office', 'deduct', 'deduction', 'work from home'], 'If you''re self-employed and use part of your home exclusively and regularly for business, you may qualify for the home office deduction. You can use either the simplified method ($5 per square foot) or actual expense method.', 'deductions'),
('What is the standard deduction?', ARRAY['standard deduction', 'deduction amount'], 'For 2024, the standard deduction is $14,600 for single filers, $29,200 for married filing jointly, and $21,900 for head of household. If you''re 65 or older, you get an additional deduction.', 'deductions'),
('Do I need to file quarterly taxes?', ARRAY['quarterly', 'estimated', 'self-employed', 'payment'], 'If you''re self-employed or have income without withholding, you generally need to make quarterly estimated tax payments. These are due April 15, June 15, September 15, and January 15 of the following year.', 'payments'),
('What if I can''t pay my taxes?', ARRAY['can''t pay', 'owe', 'payment plan', 'installment'], 'If you can''t pay your full tax bill, you should still file on time to avoid penalties. The IRS offers payment plans (installment agreements) and you may qualify for an Offer in Compromise. Contact us to discuss your options.', 'payments'),
('What is a 1099 form?', ARRAY['1099', 'what is', 'form'], 'A 1099 form reports various types of income other than wages. Common types include 1099-NEC for contract work, 1099-INT for interest, 1099-DIV for dividends, and 1099-MISC for miscellaneous income. You''ll receive these from payers if you earned over certain thresholds.', 'forms'),
('Should I itemize or take standard deduction?', ARRAY['itemize', 'standard', 'which', 'better'], 'You should itemize if your deductible expenses (mortgage interest, state taxes, charitable donations, medical expenses) exceed the standard deduction. Your CPA will calculate both and recommend the option that saves you the most.', 'deductions'),
('What happens if I file late?', ARRAY['late', 'miss deadline', 'penalty'], 'Filing late can result in penalties of 5% of unpaid taxes per month, up to 25%. If you''re getting a refund, there''s no penalty for filing late, but you should file within 3 years to claim it. File for an extension if you need more time.', 'penalties');

-- Success message
SELECT 'Seed data inserted successfully!' AS status;
SELECT
    (SELECT COUNT(*) FROM cpa_automation.users) AS users_count,
    (SELECT COUNT(*) FROM cpa_automation.clients) AS clients_count,
    (SELECT COUNT(*) FROM cpa_automation.documents) AS documents_count,
    (SELECT COUNT(*) FROM cpa_automation.tasks) AS tasks_count,
    (SELECT COUNT(*) FROM cpa_automation.messages) AS messages_count,
    (SELECT COUNT(*) FROM cpa_automation.invoices) AS invoices_count,
    (SELECT COUNT(*) FROM cpa_automation.ai_faq_responses) AS faq_responses_count;
