# Supabase + PostgreSQL Best Practices

## Query Performance
- Always add indexes on columns used in WHERE, ORDER BY, and JOIN clauses
- Use `.select('col1, col2')` instead of `.select('*')` — fetch only what you need
- Use `.limit()` and pagination for list queries
- For product listings: index on `category`, `featured`, `slug`, `created_at`
- For orders: index on `status`, `customer_email`, `created_at`, `cj_order_id`

## Row Level Security (RLS)
- Always enable RLS on every table
- Public read tables (products): `CREATE POLICY ... FOR SELECT USING (true)`
- Private tables (orders, customers): Access only via service_role key server-side
- Never expose the service_role key client-side
- Use `createAdminClient()` (service role) for server-side operations
- Use `createClient()` (anon key) for client-side reads of public data

## Connection Management
- Use connection pooling (Supavisor) for serverless environments (Vercel)
- Connection string format: `postgresql://postgres.[ref]:[pass]@aws-0-[region].pooler.supabase.com:6543/postgres`
- Direct connection (port 5432) only for migrations and schema changes
- Set `pool_mode=transaction` for serverless

## Schema Design
- Use UUID primary keys (`uuid_generate_v4()`)
- Use `TIMESTAMPTZ` for all timestamps (not `TIMESTAMP`)
- Use `JSONB` for flexible data (images array, shipping_address, order items)
- Add `CHECK` constraints for data integrity (price >= 0, valid status values)
- Use `TEXT` over `VARCHAR` — PostgreSQL treats them identically

## Security
- Never hardcode credentials in code
- Store secrets in environment variables
- Use parameterized queries (Supabase client does this automatically)
- Validate all user input server-side before database operations
