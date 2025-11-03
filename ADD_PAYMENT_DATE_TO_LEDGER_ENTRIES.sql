-- Migration: Add payment_date column to dc_ledger_entries table
-- This allows day book calculation to use the actual payment date chosen by customer
-- instead of created_at timestamp

-- Check if column already exists before adding
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'dc_ledger_entries' 
        AND column_name = 'payment_date'
    ) THEN
        -- Add payment_date column (nullable for existing records)
        ALTER TABLE "public"."dc_ledger_entries" 
        ADD COLUMN "payment_date" DATE;

        -- Create index for better query performance
        CREATE INDEX IF NOT EXISTS "dc_ledger_entries_payment_date_idx" 
        ON "public"."dc_ledger_entries" ("payment_date");

        -- For existing records, set payment_date = DATE(created_at) as fallback
        UPDATE "public"."dc_ledger_entries"
        SET "payment_date" = DATE("created_at")
        WHERE "payment_date" IS NULL;

        -- After backfill, make column NOT NULL for new records
        ALTER TABLE "public"."dc_ledger_entries" 
        ALTER COLUMN "payment_date" SET NOT NULL;

        RAISE NOTICE 'Column payment_date added successfully to dc_ledger_entries';
    ELSE
        RAISE NOTICE 'Column payment_date already exists in dc_ledger_entries';
    END IF;
END $$;

-- Add comment to document the column
COMMENT ON COLUMN "public"."dc_ledger_entries"."payment_date" IS 
'Payment date chosen by customer. Used for day book calculation instead of created_at.';

-- Verify the column was added
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'dc_ledger_entries' 
AND column_name = 'payment_date';

