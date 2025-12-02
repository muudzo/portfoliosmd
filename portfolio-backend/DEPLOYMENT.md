# 🚀 Quick Deployment Reference

## Backend on Render

### 1. Push to GitHub
```bash
cd "/Users/michaelnyemudzo/portfoilio website real/portfoliosmd"
git add portfolio-backend/
git commit -m "Deploy backend to Render"
git push
```

### 2. Render Settings
- **Root Directory:** `portfolio-backend`
- **Build:** `npm install`
- **Start:** `npm start`

### 3. Environment Variables
```
NODE_ENV=production
PORT=5050
EMAIL_USER=tatendawalter62@gmail.com
EMAIL_PASS=gfuo meiy wsue nxaa
```

### 4. Get Your URL
After deployment: `https://portfolio-backend-xxxx.onrender.com`

---

## Update Frontend

### Edit script.js (line 286)
```javascript
return isProduction 
    ? 'https://YOUR-RENDER-URL.onrender.com'  // ← Paste your Render URL here
    : 'http://localhost:5050';
```

---

## Frontend on Netlify

### Drag & Drop Method
1. Go to netlify.com
2. Drag these files:
   - index.html
   - styles.css
   - script.js
   - images/ folder

### Your Site
`https://random-name.netlify.app`

---

## Test Checklist

- [ ] Backend health check: `curl https://your-render-url.onrender.com/health`
- [ ] Open Netlify site
- [ ] Fill contact form
- [ ] Check for success notification
- [ ] Verify email received

---

## Important Notes

> **Render Free Tier:** Spins down after 15 min inactivity. First request may take 30-60 seconds.

> **CORS:** Already configured to allow all *.netlify.app domains

> **Email:** Sends to tatendawalter62@gmail.com
