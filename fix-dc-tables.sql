-- Fix Daily Collection Tables - Data Type Mismatch
-- Run this script to drop and recreate the Daily Collection tables with correct data types

-- Drop tables in correct order (respecting foreign key constraints)
DROP TABLE IF EXISTS "public"."dc_receipt" CASCADE;
DROP TABLE IF EXISTS "public"."dc_receivable" CASCADE;
DROP TABLE IF EXISTS "public"."dc_loan" CASCADE;
DROP TABLE IF EXISTS "public"."dc_product" CASCADE;
DROP TABLE IF EXISTS "public"."dc_company" CASCADE;

-- Drop enums if they exist
DROP TYPE IF EXISTS "public"."enum_dc_loan_status" CASCADE;
DROP TYPE IF EXISTS "public"."enum_dc_product_frequency" CASCADE;
DROP TYPE IF EXISTS "public"."enum_dc_receipt_mode" CASCADE;

-- Create enums
CREATE TYPE "public"."enum_dc_loan_status" AS ENUM('ACTIVE', 'CLOSED');
CREATE TYPE "public"."enum_dc_product_frequency" AS ENUM('DAILY', 'WEEKLY');
CREATE TYPE "public"."enum_dc_receipt_mode" AS ENUM('CASH', 'UPI', 'BANK');

-- Create dc_company table
CREATE TABLE IF NOT EXISTS "public"."dc_company" (
    "id" VARCHAR(40) PRIMARY KEY,
    "parent_membership_id" INTEGER NOT NULL REFERENCES "public"."membership" ("id") ON DELETE RESTRICT,
    "company_name" VARCHAR(100) NOT NULL,
    "company_logo" TEXT,
    "contact_no" VARCHAR(15),
    "address" TEXT,
    "created_by" VARCHAR(40),
    "updated_by" VARCHAR(40),
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create dc_product table
CREATE TABLE IF NOT EXISTS "public"."dc_product" (
    "id" VARCHAR(40) PRIMARY KEY,
    "parent_membership_id" INTEGER NOT NULL REFERENCES "public"."membership" ("id") ON DELETE RESTRICT,
    "product_name" VARCHAR(100) NOT NULL,
    "frequency" "public"."enum_dc_product_frequency" NOT NULL,
    "duration" INTEGER NOT NULL,
    "interest_rate" DECIMAL(5,2) DEFAULT 0.00,
    "created_by" VARCHAR(40),
    "updated_by" VARCHAR(40),
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create dc_loan table with CORRECT data types
CREATE TABLE IF NOT EXISTS "public"."dc_loan" (
    "id" VARCHAR(40) PRIMARY KEY,
    "parent_membership_id" INTEGER NOT NULL REFERENCES "public"."membership" ("id") ON DELETE RESTRICT,
    "subscriber_id" VARCHAR(40) NOT NULL REFERENCES "public"."users" ("id") ON DELETE RESTRICT,
    "product_id" VARCHAR(40) NOT NULL REFERENCES "public"."dc_product" ("id") ON DELETE RESTRICT,
    "principal_amount" DECIMAL(12,2) NOT NULL,
    "start_date" DATE NOT NULL,
    "total_installments" INTEGER NOT NULL,
    "daily_due_amount" DECIMAL(12,2) NOT NULL,
    "closing_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "public"."enum_dc_loan_status" NOT NULL DEFAULT 'ACTIVE',
    "created_by" VARCHAR(40),
    "updated_by" VARCHAR(40),
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create dc_receivable table
CREATE TABLE IF NOT EXISTS "public"."dc_receivable" (
    "id" VARCHAR(40) PRIMARY KEY,
    "loan_id" VARCHAR(40) NOT NULL REFERENCES "public"."dc_loan" ("id") ON DELETE CASCADE,
    "parent_membership_id" INTEGER NOT NULL REFERENCES "public"."membership" ("id") ON DELETE RESTRICT,
    "due_date" DATE NOT NULL,
    "opening_balance" DECIMAL(12,2) NOT NULL,
    "due_amount" DECIMAL(12,2) NOT NULL,
    "carry_forward" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "closing_balance" DECIMAL(12,2) NOT NULL,
    "is_paid" BOOLEAN DEFAULT FALSE,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create dc_receipt table
CREATE TABLE IF NOT EXISTS "public"."dc_receipt" (
    "id" VARCHAR(40) PRIMARY KEY,
    "receivable_id" VARCHAR(40) NOT NULL REFERENCES "public"."dc_receivable" ("id") ON DELETE CASCADE,
    "parent_membership_id" INTEGER NOT NULL REFERENCES "public"."membership" ("id") ON DELETE RESTRICT,
    "paid_amount" DECIMAL(12,2) NOT NULL,
    "payment_date" DATE NOT NULL,
    "mode" "public"."enum_dc_receipt_mode" NOT NULL DEFAULT 'CASH',
    "remarks" TEXT,
    "created_by" VARCHAR(40),
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "dc_company_membership_idx" ON "public"."dc_company" ("parent_membership_id");
CREATE INDEX IF NOT EXISTS "dc_product_membership_idx" ON "public"."dc_product" ("parent_membership_id");
CREATE INDEX IF NOT EXISTS "dc_loan_membership_idx" ON "public"."dc_loan" ("parent_membership_id");
CREATE INDEX IF NOT EXISTS "dc_loan_subscriber_idx" ON "public"."dc_loan" ("subscriber_id");
CREATE INDEX IF NOT EXISTS "dc_loan_status_idx" ON "public"."dc_loan" ("status");
CREATE INDEX IF NOT EXISTS "dc_receivable_loan_idx" ON "public"."dc_receivable" ("loan_id");
CREATE INDEX IF NOT EXISTS "dc_receivable_due_date_idx" ON "public"."dc_receivable" ("due_date");
CREATE INDEX IF NOT EXISTS "dc_receipt_receivable_idx" ON "public"."dc_receipt" ("receivable_id");
CREATE INDEX IF NOT EXISTS "dc_receipt_payment_date_idx" ON "public"."dc_receipt" ("payment_date");

-- Add comments
COMMENT ON COLUMN "public"."dc_loan"."daily_due_amount" IS 'Planned due amount per cycle';
COMMENT ON COLUMN "public"."dc_product"."duration" IS 'Number of cycles (days or weeks)';
COMMENT ON COLUMN "public"."dc_product"."interest_rate" IS 'Interest rate percentage';

-- Success message
SELECT 'Daily Collection tables created successfully with correct data types!' as message;
