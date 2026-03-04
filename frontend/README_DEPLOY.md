# Deploy (Render) — Enterprise MVP

## Backend (Docker)
- Type: Docker
- Root: backend/
- ENV:
  - AI_URL=https://<your-ai-service>.onrender.com/analyze
  - CORS_ORIGINS=https://voicesafe.ai,https://voicesafe-frontend.onrender.com
  - CORS_ALLOW_ALL=0
  - MAX_UPLOAD_MB=50

## AI (Docker)
- Type: Docker
- Root: ai/
- ENV:
  - FRONTEND_URL=https://voicesafe.ai
  - CORS_ORIGINS=https://voicesafe-frontend.onrender.com
  - ENABLE_WHISPER=0
  - MAX_UPLOAD_MB=50

## Frontend
- Use your existing static hosting. Replace frontend/index.html with the provided file.
- Set URLS.PROD in index.html to your backend URL if different.
