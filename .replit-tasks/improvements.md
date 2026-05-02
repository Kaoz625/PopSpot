# Replit Agent Task: PopSpot
## Your Task
Build PopSpot MVP — an app for entrepreneurs to discover and claim pop-up spots.
Commit with 'replit: ' prefix. Push to main when done.

## Stack
- Frontend: React + TypeScript + Vite
- Auth: NextAuth.js
- DB: Supabase self-hosted (env var: SUPABASE_URL, SUPABASE_ANON_KEY)
- Payments: NOT needed for MVP
- Deploy: Cloudflare Pages

## Improvements
1. Audit current code — list what exists
2. Pivot from Firebase to Supabase self-hosted (remove all Firebase imports/deps)
3. Build MVP screens: Browse spots map, Spot detail, Claim spot, Entrepreneur profile
4. Add NextAuth.js auth (email + Google provider)
5. Add Supabase schema: spots table (id, name, address, price, available, owner_id)
6. Connect map to Mapbox free tier (env: MAPBOX_TOKEN)
7. Deploy config: add wrangler.toml for Cloudflare Pages

## Done When
- [ ] Firebase fully removed
- [ ] Supabase schema + client wired
- [ ] 4 MVP screens functional
- [ ] Auth working
- [ ] No TypeScript errors
