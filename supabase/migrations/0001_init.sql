-- Chennai Rice Industries — B2B trade portal schema
-- Run this once in the Supabase SQL Editor (Dashboard > SQL Editor > New query > paste > Run).

-- ============================================================
-- Extensions
-- ============================================================
create extension if not exists "pgcrypto";

-- ============================================================
-- Enums
-- ============================================================
create type business_type as enum ('retailer', 'wholesaler', 'distributor');
create type order_status as enum ('processing', 'shipped', 'delivered', 'cancelled');
create type payment_status as enum ('paid', 'unpaid', 'partial');
create type invoice_status as enum ('paid', 'unpaid', 'overdue', 'partial');

-- ============================================================
-- business_type_terms — pricing/credit rules per tier (reference data, public read)
-- ============================================================
create table business_type_terms (
  type business_type primary key,
  label text not null,
  tagline text not null,
  discount_percent numeric(5,2) not null default 0,
  discount_label text not null,
  quantity_label text not null,
  payment_terms text not null,
  minimum_order_kg integer not null,
  available_pack_sizes integer[] not null
);

-- ============================================================
-- businesses — one row per registered trade account, keyed to auth.users
-- ============================================================
create table businesses (
  id uuid primary key references auth.users (id) on delete cascade,
  registered_business_name text not null,
  business_type business_type not null,
  gstin text not null,
  tin text not null,
  shop_name text not null,
  number_of_outlets integer not null default 1,
  representative_contact text not null,
  mobile text not null,
  email text not null,
  delivery_pincode text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- addresses — saved addresses per business
-- ============================================================
create table addresses (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses (id) on delete cascade,
  label text not null default 'Other',
  contact_person text not null,
  mobile text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  district text not null,
  state text not null,
  pincode text not null,
  landmark text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index addresses_business_id_idx on addresses (business_id);

-- ============================================================
-- products — catalogue (public read, no business scoping)
-- ============================================================
create table products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  variety text not null,
  description text not null,
  origin text not null,
  tag text not null,
  image_path text not null,
  base_price_per_kg numeric(10,2) not null,
  stock_kg integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- orders
-- ============================================================
create table orders (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses (id) on delete cascade,
  order_number text not null unique,
  status order_status not null default 'processing',
  payment_status payment_status not null default 'unpaid',
  total_weight_kg numeric(10,2) not null default 0,
  subtotal numeric(12,2) not null default 0,
  discount numeric(12,2) not null default 0,
  gst numeric(12,2) not null default 0,
  freight numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  shipping_address_id uuid references addresses (id) on delete set null,
  billing_address_id uuid references addresses (id) on delete set null,
  created_at timestamptz not null default now()
);

create index orders_business_id_idx on orders (business_id);

-- ============================================================
-- order_items
-- ============================================================
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_id uuid not null references products (id),
  product_name text not null,
  pack_size integer not null,
  quantity integer not null,
  unit_price numeric(10,2) not null,
  total numeric(12,2) not null
);

create index order_items_order_id_idx on order_items (order_id);

-- ============================================================
-- order_timeline_steps
-- ============================================================
create table order_timeline_steps (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  step_order integer not null,
  label text not null,
  completed boolean not null default false,
  happened_at timestamptz
);

create index order_timeline_steps_order_id_idx on order_timeline_steps (order_id);

-- ============================================================
-- invoices
-- ============================================================
create table invoices (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses (id) on delete cascade,
  order_id uuid not null references orders (id) on delete cascade,
  invoice_number text not null unique,
  issue_date date not null default current_date,
  due_date date not null,
  amount numeric(12,2) not null,
  paid numeric(12,2) not null default 0,
  balance numeric(12,2) generated always as (amount - paid) stored,
  status invoice_status not null default 'unpaid',
  created_at timestamptz not null default now()
);

create index invoices_business_id_idx on invoices (business_id);

-- ============================================================
-- credit_accounts — one row per business (credit limit / outstanding)
-- ============================================================
create table credit_accounts (
  business_id uuid primary key references businesses (id) on delete cascade,
  credit_limit numeric(12,2) not null default 0,
  outstanding numeric(12,2) not null default 0
);

-- ============================================================
-- updated_at trigger for businesses
-- ============================================================
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger businesses_set_updated_at
  before update on businesses
  for each row execute function set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table businesses enable row level security;
alter table addresses enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_timeline_steps enable row level security;
alter table invoices enable row level security;
alter table credit_accounts enable row level security;
alter table business_type_terms enable row level security;

-- business_type_terms & products: public read-only reference/catalogue data
create policy "business_type_terms are publicly readable"
  on business_type_terms for select
  using (true);

create policy "products are publicly readable"
  on products for select
  using (true);

-- businesses: a user can read/update only their own row; insert only their own id at signup
create policy "Users can view own business"
  on businesses for select
  using (auth.uid() = id);

create policy "Users can insert own business"
  on businesses for insert
  with check (auth.uid() = id);

create policy "Users can update own business"
  on businesses for update
  using (auth.uid() = id);

-- addresses: scoped via owning business
create policy "Users can view own addresses"
  on addresses for select
  using (business_id = auth.uid());

create policy "Users can insert own addresses"
  on addresses for insert
  with check (business_id = auth.uid());

create policy "Users can update own addresses"
  on addresses for update
  using (business_id = auth.uid());

create policy "Users can delete own addresses"
  on addresses for delete
  using (business_id = auth.uid());

-- orders: scoped via owning business
create policy "Users can view own orders"
  on orders for select
  using (business_id = auth.uid());

create policy "Users can insert own orders"
  on orders for insert
  with check (business_id = auth.uid());

-- order_items: scoped via parent order's business
create policy "Users can view own order items"
  on order_items for select
  using (exists (select 1 from orders o where o.id = order_items.order_id and o.business_id = auth.uid()));

create policy "Users can insert own order items"
  on order_items for insert
  with check (exists (select 1 from orders o where o.id = order_items.order_id and o.business_id = auth.uid()));

-- order_timeline_steps: scoped via parent order's business
create policy "Users can view own order timeline"
  on order_timeline_steps for select
  using (exists (select 1 from orders o where o.id = order_timeline_steps.order_id and o.business_id = auth.uid()));

create policy "Users can insert own order timeline"
  on order_timeline_steps for insert
  with check (exists (select 1 from orders o where o.id = order_timeline_steps.order_id and o.business_id = auth.uid()));

-- invoices: scoped via owning business
create policy "Users can view own invoices"
  on invoices for select
  using (business_id = auth.uid());

-- credit_accounts: scoped via owning business
create policy "Users can view own credit account"
  on credit_accounts for select
  using (business_id = auth.uid());

-- ============================================================
-- Seed reference data — business type terms
-- ============================================================
insert into business_type_terms
  (type, label, tagline, discount_percent, discount_label, quantity_label, payment_terms, minimum_order_kg, available_pack_sizes)
values
  ('retailer', 'Retailer', 'List price, small quantities, prepaid.', 0, 'List Price', 'Small / retail quantities', 'Prepaid', 50, array[5, 10, 26]),
  ('wholesaler', 'Wholesaler', 'Sack quantities, credit that fits the market.', 6, '6% Off List', 'Market quantities', 'Net 15', 250, array[10, 26, 50]),
  ('distributor', 'Distributor', 'Territory volumes, extended settlement.', 12, '12% Off List', 'Territory volumes', 'Net 30', 1000, array[26, 50, 75, 100]);

-- ============================================================
-- Seed catalogue — products
-- ============================================================
insert into products (slug, name, variety, description, origin, tag, image_path, base_price_per_kg, stock_kg)
values
  ('vada-kolam-rice', 'Vada Kolam Rice', 'Kitchidi Ponni Rice',
   'A soft, lightweight everyday rice with a delicate aroma — well suited to daily household cooking.',
   'Erode, Tamil Nadu', 'Everyday', '/images/products/vada-kolam-rice.png', 58, 38000),
  ('premium-rice', 'Premium Rice', 'Kitchidi Ponni Rice',
   'Our finest grade Kitchidi Ponni, hand-selected for consistency and a clean, polished finish.',
   'Erode, Tamil Nadu', 'Premium', '/images/products/premium-rice.png', 74, 21000),
  ('raja-bogam-ponni', 'Raja Bogam Ponni', 'Special Rajabhogam',
   'A classic Rajabhogam variety milled for firm texture and reliable everyday performance in bulk kitchens.',
   'Erode, Tamil Nadu', 'High Volume', '/images/products/raja-bogam-ponni.png', 51, 54000),
  ('akshaya-ponni', 'Akshaya Ponni', 'Special Rajabhogam',
   'A well-rounded Ponni variety balancing aroma and texture, milled for both retail and institutional trade.',
   'Erode, Tamil Nadu', 'Bestseller', '/images/products/akshaya-ponni.png', 64, 46000);
