# WineNow Project

This project has been split into a Next.js `frontend` and an Express.js `backend` as requested.

## 🚀 Running Locally

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
The frontend will run at `http://localhost:3000`.

### Backend (Express)
```bash
cd backend
npm install
npm run dev
```
The backend will run at `http://localhost:3001`.

## ⚙️ Environment Variables
You will need to set up `.env` files for both frontend and backend.

### `frontend/.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### `backend/.env`
```
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
STRIPE_SECRET_KEY=sk_test_...
```

## ☁️ Deployment to Vercel

1. Push this repository to GitHub.
2. In the Vercel dashboard, click "Add New Project" and import your GitHub repository.
3. Under **Build and Output Settings**, set the **Root Directory** to `frontend`.
4. Add the Frontend Environment Variables in Vercel.
5. Click **Deploy**.

For the backend, you can deploy the `backend` folder to a service like **Render**, **Railway**, หรือ **Heroku**.
*(Note: Vercel is best optimized for the frontend Next.js App).*
