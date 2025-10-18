# E-Report System

Sistem Laporan Kendala Pembelajaran berbasis web yang memungkinkan Ketua Kelas untuk melaporkan kendala dan Staff/Kepala Bagian untuk menangani laporan tersebut.

## 🚀 Fitur Utama

### ✅ Fitur yang Sudah Diimplementasi

- **Sistem Autentikasi & Role-Based Access**

  - Login dengan role: Admin, Ketua Kelas, Staff, Kepala Bagian
  - JWT token authentication
  - Protected routes berdasarkan role

- **Dashboard Interaktif**

  - Statistik laporan real-time
  - Grafik interaktif (Bar, Pie, Line, Area charts)
  - Quick actions berdasarkan role
  - Notifikasi real-time

- **Manajemen Laporan**

  - Buat laporan (Ketua Kelas)
  - Lihat semua laporan (Staff/Kepala Bagian)
  - Update status laporan
  - Filter dan pencarian advanced
  - Upload dan preview foto
  - Sistem komentar pada laporan

- **Notifikasi & Komunikasi**

  - Notifikasi real-time dengan WebSocket
  - Notifikasi WhatsApp dengan template
  - Email notifications (ready)
  - Push notifications (ready)

- **Export & Reporting**

  - Export ke PDF, Excel, CSV
  - Print reports
  - Bulk export
  - Custom templates

- **Mobile Responsive**

  - Mobile-first design
  - Touch-friendly interface
  - Mobile test suite
  - PWA ready

- **Admin Panel**
  - Kelola data master
  - Kelola pengguna
  - Monitoring sistem
  - Backup & restore

## 🛠️ Teknologi yang Digunakan

### Frontend

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Heroicons** - Icons
- **Recharts** - Charts
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **jsPDF** - PDF generation
- **XLSX** - Excel export

### Backend

- **Golang** - Backend language
- **Gin Gonic** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin requests

### Development

- **Docker** - Containerization
- **Docker Compose** - Multi-container setup
- **Jest** - Testing
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📱 Mobile Features

- **Mobile-First Design**

  - Responsive layout untuk semua device
  - Touch-friendly interface
  - Swipe gestures
  - Mobile navigation

- **Mobile Test Suite**

  - Viewport testing
  - Touch target validation
  - Performance monitoring
  - Accessibility checks

- **PWA Ready**
  - Service worker
  - Offline support
  - App-like experience
  - Push notifications

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Go 1.21+
- PostgreSQL 15+
- Docker (optional)

### Installation

1. **Clone repository**

```bash
git clone <repository-url>
cd e-report-web
```

2. **Install dependencies**

```bash
npm install
cd ../e-report-be && go mod tidy
```

3. **Setup environment**

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Start development**

```bash
# Start frontend
npm run dev

# Start backend (in another terminal)
cd ../e-report-be
go run main.go

# Or use Docker
docker-compose up -d
```

5. **Access application**

- Frontend: http://e-report.cloudfren.id
- Backend: http://be-report.cloudfren.id
- Database: localhost:5432

### Default Credentials

| Role          | Username | Password |
| ------------- | -------- | -------- |
| Admin         | admin    | admin123 |
| Ketua Kelas   | ketua    | ketua123 |
| Staff         | staff    | staff123 |
| Kepala Bagian | kabag    | kabag123 |

## 📁 Struktur Project

```
e-report-web/
├── components/          # React components
│   ├── ui/             # UI components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components
│   ├── reports/        # Report components
│   ├── notifications/  # Notification components
│   └── export/         # Export components
├── pages/              # Next.js pages
│   ├── mobile/         # Mobile-specific pages
│   └── api/            # API routes
├── lib/                # Utility libraries
├── hooks/              # Custom React hooks
├── contexts/           # React contexts
├── types/              # TypeScript types
├── styles/             # CSS styles
└── scripts/            # Build scripts
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript check

# Testing
npm run test            # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage

# Database
npm run db:migrate      # Run database migrations
npm run db:seed         # Seed database
npm run db:reset        # Reset database

# Docker
npm run docker:up       # Start with Docker
npm run docker:down     # Stop Docker containers
npm run docker:logs     # View Docker logs
```

### Mobile Development

```bash
# Test mobile responsiveness
npm run test:mobile

# Build for mobile
npm run build:mobile

# Start mobile development
npm run dev:mobile
```

## 📊 Features Overview

### Dashboard

- **Real-time Statistics**

  - Total laporan
  - Laporan per status
  - Laporan per kategori
  - Laporan per bulan

- **Interactive Charts**

  - Bar charts
  - Pie charts
  - Line charts
  - Area charts
  - Scatter plots

- **Quick Actions**
  - Buat laporan baru
  - Lihat laporan
  - Kelola pengguna
  - Export data

### Reports Management

- **Create Report**

  - Form input dengan validasi
  - Upload foto
  - Pilih kategori
  - Deskripsi detail

- **View Reports**

  - List view dengan pagination
  - Card view untuk mobile
  - Filter dan search
  - Sort by date/status

- **Report Details**
  - Detail lengkap laporan
  - Foto preview
  - Status update
  - Komentar system

### Notifications

- **Real-time Notifications**

  - WebSocket connection
  - Toast notifications
  - Badge counters
  - Sound alerts

- **WhatsApp Integration**
  - Template messages
  - Bulk sending
  - Status tracking
  - Custom messages

### Export & Reporting

- **PDF Export**

  - Custom templates
  - Charts inclusion
  - Professional layout
  - Print-ready

- **Excel Export**

  - Data tables
  - Charts
  - Multiple sheets
  - Formulas

- **CSV Export**
  - Raw data
  - Import ready
  - Custom delimiters
  - UTF-8 encoding

## 🔒 Security

- **Authentication**

  - JWT tokens
  - Role-based access
  - Session management
  - Password hashing

- **Data Protection**

  - Input validation
  - SQL injection prevention
  - XSS protection
  - CSRF protection

- **File Upload**
  - File type validation
  - Size limits
  - Virus scanning
  - Secure storage

## 📱 Mobile Optimization

- **Performance**

  - Lazy loading
  - Image optimization
  - Code splitting
  - Caching strategies

- **User Experience**

  - Touch gestures
  - Swipe navigation
  - Pull to refresh
  - Infinite scroll

- **Accessibility**
  - Screen reader support
  - Keyboard navigation
  - High contrast mode
  - Font scaling

## 🧪 Testing

### Test Coverage

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: API endpoints
- **E2E Tests**: Critical user flows
- **Mobile Tests**: Responsive design

### Test Commands

```bash
npm run test            # Run all tests
npm run test:unit       # Unit tests only
npm run test:integration # Integration tests
npm run test:e2e        # End-to-end tests
npm run test:mobile     # Mobile tests
```

## 🚀 Deployment

### Production Build

```bash
npm run build:full      # Build frontend + backend
npm run start:full      # Start production
```

### Docker Deployment

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables

```bash
# Frontend
NEXT_PUBLIC_API_URL=http://be-report.cloudfren.id
NEXT_PUBLIC_CORS_ORIGINS=http://e-report.cloudfren.id

# Backend
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=e_report
JWT_SECRET=your-secret-key
```

## 📈 Performance

### Optimization

- **Code Splitting**: Lazy load components
- **Image Optimization**: WebP format, lazy loading
- **Caching**: Redis for session storage
- **CDN**: Static assets delivery
- **Compression**: Gzip compression

### Monitoring

- **Performance Metrics**: Core Web Vitals
- **Error Tracking**: Sentry integration
- **Analytics**: Google Analytics
- **Uptime**: Health checks

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:

- Email: support@e-report.com
- Documentation: [docs.e-report.com](https://docs.e-report.com)
- Issues: [GitHub Issues](https://github.com/e-report/issues)

---

**E-Report System** - Sistem Laporan Kendala Pembelajaran yang Modern dan Efisien 🚀
