# CORS Setup untuk E-Report Web

## Overview

Dokumentasi ini menjelaskan konfigurasi CORS (Cross-Origin Resource Sharing) untuk aplikasi E-Report Web yang menghubungkan frontend Next.js dengan backend Golang.

## Konfigurasi CORS

### 1. Frontend (Next.js)

#### File Konfigurasi Utama

- `lib/config.ts` - Konfigurasi utama aplikasi
- `lib/api-config.ts` - Konfigurasi API dan CORS
- `middleware.ts` - Next.js middleware untuk CORS
- `next.config.ts` - Konfigurasi Next.js dengan CORS headers

#### Environment Variables

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8081
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_API_RETRIES=3

# CORS Configuration
NEXT_PUBLIC_CORS_ORIGINS=http://localhost:3000,http://localhost:3001
NEXT_PUBLIC_CORS_METHODS=GET,POST,PUT,DELETE,PATCH,OPTIONS
NEXT_PUBLIC_CORS_HEADERS=Content-Type,Authorization,X-Requested-With,Accept,Origin
NEXT_PUBLIC_CORS_CREDENTIALS=true
```

#### CORS Headers yang Dikonfigurasi

- `Access-Control-Allow-Origin`: Origin yang diizinkan
- `Access-Control-Allow-Methods`: HTTP methods yang diizinkan
- `Access-Control-Allow-Headers`: Headers yang diizinkan
- `Access-Control-Allow-Credentials`: Mengizinkan credentials
- `Access-Control-Max-Age`: Cache preflight requests

### 2. Backend (Golang)

#### File Konfigurasi Utama

- `internal/middleware/cors.go` - CORS middleware untuk Golang
- `main.go` - Konfigurasi CORS di router utama

#### Environment Variables

```bash
# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001
CORS_METHODS=GET,POST,PUT,DELETE,PATCH,OPTIONS
CORS_HEADERS=Origin,Content-Type,Accept,Authorization,X-Requested-With
CORS_CREDENTIALS=true
CORS_MAX_AGE=86400
```

#### CORS Middleware

Menggunakan `github.com/gin-contrib/cors` untuk menangani CORS dengan konfigurasi:

- **AllowOrigins**: Array origin yang diizinkan
- **AllowMethods**: Array HTTP methods yang diizinkan
- **AllowHeaders**: Array headers yang diizinkan
- **ExposeHeaders**: Array headers yang diekspos ke client
- **AllowCredentials**: Mengizinkan credentials
- **MaxAge**: Cache preflight requests (24 jam)

## URL Konfigurasi

### API Base URL

- **Development**: `http://localhost:8081`
- **Production**: `https://yourdomain.com`

### Endpoints yang Dikonfigurasi

```typescript
ENDPOINTS: {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    PROFILE: '/api/auth/profile'
  },
  REPORTS: {
    LIST: '/api/reports',
    CREATE: '/api/reports',
    UPDATE: '/api/reports',
    DELETE: '/api/reports',
    BY_ID: (id: string) => `/api/reports/${id}`,
    MY_REPORTS: '/api/reports/my'
  },
  // ... endpoints lainnya
}
```

## Cara Menggunakan

### 1. Setup Environment Variables

```bash
# Frontend
cp env.example .env.local

# Backend
cp env.example .env
```

### 2. Install Dependencies

```bash
# Frontend
npm install

# Backend
go mod tidy
```

### 3. Start Development Servers

```bash
# Frontend (port 3000)
npm run dev

# Backend (port 8081)
go run main.go
```

### 4. Test CORS

```bash
# Test preflight request
curl -X OPTIONS \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  http://localhost:8081/api/auth/login

# Test actual request
curl -X POST \
  -H "Origin: http://localhost:3000" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  http://localhost:8081/api/auth/login
```

## Troubleshooting

### 1. CORS Error: Origin not allowed

**Solusi**: Pastikan origin frontend ada di `CORS_ORIGINS` di backend

### 2. CORS Error: Method not allowed

**Solusi**: Pastikan HTTP method ada di `CORS_METHODS` di backend

### 3. CORS Error: Headers not allowed

**Solusi**: Pastikan headers ada di `CORS_HEADERS` di backend

### 4. CORS Error: Credentials not allowed

**Solusi**: Pastikan `CORS_CREDENTIALS=true` di backend

### 5. CORS Error: Preflight request failed

**Solusi**: Pastikan backend menangani OPTIONS request dengan benar

## Security Considerations

### 1. Origin Validation

- Selalu validasi origin di backend
- Jangan gunakan wildcard (\*) di production
- Gunakan HTTPS di production

### 2. Credentials

- Hanya izinkan credentials jika diperlukan
- Pastikan origin terpercaya

### 3. Headers

- Hanya izinkan headers yang diperlukan
- Validasi headers di backend

## Monitoring

### 1. CORS Logs

```bash
# Backend logs
tail -f logs/app.log | grep CORS

# Frontend logs
# Check browser console for CORS errors
```

### 2. Network Tab

- Buka browser DevTools
- Lihat Network tab
- Periksa preflight requests (OPTIONS)
- Periksa response headers

## Production Deployment

### 1. Environment Variables

```bash
# Production CORS
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
CORS_CREDENTIALS=true
CORS_MAX_AGE=86400
```

### 2. Nginx Configuration

```nginx
location /api/ {
    add_header 'Access-Control-Allow-Origin' 'https://yourdomain.com';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
    add_header 'Access-Control-Allow-Headers' 'Origin, Content-Type, Accept, Authorization, X-Requested-With';
    add_header 'Access-Control-Allow-Credentials' 'true';

    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Max-Age' 86400;
        add_header 'Content-Type' 'text/plain charset=UTF-8';
        add_header 'Content-Length' 0;
        return 204;
    }
}
```

## Referensi

- [MDN CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Next.js CORS](https://nextjs.org/docs/api-routes/api-middlewares)
- [Gin CORS Middleware](https://github.com/gin-contrib/cors)
- [CORS Best Practices](https://web.dev/cross-origin-resource-sharing/)
