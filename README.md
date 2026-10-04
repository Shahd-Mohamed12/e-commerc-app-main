# FreshCart (Next.js App Router)

E-commerce storefront built with **Next.js 16 (App Router)** + React 19, Tailwind CSS 4, Flowbite,
Redux Toolkit, TanStack Query, Swiper and GSAP. Data comes from the Route E-Commerce API.

## Scripts

```bash
npm run dev     # http://localhost:3000
npm run build   # production build (.next)
npm run start   # serve the production build
npm run lint    # eslint
```

## Structure

```
src/
  app/                  # App Router
    layout.jsx          # root layout (server): metadata, fonts, CSS
    providers.jsx       # client: Redux + React Query + toasts + Cart/Wishlist merge
    globals.css         # Tailwind 4 + Flowbite + Exo theme
    page.jsx            # /
    products/           # /products, /products/[id]
    categories/         # /categories, /categories/[categoryId]
    brands/ cart/ wishlist/ checkout/ orders/ profile/
    login/ register/ signup/ forget-password/ reset-password/
    search/ contact/ deals/ about/
    not-found.jsx
  Components/           # UI (all client components)
  api/                  # axios instance + endpoints
  hooks/                # react-query + guest state hooks
  redux/                # auth, guest cart, guest wishlist
  assets/               # images
```

Routing uses `next/link` (`href`) and `next/navigation` (`useRouter`, `useParams`, `usePathname`,
`useSearchParams`). Pages that read search params are wrapped in `<Suspense>`.

## API

Base URL: `https://ecommerce.routemisr.com/api/v1` — the token is read from `localStorage` and sent
as the `token` header (client-side only, so cart/wishlist/orders queries stay client-side while
product/category pages are server-rendered with metadata for SEO).

`/auth/forgotPassword` and `/auth/resetPassword` are not available on the API, so those screens are
UI-only.
