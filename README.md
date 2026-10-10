# Ace_X AI

Your coding and study assistant. Next.js 14 (App Router) + TypeScript.

## Run it locally
```bash
npm install
cp .env.example .env.local   # then add your ANTHROPIC_API_KEY
npm run dev
```
Open http://localhost:3000

## Put it on GitHub
```bash
git init
git add .
git commit -m "Ace_X AI front end"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/acex-ai.git
git push -u origin main
```

## Deploy on Vercel
1. Import the GitHub repo at vercel.com/new.
2. Add the environment variables from `.env.example`.
3. Deploy. Later: add your domain under Project Settings > Domains, set `NEXT_PUBLIC_SITE_URL` to it, and submit `/sitemap.xml` in Google Search Console.

## Structure
- `app/` pages, layout, `api/chat` route, robots and sitemap
- `components/markup.ts` the approved front-end markup (convert to React components step by step)
- `public/app.js` the front-end behaviour (login, chat, quizzes, planner, settings, Pro)
- `public/logo*.{png,webp}` your logo files

## Payments (Paystack) and admin
1. Add these in Vercel: `PAYSTACK_SECRET_KEY` (start with your TEST secret key), `PRO_TOKEN_SECRET` (a long random phrase, 32+ characters) and `ADMIN_CODE`.
2. Pro status is a signed token that the server checks on every Pro feature (Exam Practice, Formula Hub, Image Studio, Double-check). It is stored per device until real accounts exist.
3. To go live, swap the Paystack TEST secret key for the LIVE one and redeploy.

## Still demo-only (backend work, in this order)
1. Real accounts (login, sign-up, saved chats) instead of browser storage
2. Pro plans and payments checked on the server (prices: GH2 1 week, GH4 2 weeks, GH6 3 weeks, GH8 1 month, GH40 5 months, GH100 1 year)
3. Admin lock checked on the server (no admin code in the browser)
4. Rate limits and a per-plan message limit on `/api/chat`
5. Real quizzes, Code Lab AI help, Exam Practice, Formula Hub and Image Studio
6. File and image uploads sent to the AI
