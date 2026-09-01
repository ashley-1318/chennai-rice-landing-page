-- Auto-create a `businesses` row (and a zero-balance credit account) whenever a new
-- auth.users row is created via supabase.auth.signUp(), reading firm details out of
-- the user's raw_user_meta_data (passed as `options.data` at signUp time).

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.businesses (
    id, registered_business_name, business_type, gstin, tin, shop_name,
    number_of_outlets, representative_contact, mobile, email, delivery_pincode
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'registered_business_name', ''),
    coalesce((new.raw_user_meta_data ->> 'business_type')::business_type, 'retailer'),
    coalesce(new.raw_user_meta_data ->> 'gst_no', ''),
    coalesce(new.raw_user_meta_data ->> 'tin', ''),
    coalesce(new.raw_user_meta_data ->> 'shop_name', ''),
    coalesce((new.raw_user_meta_data ->> 'number_of_outlets')::integer, 1),
    coalesce(new.raw_user_meta_data ->> 'representative_contact', ''),
    coalesce(new.raw_user_meta_data ->> 'mobile', ''),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'delivery_pincode', '')
  );

  insert into public.credit_accounts (business_id, credit_limit, outstanding)
  values (new.id, 150000, 0);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
