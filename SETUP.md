# Chulha — Cooking Recipe + Social Community (React + Tailwind CSS)

## Run locally
```bash
npm install
npm run dev
```
Open the URL printed in the terminal.

## Tech
- React 19 + Vite
- Tailwind CSS v4 (all design tokens in `src/styles.css` — no tailwind.config.js in v4)
- TanStack Router (file-based routing in `src/routes/`)
- Lucide React icons, Recharts (admin charts), Sonner (toasts)

## Folder guide
```
src/
  styles.css                 design system: colors, fonts, shadows, animations
  lib/mock-data.ts           all demo data (users, recipes, posts, comments, admin stats)
  assets/                    food images used across the site
  components/chulha/         app components
    AppShell.tsx             sidebar + mobile bottom nav layout
    AuthLayout.tsx           login/register split layout
    RecipeCard.tsx           recipe card (image, time, difficulty, likes, save)
    PostCard.tsx             social feed post (like, comment, share, save)
    CommentSection.tsx       comments + replies
    CuisineCard.tsx          cuisine tile
    UserCard.tsx             user row with follow button
    Sidebars.tsx             trending recipes / suggested users panels
    AdminShell.tsx           admin layout + nav
    AdminTable.tsx           admin table, status pills, stat cards
  components/ui/             shadcn-style primitives (button, card, input, ...)
  routes/                    one file = one page
    index.tsx                landing page
    login.tsx  register.tsx  auth
    feed.tsx                 social feed
    explore.tsx              recipe search + filters
    recipes.$slug.tsx        recipe details (ingredients, steps, beginner tip)
    create.tsx               create post / recipe
    profile.$username.tsx    user profile
    cuisines.index.tsx  cuisines.$slug.tsx
    beginner.tsx             beginner "start here" guide
    notifications.tsx
    admin*.tsx               admin portal (dashboard, users, recipes, posts,
                             comments, cuisines, reports, settings)
```
`src/routeTree.gen.ts` is auto-generated on first `npm run dev` — do not edit it.

## Notes
- Data is mock/front-end only. Likes, follows, comments and admin actions update
  local state so the UI is fully clickable without a backend.
- To connect a backend later, replace the reads in `src/lib/mock-data.ts` with API calls.
