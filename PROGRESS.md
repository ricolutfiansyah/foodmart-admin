
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
**Status:** ✅ Done

### Yang dikerjakan
- [x] CRUD Categories (Create, Read, Update, Delete)
- [x] Tabel data dengan TanStack Query (`useCategories`, `useCategory`, `useCreateCategory`, `useUpdateCategory`, `useDeleteCategory`)
- [x] Form tambah & edit category (`CategoryFormDialog` — shared component, RHF + Zod)
- [x] Konfirmasi hapus (`DeleteCategoryDialog` — AlertDialog + Tooltip disable)
- [x] Invalidate cache setelah mutasi (`queryClient.invalidateQueries`)
- [x] Toast notifikasi success/error via Sonner
- [x] Loading spinner di submit button (`isPending` + `Loader2`)
- [x] Disable delete button kalau category punya produk (`_count.foods > 0`)
- [x] Route `/categories` protected by `PrivateRoute`
- [x] Sidebar navigation item "Kategori"

### Files Created
- `src/types/category.ts`
- `src/api/categories.ts`
- `src/hooks/useCategories.ts`
- `src/pages/categories/CategoriesPage.tsx`
- `src/pages/categories/CategoryFormDialog.tsx`
- `src/pages/categories/DeleteCategoryDialog.tsx`

### Files Modified
- `src/router/index.tsx` — add `/categories` route
- `src/layouts/AdminLayout.tsx` — add sidebar nav item

### Keputusan teknis
- Error handling di hook (`onError` dengan toast), success handling di komponen (`onSuccess` dengan toast + UI state)
- `form.reset()` di `useEffect` saat dialog buka, tidak perlu di `onSuccess`
- `exact: false` TIDAK dipakai — pakai invalidate exact match untuk kontrol granular
- Tooltip untuk disabled button menggunakan wrapper `span` dengan `tabIndex={0}`
- `onOpenChange` dicegah saat `isPending` untuk UX yang lebih baik

---

## Session 15 — Foods Management
**Status:** ✅ Done

### Yang dikerjakan
- [x] CRUD Foods (Create, Read, Update, Delete)
- [x] Upload gambar ke Supabase Storage via API (multipart/form-data)
- [x] Filter by category (dropdown)
- [x] Search by name (debounce)
- [x] Toggle isAvailable (inline switch)
- [x] Form validation dengan field-specific error (Zod + RHF)
- [x] Cache invalidation setelah mutasi
- [x] Toast notifikasi success/error via Sonner
- [x] Loading spinner di submit button
- [x] Route `/foods` protected by `PrivateRoute`
- [x] Sidebar navigation item "Makanan"

### Files Created
- `src/types/food.ts`
- `src/api/foods.ts`
- `src/hooks/useFoods.ts`
- `src/pages/foods/FoodsPage.tsx`
- `src/pages/foods/FoodFormDialog.tsx`
- `src/pages/foods/DeleteFoodDialog.tsx`

### Files Modified
- `src/router/index.tsx` — add `/foods` route
- `src/layouts/AdminLayout.tsx` — add sidebar nav item "Makanan"

### Keputusan teknis
- Upload gambar via `multipart/form-data` dengan field name `image`
- Toggle isAvailable pakai trik `data.isAvailable ? 'true' : ''` karena `z.coerce.boolean()` treats `"false"` string as truthy
- Error handling: hook untuk global toast, komponen untuk field-specific errors
- Cache invalidation dengan prefix match `['foods']`

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
- [ ] Optimistic update untuk delete (Categories & Foods)