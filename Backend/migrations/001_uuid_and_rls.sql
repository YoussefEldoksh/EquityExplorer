-- Migration: Convert to UUID and Enable RLS
-- Converts user IDs from sequential integers to random UUIDs
-- Implements Row Level Security for defense-in-depth
--
-- CONSEQUENCE: Existing JWT tokens (with integer IDs) become invalid
-- Users will need to login again to get new tokens with UUID format
-- This is acceptable and provides a security refresh
--
-- BENEFITS: Random UUIDs, clean implementation, no temporary tables/hacks

-- Step 1: Add UUID extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Step 2: Add temporary UUID column to users table
ALTER TABLE users ADD COLUMN id_new UUID DEFAULT gen_random_uuid() UNIQUE;

-- Step 3: Verify conversion worked
ALTER TABLE users ALTER COLUMN id_new SET NOT NULL;

-- Step 4: Drop old constraints on dependent tables
ALTER TABLE watchlist DROP CONSTRAINT IF EXISTS watchlist_user_id_fkey;
ALTER TABLE price_alerts DROP CONSTRAINT IF EXISTS price_alerts_user_id_fkey;

-- Step 5: Convert dependent table user_id columns to UUID
ALTER TABLE watchlist ADD COLUMN user_id_new UUID;
UPDATE watchlist w
SET user_id_new = u.id_new
FROM users u
WHERE w.user_id = u.id;
ALTER TABLE watchlist ALTER COLUMN user_id_new SET NOT NULL;
ALTER TABLE watchlist DROP COLUMN user_id;
ALTER TABLE watchlist RENAME COLUMN user_id_new TO user_id;

ALTER TABLE price_alerts ADD COLUMN user_id_new UUID;
UPDATE price_alerts pa
SET user_id_new = u.id_new
FROM users u
WHERE pa.user_id = u.id;
ALTER TABLE price_alerts ALTER COLUMN user_id_new SET NOT NULL;
ALTER TABLE price_alerts DROP COLUMN user_id;
ALTER TABLE price_alerts RENAME COLUMN user_id_new TO user_id;

-- Step 6: Replace old id column with new UUID column
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE users DROP COLUMN id;
ALTER TABLE users RENAME COLUMN id_new TO id;
ALTER TABLE users ADD PRIMARY KEY (id);

-- Step 7: Add indexes for performance
CREATE INDEX idx_users_id ON users(id);
CREATE INDEX idx_watchlist_user_id ON watchlist(user_id);
CREATE INDEX idx_price_alerts_user_id ON price_alerts(user_id);

-- Step 8: Re-add foreign key constraints
ALTER TABLE watchlist ADD CONSTRAINT watchlist_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE price_alerts ADD CONSTRAINT price_alerts_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Step 9: Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

-- Step 10: Create RLS Policies (restrictive - only users see their own data)
-- For users table: users can only view/update their own profile
CREATE POLICY users_select_own ON users FOR SELECT
  USING (id = (current_setting('app.current_user_id', true)::uuid));

CREATE POLICY users_update_own ON users FOR UPDATE
  USING (id = (current_setting('app.current_user_id', true)::uuid));

-- For watchlist: users can only view/modify their own watchlist
CREATE POLICY watchlist_select_own ON watchlist FOR SELECT
  USING (user_id = (current_setting('app.current_user_id', true)::uuid));

CREATE POLICY watchlist_insert_own ON watchlist FOR INSERT
  WITH CHECK (user_id = (current_setting('app.current_user_id', true)::uuid));

CREATE POLICY watchlist_delete_own ON watchlist FOR DELETE
  USING (user_id = (current_setting('app.current_user_id', true)::uuid));

-- For price_alerts: users can only view/modify their own alerts
CREATE POLICY alerts_select_own ON price_alerts FOR SELECT
  USING (user_id = (current_setting('app.current_user_id', true)::uuid));

CREATE POLICY alerts_insert_own ON price_alerts FOR INSERT
  WITH CHECK (user_id = (current_setting('app.current_user_id', true)::uuid));

CREATE POLICY alerts_delete_own ON price_alerts FOR DELETE
  USING (user_id = (current_setting('app.current_user_id', true)::uuid));

CREATE POLICY alerts_update_own ON price_alerts FOR UPDATE
  USING (user_id = (current_setting('app.current_user_id', true)::uuid));

-- VERIFICATION QUERIES (run after migration to confirm data integrity)
-- SELECT COUNT(*) FROM users;  -- Should match pre-migration count
-- SELECT COUNT(*) FROM watchlist;  -- Should match pre-migration count
-- SELECT COUNT(*) FROM price_alerts;  -- Should match pre-migration count
-- SELECT * FROM users LIMIT 1;  -- Verify UUID format is random UUID
