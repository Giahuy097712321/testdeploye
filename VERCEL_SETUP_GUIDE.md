# 📋 Step-by-Step Guide: Setting Vercel Environment Variables

## 🎯 Objective
Configure your **frontend-admin** project on Vercel so it uses the correct backend URL in production.

---

## 📍 Prerequisites
- You have a Vercel account (https://vercel.com)
- You have deployed the `frontend-admin` to Vercel
- You know your admin project name on Vercel

---

## ✅ Step 1: Access Your Admin Project Settings

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   
2. **Find Your Admin Project**
   - Look for the project you deployed from `frontend-admin/`
   - It might be named something like:
     - `uav-admin`
     - `trungtam-admin`
     - `my-3d-admin-map`
   - Click on it

3. **Go to Project Settings**
   - Click the **Settings** tab (top of page)
   - This opens your project settings

---

## 🔧 Step 2: Add Environment Variables

1. **Find Environment Variables Section**
   - In Settings, look for **Environment Variables** in the left sidebar
   - Click on it

2. **You'll see a form** with:
   - "Name" field
   - "Value" field
   - A dropdown to select which environments to apply to

3. **Add First Variable: API Base URL**
   
   **Fill in:**
   - Name: `VITE_API_BASE_URL`
   - Value: `https://uav-test.onrender.com/api`
   - Select: ✓ Preview, ✓ Production, ✓ Development (or keep default)
   
   **Then click: "Save"**

4. **Add Second Variable: Media Base URL**
   
   **Fill in:**
   - Name: `VITE_MEDIA_BASE_URL`
   - Value: `https://uav-test.onrender.com`
   - Select: ✓ Preview, ✓ Production, ✓ Development (or keep default)
   
   **Then click: "Save"**

---

## 📊 Screenshot Reference

After adding both variables, you should see:

```
Environment Variables

Name                      Value                                    Environments
─────────────────────────────────────────────────────────────────────────────
VITE_API_BASE_URL        https://uav-test.onrender.com/api       Preview, Prod...
VITE_MEDIA_BASE_URL      https://uav-test.onrender.com          Preview, Prod...
```

---

## 🚀 Step 3: Trigger a Redeploy

After saving environment variables, you need to rebuild with the new env vars.

### Option A: Automatic (Recommended)
1. Open a terminal
2. Navigate to your project root
3. Make a small change to a file (e.g., add a comment)
4. Commit and push to git:
   ```bash
   git add .
   git commit -m "Trigger redeploy with env vars"
   git push
   ```
5. Vercel automatically redeploys

### Option B: Manual Redeploy
1. In Vercel dashboard
2. Find the **Deployments** tab
3. Click the three dots (...) on the latest deployment
4. Select **Redeploy**

### Option C: From Vercel CLI (if you have it installed)
```bash
vercel --prod
```

---

## ⏱️ Wait for Build

1. You'll see a "Building" status in Vercel dashboard
2. Wait 2-5 minutes for the build to complete
3. When done, status changes to "Ready" (green checkmark)

---

## ✔️ Step 4: Verify Configuration

1. **Open your admin frontend** in browser
   - URL: `https://[your-admin-project].vercel.app`

2. **Open Developer Tools** (F12)

3. **Go to Application tab**
   - Select **Local Storage**
   - Look for your domain

4. **Check Network Tab**
   - Refresh the page
   - Make an API call (click on an admin tab)
   - Look at the request URL
   - Should start with: `https://uav-test.onrender.com/api/`
   - Should **NOT** start with: `localhost:5000`

---

## 🎯 Expected Results

After everything is set up correctly:

✅ **API Calls Should Go To:**
```
https://uav-test.onrender.com/api/users
https://uav-test.onrender.com/api/points
https://uav-test.onrender.com/api/courses
```

❌ **NOT To (old hardcoded URL):**
```
http://localhost:5000/api/...
```

---

## 🔍 Troubleshooting

### Problem: Environment variables not working
- **Solution:** 
  - Make sure you clicked "Save" after entering each variable
  - Verify you triggered a redeploy (new build must happen after env vars are saved)
  - Clear browser cache and reload

### Problem: Still seeing localhost:5000 in network requests
- **Solution:**
  - Redeploy again (sometimes Vercel cache causes issues)
  - Check that env vars are listed in Settings → Environment Variables
  - In the Vercel dashboard, watch the build logs to confirm env vars were injected

### Problem: Getting 404 errors on API calls
- **Solution:**
  - Check the actual request URL in Network tab
  - Make sure it's using correct domain: `https://uav-test.onrender.com/api/`
  - Verify backend server is running on Render

### Problem: Getting CORS errors
- **Solution:**
  - Backend CORS is already configured to allow all origins
  - If you still get CORS error, check browser console for exact error message
  - This usually means the backend isn't reachable

---

## 📞 Quick Reference

**Your Backend Server:**
- URL: `https://uav-test.onrender.com`
- API Endpoint: `https://uav-test.onrender.com/api/`
- Test it: Visit https://uav-test.onrender.com/api/users in browser
  - If working: See JSON response (or auth error)
  - If broken: See HTML error page

**Your Frontend Admin:**
- Where to deploy: Vercel dashboard
- Environment vars needed: VITE_API_BASE_URL, VITE_MEDIA_BASE_URL
- Rebuild required: After setting env vars

---

## ✨ Summary

```
┌──────────────────────────────────────────────┐
│ 1. Go to Vercel Dashboard                    │
│ 2. Select Admin Project                      │
│ 3. Settings → Environment Variables          │
│ 4. Add VITE_API_BASE_URL                     │
│ 5. Add VITE_MEDIA_BASE_URL                   │
│ 6. Trigger Redeploy (git push)               │
│ 7. Wait for build (2-5 min)                  │
│ 8. Test in browser (F12 → Network)           │
│ 9. Verify API URLs use uav-test.onrender.com │
└──────────────────────────────────────────────┘
```

**Done!** Your admin dashboard should now load data from the production backend.
