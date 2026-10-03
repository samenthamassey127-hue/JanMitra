-- ==============================================================================
-- JanMitra (जनमित्र) - PostgreSQL Production Database Schema
-- Unified Statutory Civic Intelligence & Public Service Delivery Platform
-- Compatible with PostgreSQL 14+, Neon, Supabase, Render, AWS RDS
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('citizen', 'csc_operator', 'gram_pradhan', 'officer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE journey_stage AS ENUM (
        'discovered', 
        'docs_collected', 
        'applied', 
        'under_scrutiny', 
        'field_verification', 
        'sanctioned', 
        'rejected', 
        'appealed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE service_status AS ENUM ('pending', 'in_progress', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. USERS & CITIZEN PROFILES
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email CITEXT UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(15),
    role user_role DEFAULT 'citizen' NOT NULL,
    district VARCHAR(100) DEFAULT 'Lucknow',
    tehsil VARCHAR(100),
    block VARCHAR(100),
    gram_panchayat VARCHAR(100),
    social_category VARCHAR(20) DEFAULT 'General', -- General, OBC, SC, ST, EWS
    annual_income NUMERIC(12, 2) DEFAULT 0,
    aadhaar_last4 VARCHAR(4),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. WELFARE SCHEMES REPOSITORY
CREATE TABLE IF NOT EXISTS schemes (
    id VARCHAR(100) PRIMARY KEY,
    scheme_code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    title_hi VARCHAR(255) NOT NULL,
    ministry VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    target_group VARCHAR(150),
    financial_benefit VARCHAR(255),
    benefit_type VARCHAR(50) DEFAULT 'Direct Benefit Transfer (DBT)',
    eligibility_criteria JSONB DEFAULT '{}'::jsonb,
    document_checklist JSONB DEFAULT '[]'::jsonb,
    statutory_rules JSONB DEFAULT '[]'::jsonb,
    application_url TEXT,
    helpline VARCHAR(50),
    sla_days INTEGER DEFAULT 30,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. SCHEME VERSIONING & GAZETTE VERIFICATION
CREATE TABLE IF NOT EXISTS scheme_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheme_id VARCHAR(100) REFERENCES schemes(id) ON DELETE CASCADE,
    version_tag VARCHAR(50) NOT NULL,
    gazette_order_number VARCHAR(150) NOT NULL,
    gazette_date DATE NOT NULL,
    changes_summary TEXT NOT NULL,
    statutory_reference_url TEXT,
    verified_by_officer VARCHAR(150),
    verification_status VARCHAR(50) DEFAULT 'Gazette Verified',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. PUBLIC SERVICES CATALOG (UP Janhit Guarantee / e-District)
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(100) PRIMARY KEY,
    service_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    name_hi VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    sla_days INTEGER NOT NULL DEFAULT 15,
    statutory_act VARCHAR(255) DEFAULT 'UP Right to Public Services Act (Janhit Guarantee) 2011',
    designated_officer VARCHAR(150) DEFAULT 'Tehsildar',
    appellate_officer VARCHAR(150) DEFAULT 'Sub-Divisional Magistrate (SDM)',
    fee_in_inr NUMERIC(8, 2) DEFAULT 30.00,
    required_documents JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. VAKH CIVIC NOTICES (Ground Reality & Camps)
CREATE TABLE IF NOT EXISTS notices (
    id VARCHAR(100) PRIMARY KEY,
    author VARCHAR(150) NOT NULL,
    handle VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    location VARCHAR(200) NOT NULL,
    district VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    category VARCHAR(50) DEFAULT 'Notice',
    likes INTEGER DEFAULT 0,
    pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. CITIZEN APPLICATION JOURNEYS & TRACKING
CREATE TABLE IF NOT EXISTS journeys (
    id VARCHAR(100) PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    scheme_id VARCHAR(100) REFERENCES schemes(id) ON DELETE SET NULL,
    scheme_title VARCHAR(255) NOT NULL,
    citizen_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    district VARCHAR(100) NOT NULL,
    current_stage journey_stage DEFAULT 'discovered' NOT NULL,
    application_number VARCHAR(100) UNIQUE,
    dbt_account_seeded BOOLEAN DEFAULT FALSE,
    notes TEXT,
    documents_submitted JSONB DEFAULT '[]'::jsonb,
    stage_history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. AUDIT & VERIFICATION LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. INDEXES FOR HIGH-THROUGHPUT SEARCH
CREATE INDEX IF NOT EXISTS idx_schemes_category ON schemes(category);
CREATE INDEX IF NOT EXISTS idx_schemes_active ON schemes(is_active);
CREATE INDEX IF NOT EXISTS idx_notices_district ON notices(district);
CREATE INDEX IF NOT EXISTS idx_journeys_user ON journeys(user_id);
CREATE INDEX IF NOT EXISTS idx_journeys_appnum ON journeys(application_number);
CREATE INDEX IF NOT EXISTS idx_scheme_versions_scheme ON scheme_versions(scheme_id);
