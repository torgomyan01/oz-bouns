# swappe

## DB Link

`http://81.177.140.232:8080/`

## Dev Link

`https://dev.swappe.ru/`

## Server IP

`81.177.140.232`

## Environment Variables

For the application to work properly, especially on Vercel, you need to set the following environment variables:

### Required Environment Variables:

1. **DATABASE_URL** - MySQL database connection string
   - Format: `mysql://user:password@host:port/database`

2. **NEXTAUTH_SECRET** - Secret key for NextAuth.js (REQUIRED for authentication)
   - Generate a secret with: `openssl rand -base64 32`
   - Or use an online generator: https://generate-secret.vercel.app/32
   - **This is the main cause of the "Configuration" error if missing**

3. **NEXTAUTH_URL** - The canonical URL of your site (optional but recommended)
   - For production: `https://oz-bouns.vercel.app`
   - For local development: `http://localhost:3000`

### Setting Environment Variables in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: `NEXTAUTH_SECRET`
   - **Value**: Your generated secret (e.g., from `openssl rand -base64 32`)
   - **Environment**: Select all (Production, Preview, Development)
4. Click **Save**
5. Redeploy your application

**Important**: After adding `NEXTAUTH_SECRET`, you must redeploy for the changes to take effect.
