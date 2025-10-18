# CORS Fix untuk E-Report Web

## Masalah

Frontend tidak bisa mengakses backend karena CORS policy error:

```
Access to XMLHttpRequest at 'https://be-report.cloudfren.id/api/auth/login' from origin 'http://localhost:3000' has been blocked by CORS policy
```

## Solusi yang Diterapkan

### 1. Proxy API di Next.js

Dibuat file `pages/api/proxy/[...path].ts` yang berfungsi sebagai proxy untuk mengakses backend tanpa masalah CORS.

### 2. Konfigurasi API Base URL

Di `lib/api.ts`, API base URL dikonfigurasi untuk:

- **Development**: Menggunakan proxy `/api/proxy`
- **Production**: Menggunakan URL langsung `https://be-report.cloudfren.id/api`

### 3. Environment Variables

Pastikan tidak ada `NEXT_PUBLIC_API_URL` yang di-set di environment variables untuk development.

## Cara Menggunakan

### Development

1. Pastikan tidak ada file `.env.local` yang mengoverride `NEXT_PUBLIC_API_URL`
2. Restart development server: `npm run dev`
3. API calls akan otomatis menggunakan proxy

### Production

1. Set `NEXT_PUBLIC_API_URL=https://be-report.cloudfren.id/api` di environment variables
2. Deploy aplikasi

## Debugging

### Cek API Base URL

Buka browser console dan lihat log:

```
API_BASE_URL: /api/proxy isDevelopment: true
```

### Cek Request URL

Di Network tab, request seharusnya mengarah ke:

- Development: `http://localhost:3000/api/proxy/auth/login`
- Production: `https://be-report.cloudfren.id/api/auth/login`

## Troubleshooting

### Jika masih error CORS:

1. Pastikan tidak ada `NEXT_PUBLIC_API_URL` di environment
2. Restart development server
3. Clear browser cache
4. Cek console untuk log API_BASE_URL

### Jika proxy tidak bekerja:

1. Cek file `pages/api/proxy/[...path].ts` ada
2. Cek Next.js server logs
3. Pastikan backend URL benar di proxy file
