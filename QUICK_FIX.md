# 🚀 QUICK FIX - Admin Dashboard Data Loading

## ✅ What Was Fixed
3 files in `frontend-admin/src/` were using hardcoded `localhost:5000` instead of reading environment variables.

| File | Status |
|------|--------|
| `constants/api.js` | ✅ FIXED |
| `lib/api.js` | ✅ FIXED |
| `lib/cloudinaryService.js` | ✅ FIXED |

## 🎯 What You Need To Do (2 Steps)

### Step 1: Set Environment Variables in Vercel (2 min)
1. Go to https://vercel.com/dashboard
2. Click on your **admin frontend project**
3. Go to **Settings → Environment Variables**
4. Add these two variables:

```
Name: VITE_API_BASE_URL
Value: https://uav-test.onrender.com/api

Name: VITE_MEDIA_BASE_URL
Value: https://uav-test.onrender.com
```

5. Click **Save** for each

### Step 2: Redeploy (5 min)
Either:
- **Option A:** Git push to auto-redeploy
- **Option B:** In Vercel, click "Redeploy" on latest deployment
- **Option C:** Run `vercel --prod` in terminal

**Wait 2-5 minutes for build to complete.**

## ✔️ Test It
1. Open admin dashboard in browser
2. Press F12 → Network tab
3. Click on an admin tab (e.g., Quản lý Giải pháp)
4. Check the API request URL:
   - ✅ Should be: `https://uav-test.onrender.com/api/...`
   - ❌ Should NOT be: `localhost:5000/...`

## 📊 What Gets Fixed
After environment variables are set, these will work:
- ✅ Quản lý Model 3D
- ✅ Quản lý Điểm 3D (Points)
- ✅ Quản lý Giải pháp (Solutions)
- ✅ Quản lý Người dùng (Users)
- ✅ Quản lý Khóa học (Courses)
- ✅ Quản lý Lịch thi (Exams)
- ✅ Quản lý Giấy phép (Licenses)
- ✅ Giao diện & Thông báo (Display Settings)

## 🆘 Still Not Working?
1. Check that Vercel env vars were saved (go back to Settings to verify)
2. Verify redeploy completed (should show "Ready" status)
3. Clear browser cache (Ctrl+Shift+Del)
4. Check Network tab for actual request URL
5. Check Console tab for error messages

## 📚 Full Documentation
See these files for more details:
- `VERCEL_SETUP_GUIDE.md` - Step-by-step guide
- `ADMIN_FIX_COMPLETE.md` - Complete explanation
- `SESSION_SUMMARY.md` - What was changed and why
