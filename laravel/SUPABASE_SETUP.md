# 🚀 Supabase PostgreSQL Migration Guide

Your Laravel Aviator application has been fully configured to support **PostgreSQL (Supabase)**.

---

## 📋 Prerequisites

1. Create a free account at [Supabase.com](https://supabase.com)
2. Create a new project in your Supabase Dashboard.
3. Enable the `pdo_pgsql` and `pgsql` extensions in your PHP environment (`php.ini`).

---

## ⚙️ Step 1: Update Your `.env` File

Open your `laravel/.env` file and set your database configuration using your credentials from **Supabase Project Settings -> Database**:

```env
DB_CONNECTION=pgsql
DB_HOST=db.your-project-ref.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=YOUR_SUPABASE_DB_PASSWORD
DB_SSLMODE=require
```

> 💡 **Tip:** If using Supabase Connection Pooling (Transaction Mode), set `DB_PORT=6543`.

---

## 🏃 Step 2: Run Database Migrations

Once your `.env` credentials are configured, execute the standard Laravel artisan migration command:

```bash
php artisan migrate
```

This will automatically create all required tables on PostgreSQL Supabase:
- `users` (with avatar image support)
- `wallets`
- `userbits` (with status and cashout multiplier tracking)
- `gameresults`
- `transactions`
- `withdarwals`
- `bank_details`
- `settings` (with daily login rewards)
- `notifications`
- `chats` (for live chatroom)

---

## 🧪 Step 3: Verify Connection

Run the tinker CLI or test placing a bet / registering a user:

```bash
php artisan tinker
> DB::connection()->getPdo();
```

If successful, you will see a `PDO` instance connected to PostgreSQL.
