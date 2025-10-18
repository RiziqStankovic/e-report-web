# Production Setup Guide

## Environment Variables

Untuk production, pastikan environment variables berikut dikonfigurasi dengan benar:

### Required Environment Variables

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://be-ereport.cloudfren.id/api

# CORS Configuration
NEXT_PUBLIC_CORS_ORIGINS=https://e-report.cloudfren.id,http://e-report.cloudfren.id
```

### Build Commands

```bash
# Build untuk production
npm run build

# Start production server
npm start
```

## Masalah yang Sudah Diperbaiki

### 1. Localhost URLs di Production

- **Masalah**: Kode masih menggunakan `http://localhost:8081` sebagai fallback URL
- **Solusi**: Menggunakan conditional logic berdasarkan `NODE_ENV`
  - Development: `http://localhost:8081`
  - Production: `https://be-ereport.cloudfren.id`

### 2. File Upload URLs

- **Masalah**: URL untuk file upload dan preview masih menggunakan localhost
- **Solusi**: Diperbaiki di:
  - `lib/api.ts` - fungsi `getFileUrl`
  - `components/ui/FileUpload.tsx` - komponen `FileImage`
  - `pages/reports/[id].tsx` - image preview modal

### 3. Dashboard Statistics API

- **Fitur Baru**: Dashboard sekarang menggunakan real-time statistics dari backend
- **Komponen**:
  - `hooks/useDashboardStats.ts` - custom hook untuk fetch data
  - `pages/dashboard.tsx` - halaman dashboard dengan real data
  - `components/dashboard/StatsCards.tsx` - komponen statistik dengan loading states

## Testing

### Local Development

```bash
# Backend
cd e-report-be
go run main.go

# Frontend
cd e-report-web
npm run dev
```

### Production

```bash
# Build frontend
cd e-report-web
npm run build

# Deploy ke server
# Pastikan environment variables sudah dikonfigurasi
```

## Troubleshooting

### Upload Gagal di Production

1. Pastikan `NEXT_PUBLIC_API_URL` sudah dikonfigurasi dengan benar
2. Pastikan backend server berjalan di `https://be-ereport.cloudfren.id`
3. Periksa CORS configuration di backend

### Image Preview Tidak Muncul

1. Pastikan file sudah ter-upload dengan benar
2. Periksa URL yang di-generate di browser console
3. Pastikan static file serving di backend berfungsi

### Dashboard Statistics Tidak Muncul

1. Pastikan API endpoint `/api/dashboard/stats` dapat diakses
2. Periksa authentication token
3. Periksa network requests di browser dev tools
