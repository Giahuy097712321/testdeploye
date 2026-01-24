# Vercel Environment Variables Configuration

## Required Setup for Both Frontend Projects

### Frontend Project (testdeploye)
**Environment Variables to set in Vercel Dashboard:**

```
VITE_API_BASE_URL=https://uav-test.onrender.com/api
VITE_MEDIA_BASE_URL=https://uav-test.onrender.com
```

### Frontend-Admin Project (needs to be created/configured)
**Environment Variables to set in Vercel Dashboard:**

```
VITE_API_BASE_URL=https://uav-test.onrender.com/api
VITE_MEDIA_BASE_URL=https://uav-test.onrender.com
```

## Vercel Configuration Steps

1. Go to https://vercel.com/dashboard
2. Select the project (testdeploye or admin project)
3. Go to Settings → Environment Variables
4. Add the variables above
5. Redeploy the project (or auto-redeeploy after git push)

## Files That Use These Variables

### frontend/
- `src/config/apiConfig.js` - Uses `VITE_API_BASE_URL` and `VITE_MEDIA_BASE_URL`
- `src/lib/apiInterceptor.js` - Uses API_BASE_URL from config

### frontend-admin/
- `src/config/apiConfig.js` - Uses `VITE_API_BASE_URL` and `VITE_MEDIA_BASE_URL`
- `src/constants/api.js` - Uses `VITE_API_BASE_URL` and `VITE_MEDIA_BASE_URL` (FIXED)
- `src/lib/api.js` - Uses `VITE_API_BASE_URL` and `VITE_MEDIA_BASE_URL` (FIXED)
- `src/lib/apiInterceptor.js` - Uses API_BASE_URL from config
- `src/lib/cloudinaryService.js` - Uses `VITE_API_BASE_URL` (FIXED)

## Backend Configuration (Render)

Backend already has:
- ✅ CORS configured to allow all origins
- ✅ Database configured (MySQL 5.7 on Aiven)
- ✅ All API endpoints working

## Testing URLs

After deployment:
- Frontend User: https://testdeploye.vercel.app
- Frontend Admin: https://[admin-project-name].vercel.app
- Backend API: https://uav-test.onrender.com/api

Test with browser developer tools:
- Open Network tab
- Check API requests go to correct base URL
- Verify no 404 or CORS errors
