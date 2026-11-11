-- ====================================================================
-- PetCare CRM: Supabase Schema & Initial Migration
-- Includes: Profiles (Auth), Tutors, Pets, Appointments, Vaccines, Clinical History
-- Policies: Row Level Security (RLS) & Triggers
-- ====================================================================

-- 1. PROFILES TABLE (Linked with Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null,
  email text not null,
  role text not null default 'veterinario' check (role in ('veterinario', 'recepcionista', 'esteticista', 'administrador')),
  crmv text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger to create a profile automatically when a new user signs up in auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role, crmv)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'veterinario'),
    new.raw_user_meta_data->>'crmv'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 2. TUTORS (CLIENTES)
create table if not exists public.tutors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  document text, -- CPF
  address text,
  notes text,
  initials text,
  avatar_color text default 'bg-[#A7F3D0] text-[#047857]',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- 3. PETS (PACIENTES)
create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null references public.tutors(id) on delete cascade,
  name text not null,
  species text not null default 'Cão' check (species in ('Cão', 'Gato', 'Pássaro', 'Outro')),
  breed text default 'Sem Raça Definida (SRD)',
  gender text default 'Macho' check (gender in ('Macho', 'Fêmea')),
  age text,
  birth_date date,
  weight numeric(6,2),
  avatar_emoji text default '🐶',
  microchip text,
  allergies text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- 4. APPOINTMENTS (AGENDAMENTOS & ATENDIMENTOS)
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid references public.tutors(id) on delete set null,
  pet_id uuid not null references public.pets(id) on delete cascade,
  service_name text not null,
  service_category text not null check (service_category in ('estetica', 'vacina', 'clinica', 'odonto', 'cirurgia')),
  service_icon text default 'stethoscope',
  scheduled_date date not null default current_date,
  scheduled_time text not null, -- '09:30', '10:15', etc.
  duration_minutes integer default 45,
  location_or_doctor text not null,
  status text not null default 'agendado' check (status in ('agendado', 'em_atendimento', 'concluido', 'cancelado')),
  price numeric(10,2) default 0.00,
  notes text,
  assigned_staff text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- 5. VACCINES (CARTEIRA DE VACINAÇÃO DIGITAL)
create table if not exists public.vaccines (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  name text not null,
  date_given date not null default current_date,
  next_due_date date not null,
  batch text,
  veterinarian text,
  status text default 'em_dia' check (status in ('em_dia', 'pendente', 'atrasado')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- 6. CLINICAL HISTORY (PRONTUÁRIO CLÍNICO & EVOLUÇÕES)
create table if not exists public.clinical_history (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  veterinarian text not null,
  title text not null,
  description text not null,
  diagnosis text,
  prescription text,
  weight text,
  temperature text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures clinic staff can read and manage records securely
-- ====================================================================

alter table public.profiles enable row level security;
alter table public.tutors enable row level security;
alter table public.pets enable row level security;
alter table public.appointments enable row level security;
alter table public.vaccines enable row level security;
alter table public.clinical_history enable row level security;

-- Profiles: Authenticated users can view profiles and edit their own
create policy "Allow authenticated users to read profiles"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Allow users to update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- Tutors: Authenticated clinic users have full management access
create policy "Allow authenticated users to read tutors"
  on public.tutors for select to authenticated using (true);

create policy "Allow authenticated users to insert tutors"
  on public.tutors for insert to authenticated with check (true);

create policy "Allow authenticated users to update tutors"
  on public.tutors for update to authenticated using (true);

create policy "Allow authenticated users to delete tutors"
  on public.tutors for delete to authenticated using (true);

-- Pets: Authenticated clinic users have full management access
create policy "Allow authenticated users to read pets"
  on public.pets for select to authenticated using (true);

create policy "Allow authenticated users to insert pets"
  on public.pets for insert to authenticated with check (true);

create policy "Allow authenticated users to update pets"
  on public.pets for update to authenticated using (true);

create policy "Allow authenticated users to delete pets"
  on public.pets for delete to authenticated using (true);

-- Appointments: Authenticated clinic users have full management access
create policy "Allow authenticated users to read appointments"
  on public.appointments for select to authenticated using (true);

create policy "Allow authenticated users to insert appointments"
  on public.appointments for insert to authenticated with check (true);

create policy "Allow authenticated users to update appointments"
  on public.appointments for update to authenticated using (true);

create policy "Allow authenticated users to delete appointments"
  on public.appointments for delete to authenticated using (true);

-- Vaccines & Clinical History
create policy "Allow authenticated users to manage vaccines"
  on public.vaccines for all to authenticated using (true);

create policy "Allow authenticated users to manage clinical history"
  on public.clinical_history for all to authenticated using (true);


-- ====================================================================
-- INITIAL SEED DATA (Exemplo Inicial PetCare CRM)
-- ====================================================================

-- Insert sample tutors
insert into public.tutors (id, name, phone, email, initials, avatar_color)
values
  ('a1111111-1111-1111-1111-111111111111', 'Mariana Costa', '(11) 98765-4321', 'mariana.costa@email.com', 'MC', 'bg-[#A7F3D0] text-[#047857]'),
  ('a2222222-2222-2222-2222-222222222222', 'Rodrigo Fernandes', '(11) 97123-8890', 'rodrigo.fernandes@email.com', 'RF', 'bg-[#BFDBFE] text-[#1D4ED8]'),
  ('a3333333-3333-3333-3333-333333333333', 'Beatriz Lima', '(11) 96443-1200', 'beatriz.lima@email.com', 'BL', 'bg-[#E2E8F0] text-[#334155]'),
  ('a4444444-4444-4444-4444-444444444444', 'Gabriel Alves', '(11) 99341-7788', 'gabriel.alves@email.com', 'GA', 'bg-[#FED7AA] text-[#C2410C]')
on conflict do nothing;

-- Insert sample pets
insert into public.pets (id, tutor_id, name, species, breed, age, gender, weight, avatar_emoji, allergies)
values
  ('b1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Thor', 'Cão', 'Golden Retriever', '3 anos', 'Macho', 32.4, '🐶', array['Dermatite atópica a pólen']),
  ('b2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'Mia', 'Gato', 'Siamês', '2 anos', 'Fêmea', 3.8, '🐱', '{}'),
  ('b3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 'Pipoca', 'Cão', 'Poodle Toy', '5 anos', 'Fêmea', 4.2, '🐩', array['Picada de pulga (DAPP)']),
  ('b4444444-4444-4444-4444-444444444444', 'a4444444-4444-4444-4444-444444444444', 'Bento', 'Cão', 'Bulldog Francês', '4 anos', 'Macho', 13.1, '🐶', array['Dermatite de dobras faciais'])
on conflict do nothing;

-- Insert sample appointments matching today's board
insert into public.appointments (id, tutor_id, pet_id, service_name, service_category, service_icon, scheduled_date, scheduled_time, location_or_doctor, status, price)
values
  ('c1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'Banho & Tosa Completa', 'estetica', 'scissors', current_date, '09:30', 'Sala Estética 02', 'em_atendimento', 160.00),
  ('c2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', 'Vacina V10 + Raiva', 'vacina', 'syringe', current_date, '10:15', 'Consultório 01 • Dra. Camila', 'agendado', 195.00),
  ('c3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 'b3333333-3333-3333-3333-333333333333', 'Consulta Clínica Geral', 'clinica', 'stethoscope', current_date, '08:30', 'Finalizado às 09:12', 'concluido', 180.00),
  ('c4444444-4444-4444-4444-444444444444', 'a4444444-4444-4444-4444-444444444444', 'b4444444-4444-4444-4444-444444444444', 'Tosa Higiênica & Hidratação', 'estetica', 'bath', current_date, '11:00', 'Banho 01 • Esteticista Lucas', 'em_atendimento', 130.00)
on conflict do nothing;
