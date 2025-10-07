# 🔧 CORS Configuration Fix for Appwrite

## The Problem
You're getting a "Failed to fetch" error because your Appwrite project doesn't allow requests from localhost.

## The Solution
Add your development domain to Appwrite's allowed origins.

## Steps to Fix:

### 1. Go to Appwrite Console
- Visit: https://cloud.appwrite.io
- Select your project: `rage-co` (ID: 68e53610001bfa01a8a5)

### 2. Add Platform
1. Go to **Settings** → **Platforms**
2. Click **Add Platform**
3. Select **Web App**
4. Fill in:
   - **Name**: `RAGE Development`
   - **Hostname**: `localhost:9002`
   - **Optional**: Check "Development" checkbox

### 3. Alternative: Try Different Endpoints
If the above doesn't work, your project might be in a different region. Try these endpoints one by one:

1. **Global**: `https://cloud.appwrite.io/v1` (current)
2. **EU Central**: `https://eu-central-1.appwrite.global/v1`
3. **US East**: `https://us-east-1.appwrite.global/v1`
4. **US West**: `https://us-west-1.appwrite.global/v1`

### 4. Find Your Correct Endpoint
1. Go to Appwrite Console
2. Look at the URL in your browser
3. If you see something like `eu-central-1.appwrite.io`, use the corresponding endpoint above

## Quick Test Commands

After making changes, restart your dev server and test:

```bash
# Stop the current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

## Next Steps
Once CORS is fixed, you should be able to:
- ✅ Create user accounts
- ✅ Login/logout
- ✅ Access the authentication system

Let me know which endpoint works for you!