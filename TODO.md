# Vercel SPA Refresh Fix - COMPLETED ✅

## Changes:
- ✅ `vercel.json`: Fixed rewrites `/(.*) -> /index.html`

## Deploy:
```
git add vercel.json
git commit -m "fix: vercel spa refresh 404"
git push
vercel --prod
```

**Test:** Refresh `/courses/1` ✅


