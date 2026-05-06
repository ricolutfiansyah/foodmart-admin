# Architecture — FoodMart Admin

## Struktur Folder

\`\`\`
src/
├── api/
│   ├── axiosInstance.ts
│   ├── auth.ts
│   ├── categories.ts
│   ├── foods.ts
│   └── orders.ts
├── components/
│   ├── ui/               # shadcn/ui (auto-generated)
│   └── shared/           # ✅ TAMBAH: reusable components
│       ├── DataTable.tsx
│       ├── FormDialog.tsx
│       └── ConfirmDialog.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useApiError.ts    # ✅ TAMBAH: error handling hook
├── layouts/
│   ├── AdminLayout.tsx
│   └── AuthLayout.tsx
├── lib/
│   ├── utils.ts
│   └── queryOptions.ts   # ✅ TAMBAH: TanStack Query factories
├── pages/
│   ├── auth/
│   ├── dashboard/
│   ├── categories/
│   ├── foods/
│   └── orders/
├── router/
│   ├── index.tsx
│   └── guards.tsx        # ✅ TAMBAH: dipisah dari index.tsx
├── stores/
│   └── authStore.ts
├── types/
│   ├── api.ts            # shared response types
│   ├── auth.ts           # ✅ TAMBAH: auth-specific
│   ├── category.ts       # ✅ TAMBAH: category-specific
│   └── food.ts           # ✅ TAMBAH: food-specific
└── main.tsx
\`\`\`

## Auth Strategy

### Kenapa access token di memory (Zustand)?
localStorage rentan XSS — script jahat bisa baca token.
Memory (Zustand) tidak persist tapi jauh lebih aman.

### Kenapa refresh token di httpOnly cookie?
Cookie httpOnly tidak bisa diakses JavaScript sama sekali.
Browser otomatis kirim cookie ke backend saat request.
Backend yang handle validasi & rotasi token.

### Flow lengkap
\`\`\`
App load
  → useAuth() panggil GET /me
  → Berhasil: setAuth(token, user) → render app
  → Gagal: state null → router redirect ke /login

Login
  → POST /auth/login
  → Response: { accessToken, user }
  → Cookie: refresh token (httpOnly, di-set backend)
  → setAuth(accessToken, user)
  → navigate ke /dashboard

Request API
  → Axios request interceptor tambahkan Authorization header
  → Response 401
    → Hit POST /auth/refresh (cookie ikut otomatis)
    → Berhasil: update token, retry request original
    → Gagal: logout() + redirect /login

Logout
  → POST /auth/logout (hapus cookie di backend)
  → Clear Zustand state
  → Redirect ke /login
\`\`\`

## State Management

| State | Tool | Alasan |
|---|---|---|
| Auth (token, user) | Zustand | Global, perlu diakses di interceptor & komponen |
| Server data (categories, foods, orders) | TanStack Query | Caching, refetch, loading/error state otomatis |
| Form state | React Hook Form | Performa, validasi terintegrasi Zod |
| UI state (modal open, dll) | useState lokal | Tidak perlu global |

## API Response Format

Semua response dari backend mengikuti format:

\`\`\`ts
{
  success: boolean
  message: string
  data: T
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
\`\`\`

## Konvensi Kode

- File: PascalCase untuk komponen (`LoginPage.tsx`), camelCase untuk yang lain (`authStore.ts`)
- Import path: alias `@/` → `src/`
- Hindari `any` — gunakan proper types atau `unknown`
- Semua API call lewat `axiosInstance`, bukan `fetch` native