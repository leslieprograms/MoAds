# MoAds - Ad Campaign Builder

MoAds is a simple and intuitive tool that helps users create, manage, and preview ad campaigns quickly.
It provides an easy-to-use interface to enter campaign details and organize ad content, helping marketers and small businesses streamline the ad-creation process.

## Running the app

```bash
git clone https://github.com/leslieprograms/MoAds.git
cd MoAds
npm install
npm run dev
```

## Deploying on Vercel

- Build command: `npm run build`
- Output directory: `dist`
- Environment variables required (Project Settings → Environment Variables):
	- `VITE_SUPABASE_URL`
	- `VITE_SUPABASE_ANON_KEY`

If these aren’t set, the app will still load but Supabase features will be disabled.
