# Phase 6: Home Page (Sprint 6)

**Goal:** Implement a publicly accessible restaurant page that showcases all restaurant's information.

1. Table of Contents

- 1. Overview
- 2. Scope
- 3. Users & Roles
- 4. Non-Functional Requirements
- 5. UI Requirements (by Section)
- 6. Functional Requirements
- 7. Data Model
- 8. API Contracts
- 9. Permissions Matrix
- 10. Telemetry & Analytics
- 12. Security & Compliance
- 15. Project Structure

1. Overview
   Build the restaurant detail experience for QPick:
   _ Discover featured dishes
   _ Browse full menu via category tabs
   _ Search within a restaurant
   _ Add to cart
   _ View restaurant info (hours, address, contacts)
   _ Read/submit reviews
   _ Map embed & social/footer
   Primary tech (proposed):
   _ Frontend: Next.js (App Router), TypeScript, Tailwind, shadcn/ui, Lucide icons
   _ Backend: Django REST Framework, PostgreSQL
   _ Auth: JWT (access/refresh)
   _ Media: S3-compatible storage (e.g., Cloudflare R2 / AWS S3)
   _ Maps: Google Maps JS Embed (or Leaflet + OSM) \* Payments (later phase): Stripe or local wallet

1. Scope
   In: page rendering, menu tabs, cart add, search, reviews CRUD, map, hours. Out (later): delivery tracking, coupons, real-time inventory, table booking.

1. Users & Roles

- Guest: browse, search, read reviews, add to cart (local), sign up to checkout.
- Customer: all above + post reviews, place orders, see history.
- Restaurant Admin: manage menu, categories, hours, photos, featured, moderate reviews.
- System Admin: manage restaurants, users, global configuration.

1. Non-Functional Requirements

- Responsive: desktop ≥1280px, tablet 768–1279px, mobile ≤767px.
- Performance: LCP ≤ 2.5s on 4G; TTI ≤ 3.5s; CLS < 0.1.
- Uptime: 99.5% (restaurant page).
- Localization: Mongolian default; extensible.
- Accessibility: WCAG 2.1 AA for interactive elements.

1. UI Requirements (by Section)
   5.1 Header

- Logo (QPick), nav items: “Ойр байрлах байршил”, “Хадгалсан”, site search (dishes/restaurants).
- Profile/cart icons with counters and states (logged-in vs guest).
- Sticky on scroll.
  5.2 Hero
- Large primary photo + secondary thumbnails (carousel on mobile).
- Restaurant badge/favorite toggle.
- Safe area padding, rounded corners, soft shadow.
  5.3 Featured Items (Онцлох бүтээгдэхүүн)
- Horizontal cards (image, name, short blurb, price, + add-to-cart).
- Max 4–8 shown; lazy load if more.
  5.4 Menu Section (Меню)
- Tabs: Өглөөний цай, Өдрийн хоол, Пицца, Үндсэн хоол, Бялу, Шөл, Монгол хоол, Грил хоол (names managed in DB).
- In-section search input: filters current restaurant’s items.
- Grid cards (image, name, ingredients snippet, price, add-to-cart).
- Infinite scroll or “Load more”.
  5.5 Restaurant Info
- Name, star rating, review count.
- Address line, phone, email.
- Opening hours (today highlighted; show full week on expand).
- Map embed (pin centered on restaurant).
  5.6 Reviews (Сэтгэгдэл)
- Rate with stars; category tags: Үйлчилгээ, Орчин, Амт чанар.
- Text area, submit; show toast on success.
- List reviews (latest first), average rating.
  5.7 Footer
- Links: Products, Company, Terms, Careers, etc.
- Contact info and social (IG, FB, YouTube).
- Copyright line.

1. Functional Requirements
   6.1 Search

- Global header search: auto-suggest (restaurant, dish).
- In-restaurant search: filters items by name, tags, ingredients.
  6.2 Cart
- Add/remove/update quantity; show mini-cart in header.
- Persist for guests in localStorage; sync to server on login.
  6.3 Opening Hours
- Store by weekday with support for multiple intervals per day and special days (holidays/temporary changes).
- Display “Open now • closes at HH:MM” with timezone awareness.
  6.4 Reviews
- One review per order per dish optional (future), but at minimum: one review per user per restaurant (editable by user; soft-delete).
- Anti-spam: rate-limit 5/min IP + auth.
  6.5 Favorites
- Toggle save restaurant; list under “Хадгалсан”.

1. Data Model
   7.1 ERD (high-level)

User ───< FavoriteRestaurant >─── Restaurant ───< MenuCategory ───< MenuItem
│ │ └──< MenuItemImage
└──< Review >───────────────────────┘
Order ───< OrderItem >─── MenuItem
Restaurant ───< OpeningHour
Restaurant ───< SpecialOpening (exceptions/holidays)
7.2 Tables (core)
users

- id (UUID), email (unique), password_hash, name, phone, role (enum: customer, rest_admin, sys_admin), created_at
  restaurants
- id (UUID), name, slug, description, phone, email, address_line, city, lat, lng, hero_image_url, rating_avg (float), rating_count (int), is_active, created_at
  menu_categories
- id, restaurant_id (FK), name, slug, sort_order
  menu_items
- id, restaurant_id (FK), category_id (FK), name, slug, description, price_minor (int), currency (ISO), is_featured (bool), is_available (bool), image_url, calories (int nullable), tags (string[]), sort_order, created_at
  menu_item_images (optional)
- id, menu_item_id (FK), image_url, sort_order
  opening_hours (best practice)
- id, restaurant_id (FK), weekday (0=Mon..6=Sun), open_time (time), close_time (time), is_open (bool) \* Multiple rows per weekday allowed for split shifts.
  special_openings
- id, restaurant_id (FK), date (date), open_time (time), close_time (time), is_open (bool), note
  favorites
- id, user_id (FK), restaurant_id (FK), created_at (unique on pair)
  reviews
- id, user_id (FK), restaurant_id (FK), rating (1–5), tags (array: service, ambiance, taste), comment (text), created_at, updated_at, is_deleted
  orders (Phase 3)
- id, user_id (FK), restaurant_id (FK), status, total_minor, currency, created_at
  order_items
- id, order_id (FK), menu_item_id (FK), qty, unit_price_minor, line_total_minor
  search_index (optional)
- tsvector for restaurant/menu text search (Postgres)
  Indexes
- restaurants (slug), menu_items (restaurant_id, category_id, is_featured), GIST on search_index, geospatial index on (lat, lng) if using PostGIS.

8. API Contracts
   Base: /api/v1
   8.1 Restaurants

- GET /restaurants?near=lat,lng&radius_km=5&query=...
- GET /restaurants/:id
- GET /restaurants/:id/featured
- GET /restaurants/:id/menu?category=:slug&cursor=:id
- GET /restaurants/:id/opening-hours
- GET /restaurants/:id/special-openings?from=2025-01-01&to=2025-01-31
  8.2 Search
- GET /search?query=... → { restaurants: [...], items: [...] }
  8.3 Cart (authenticated; guest uses local storage)
- POST /cart/items { menu_item_id, qty }
- PATCH /cart/items/:id { qty }
- DELETE /cart/items/:id
- GET /cart
  8.4 Reviews
- GET /restaurants/:id/reviews?cursor=...
- POST /restaurants/:id/reviews { rating, tags[], comment }
- PATCH /reviews/:id (owner/admin)
- DELETE /reviews/:id (soft delete)
  8.5 Favorites
- POST /restaurants/:id/favorite
- DELETE /restaurants/:id/favorite
- GET /me/favorites
  8.6 Admin (Restaurant)
- POST /admin/restaurants/:id/menu-categories
- POST /admin/restaurants/:id/menu-items
- PATCH /admin/menu-items/:id
- PATCH /admin/opening-hours/:id
- POST /admin/special-openings
  Auth: JWT in Authorization: Bearer <token>; refresh via /auth/refresh. Errors: RFC7807 problem+json with type, title, status, detail, fields.

9. Permissions Matrix
   Action Guest Customer Rest Admin Sys Admin
   View restaurant/menu ✅ ✅ ✅ ✅
   Add to cart (server) ❌ ✅ ✅ ✅
   Post review ❌ ✅ ✅ ✅
   Favorite restaurant ❌ ✅ ✅ ✅
   Manage menu/hours ❌ ❌ ✅ ✅
   Moderate reviews ❌ ❌ ✅ ✅
10. Telemetry & Analytics

- Page views, tab clicks, search queries, add-to-cart, review submission.
- Funnel: view → add-to-cart → checkout init → payment success.
- Error events (API 4xx/5xx), slow endpoints (>500ms).

11. Accessibility & i18n

- Keyboard focus states; tab-order for cards and + buttons.
- Semantic HTML: <nav>, <header>, <main>, <section>, <footer>.
- Alt text for all images (fallback to dish name).
- Language files (mn, en) via JSON namespaces; prices formatted with locale.

12. Security & Compliance

- HTTPS everywhere; HSTS.
- JWT rotation; refresh token httpOnly cookie.
- Rate limits: auth 5/min IP, reviews 5/min, search 30/min.
- Input validation (Pydantic/DRF serializers + Zod on FE).
- Image upload verification (MIME, size).
- GDPR basics: delete account, export data (future).

13. Performance Targets

- API p95 < 300ms for reads, < 600ms for writes.
- Images: Next.js Image component, AVIF/WebP, responsive sizes.
- Caching: CDN for images; SWR caching for menu/featured; server-side caching for /restaurants/:id.
- Pagination: cursor-based for lists.
- DB: proper indices; read replicas (future).

14. Deployment & Environments

- Envs: dev, staging, prod.
- Infra: Docker, docker-compose (web, api, db, redis).
- Secrets: .env via Doppler/Vault/GitHub Secrets.
- Migrations: Django manage.py migrate CI step.
- CDN: Cloudflare for static/media.
  Key ENV Vars

NEXT_PUBLIC_API_URL=
JWT_SECRET=
DJANGO_SECRET_KEY=
DATABASE_URL=postgres://...
STORAGE_BUCKET=...
GOOGLE_MAPS_API_KEY=

15. Project Structure
    Frontend

/app
/(public)/restaurant/[slug]/page.tsx
/components/restaurant/
Hero.tsx
FeaturedList.tsx
MenuTabs.tsx
MenuCard.tsx
InfoPanel.tsx
Hours.tsx
Reviews.tsx
/lib/api.ts
/hooks/useCart.ts
/i18n/
Backend (Django)

/qpick
/restaurants (models, serializers, views, urls)
/menu
/reviews
/orders
/users
/admin

16. Milestones & Checklist
    M1 — Foundations (1–1.5 w)

- Repo setup (FE+BE, CI, lint, format)
- Auth (signup/login, JWT)
- Base models & migrations
- Seed data & image pipeline
  M2 — Restaurant Page (1.5–2 w)
- Hero + gallery
- Featured items section
- Menu tabs + grid + pagination
- In-restaurant search
- Add-to-cart (local + server sync when logged in)
  M3 — Info, Hours, Map (0.5–1 w)
- Address + contact panel
- Opening hours (today open/close logic)
- Map embed
  M4 — Reviews (0.5–1 w)
- Read + write reviews
- Stars, tags, moderation endpoints
- Average rating display
  M5 — Admin Essentials (1–1.5 w)
- CRUD: categories, items, hours, featured
- Upload images
- Review moderation
  M6 — Polish (0.5–1 w)
- Responsive QA & a11y pass
- i18n strings
- Performance tuning & analytics

17. Acceptance Criteria

- Viewing a restaurant loads hero, featured, menu tabs, and info within 2.5s (LCP) on 4G.
- Menu search filters items instantly (<150ms debounce + cached).
- “Open now / closes at …” matches stored hours & specials for current local day.
- Cart badge updates immediately after + click; persisted across refresh.
- Reviews can be created/edited/deleted by the author; average rating updates within 1 refresh.
- Admin can set featured items and change hours with immediate effect.

18. Future Work

- Delivery vs pickup selection, fee calculation.
- Coupons & promotions.
- Realtime order updates (WebSocket).
- Table reservations.
- Dietary filters (vegan, halal).
- PostGIS “near me” search & map clustering.
- AI search (“What’s spicy?”) using embeddings.

Appendix A — Opening Hours Logic (pseudo)

is_open(now, hours[], specials[]):

# specials override

if exists special for date(now):
return special.is_open and within(special.open_time, special.close_time, now)

wd = weekday(now) # 0..6
todays = [h for h in hours if h.weekday == wd and h.is_open]
return any(within(h.open_time, h.close_time, now) for h in todays)
