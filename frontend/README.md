# Neosix — Enterprise Software Company Website + Admin Panel

Production-ready marketing site and fully dynamic admin panel built with
React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, TanStack Query,
Axios, React Router, React Hook Form, Zod, Lucide React, React Helmet Async
and React Hot Toast.

## Quick start

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # typecheck + production build
```

## Admin panel

- URL: `/admin`
- Demo credentials: `technologiesneosix@gmail.com` / `neosix123`

Every piece of public content — hero, about, services, solutions, industries,
technologies, portfolio, case studies, blog, testimonials, team, careers, FAQ,
SEO metadata, media, settings — is CRUD-managed from the admin panel.

## Data layer

The app ships with a **localStorage-backed mock API** (seeded on first run)
so it works standalone. Point `VITE_API_URL` at a real backend implementing
the same REST conventions (`GET/POST /:resource`, `GET/PATCH/DELETE
/:resource/:id`, `GET /:resource/slug/:slug`) and the entire app switches over
— no component changes needed (see `src/api/resource.ts`).

To reset demo data: clear the `neosix.db` key from localStorage.

## Media uploads

Set `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` for real
Cloudinary uploads from the Media Library; otherwise files are stored inline
as data URLs for the demo.

## Architecture

```
src/
  api/          axios client, mock DB, resource factory, query hooks, seed
  components/
    ui/         reusable primitives (Button, Card, Modal, Tabs, …)
    common/     brand motifs (WaveDivider, BlobFrame, PageHero, Seo, …)
    layout/     Header, Footer, PublicLayout, AdminLayout
  features/     domain modules (home sections, catalog, admin CRUD, auth)
  pages/
    public/     routed public pages (+ routes.tsx manifest)
    admin/      routed admin pages (+ routes.tsx manifest)
  types/        shared domain models
  lib/          cn, utils
```

Key principle: **one generic CRUD system** (`ResourceCrudPage` +
`resourceConfigs`) powers all ~20 admin modules — single source of truth,
zero duplicated tables/forms.
