export interface User {
  id: string
  username: string
  name: string
  role: 'admin' | 'ketua_kelas' | 'staff' | 'kepala_bagian'
  email?: string
  phone?: string
  createdAt: string
  updatedAt: string
}

export interface Report {
  id: string
  userId: string
  user: User
  kelas: string
  shift: string
  ruangan: string
  jenis: 'kebutuhan' | 'kendala'
  kategori: string
  deskripsi: string
  foto?: string // filename or URL
  fotoMetadata?: FileMetadata
  status: 'menunggu' | 'diproses' | 'selesai'
  catatan?: string
  createdAt: string
  updatedAt: string
}

export interface ImageMetadata {
  size: number
  type: string
  width?: number
  height?: number
  originalName?: string
}

export interface FileMetadata {
  filename: string
  url: string
  uploadedAt: string
  size?: number
  type?: string
}

export interface MasterData {
  id: string
  name: string
  type: 'kelas' | 'shift' | 'ruangan' | 'kategori'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  totalReports: number
  pendingReports: number
  processedReports: number
  completedReports: number
  reportsByCategory: Array<{
    category: string
    count: number
  }>
  reportsByMonth: Array<{
    month: string
    count: number
  }>
  recentReports: Report[]
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface CreateReportData {
  kelas: string
  shift: string
  ruangan: string
  jenis: 'kebutuhan' | 'kendala'
  kategori: string
  deskripsi: string
  foto?: string // filename or URL
  fotoMetadata?: FileMetadata
}

export interface UpdateReportData {
  status: 'menunggu' | 'diproses' | 'selesai'
  catatan?: string
}
