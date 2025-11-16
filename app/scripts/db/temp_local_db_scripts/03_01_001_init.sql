-- UUID generation (built-in on AWS RDS, GCP, etc.; otherwise install)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Case-insensitive text for email uniqueness
CREATE EXTENSION IF NOT EXISTS citext;

-- UUID generation (built-in on AWS RDS, GCP, etc.; otherwise install)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
