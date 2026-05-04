# Progress FoodMart Admin

Dokumentasi progress per session pengerjaan project.

---

## Session 13 — Project Setup & Auth
**Status:** ✅ Done

### Yang dikerjakan
- [x] Setup Vite + React + TypeScript
- [x] Install & konfigurasi dependencies
- [x] Setup shadcn/ui + Tailwind CSS
- [x] Axios instance + interceptor refresh token
- [x] Zustand auth store
- [x] React Router v6 + PrivateRoute + PublicRoute
- [x] AuthLayout + AdminLayout
- [x] LoginPage (React Hook Form + Zod)
- [x] useAuth hook — inisialisasi auth saat app load
- [x] DashboardPage placeholder
- [x] Setup alias @ di vite.config.ts

### Fix yang dilakukan
- `import type` untuk semua type-only imports (verbatimModuleSyntax)
- Zod v4 syntax: `z.email()` bukan `z.string().email()`
- `form.tsx` dibuat manual (dihapus dari shadcn v4 registry)
- CORS backend ditambah `credentials: true`
- `toast` diganti `sonner`
- `error: any` diganti `AxiosError` + `unknown`
- `isLoading` manual diganti `isSubmitting` dari RHF
- `PublicRoute` & `PrivateRoute` dipisah ke `router/guards.tsx` (Vite Fast Refresh)
- Loop fix — `useAuth` tidak panggil `getMe()` tanpa token

### Keputusan teknis
- Access token disimpan di memory (Zustand), bukan localStorage — hindari XSS
- Refresh token di httpOnly cookie — ditangani otomatis browser
- Refresh token rotation — token lama `isUsed: true` setiap refresh
- `useAuth` dipanggil sebelum router render — hindari redirect prematur ke /login
- `window.location.href` untuk logout paksa di interceptor menyebabkan looping di halaman login, jadi akhirnya dihapus

### Catatan untuk Session 17
- Implementasi access token blacklist via Upstash Redis di backend
- Saat logout → simpan accessToken ke Redis dengan TTL sama dengan token
- Setiap request → cek blacklist sebelum proses

---

## Session 14 — Categories Management
**Status:** ⏳ Planned

### Yang akan dikerjakan
- [ ] CRUD Categories
- [ ] Tabel data dengan TanStack Query
- [ ] Form tambah & edit category (Dialog)
- [ ] Konfirmasi hapus (AlertDialog)
- [ ] Invalidate cache setelah mutasi

---

## Session 15 — Foods Management
**Status:** ⏳ Planned

### Yang akan dikerjakan
- [ ] CRUD Foods
- [ ] Upload gambar ke Supabase Storage via API
- [ ] Filter by category
- [ ] Toggle isAvailable

---

## Session 16 — Orders Management
**Status:** ⏳ Planned

### Yang akan dikerjakan
- [ ] List semua orders (admin)
- [ ] Detail order
- [ ] Update status order (PENDING → PROCESSING → COMPLETED / CANCELLED)

---

## Session 17 — Polish & DX
**Status:** ⏳ Planned

### Yang akan dikerjakan
- [ ] Global error handling
- [ ] Toast notifikasi (success & error)
- [ ] Loading skeleton
- [ ] Empty state
- [ ] Proteksi route final
- [ ] UX finishing