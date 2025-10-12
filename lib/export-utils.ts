import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: Record<string, unknown>) => jsPDF
  }
}

interface ExportData {
  [key: string]: unknown
}


// PDF Export
export async function exportToPDF(
  data: ExportData[], 
  type: string, 
  filename: string
): Promise<void> {
  const doc = new jsPDF('portrait', 'mm', 'a4')
  
  // Add title
  doc.setFontSize(20)
  doc.text(getTitle(type), 20, 20)
  
  // Add date
  doc.setFontSize(10)
  doc.text(`Dibuat pada: ${new Date().toLocaleDateString('id-ID')}`, 20, 30)
  
  // Add data table
  const tableData = prepareTableData(data, type)
  const columns = getTableColumns(type, data)
  
  doc.autoTable({
    head: [columns.map(col => col.header)],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [59, 130, 246], // Blue color
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251], // Light gray
    },
    columnStyles: getColumnStyles(type),
    margin: { left: 20, right: 20 },
  })
  
  // Add footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.text(
      `Halaman ${i} dari ${pageCount}`,
      doc.internal.pageSize.width - 40,
      doc.internal.pageSize.height - 10
    )
  }
  
  // Save file
  doc.save(`${filename}.pdf`)
}

// Excel Export
export async function exportToExcel(
  data: ExportData[], 
  type: string, 
  filename: string
): Promise<void> {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  
  // Add worksheet
  XLSX.utils.book_append_sheet(workbook, worksheet, getSheetName(type))
  
  // Add metadata
  workbook.Props = {
    Title: getTitle(type),
    Subject: `Export ${type}`,
    Author: 'E-Report System',
    CreatedDate: new Date()
  }
  
  // Save file
  XLSX.writeFile(workbook, `${filename}.xlsx`)
}

// CSV Export
export async function exportToCSV(
  data: ExportData[], 
  type: string, 
  filename: string
): Promise<void> {
  if (data.length === 0) return
  
  const columns = getTableColumns(type, data)
  const csvContent = [
    // Header
    columns.map(col => col.header).join(','),
    // Data rows
    ...data.map(row => 
      columns.map(col => {
        const value = row[col.key] || ''
        // Escape commas and quotes
        return `"${String(value).replace(/"/g, '""')}"`
      }).join(',')
    )
  ].join('\n')
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Print Report
export async function printReport(
  data: ExportData[], 
  type: string
): Promise<void> {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return
  
  const columns = getTableColumns(type, data)
  const tableData = prepareTableData(data, type)
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${getTitle(type)}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #3B82F6;
          padding-bottom: 20px;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          color: #1F2937;
          margin-bottom: 10px;
        }
        .subtitle {
          font-size: 14px;
          color: #6B7280;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #D1D5DB;
          padding: 8px 12px;
          text-align: left;
        }
        th {
          background-color: #3B82F6;
          color: white;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #F9FAFB;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #6B7280;
          border-top: 1px solid #E5E7EB;
          padding-top: 20px;
        }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">${getTitle(type)}</div>
        <div class="subtitle">Dibuat pada: ${new Date().toLocaleDateString('id-ID')}</div>
      </div>
      
      <table>
        <thead>
          <tr>
            ${columns.map(col => `<th>${col.header}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${tableData.map(row => 
            `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
          ).join('')}
        </tbody>
      </table>
      
      <div class="footer">
        <p>Dokumen ini dibuat oleh E-Report System</p>
        <p>Total data: ${data.length} item</p>
      </div>
    </body>
    </html>
  `
  
  printWindow.document.write(html)
  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
  printWindow.close()
}

// Helper functions
function getTitle(type: string): string {
  switch (type) {
    case 'reports':
      return 'Laporan Kendala Pembelajaran'
    case 'dashboard':
      return 'Dashboard Statistik'
    case 'users':
      return 'Data Pengguna'
    case 'master-data':
      return 'Data Master'
    default:
      return 'Export Data'
  }
}

function getSheetName(type: string): string {
  switch (type) {
    case 'reports':
      return 'Laporan'
    case 'dashboard':
      return 'Dashboard'
    case 'users':
      return 'Pengguna'
    case 'master-data':
      return 'Master Data'
    default:
      return 'Data'
  }
}

function getTableColumns(type: string, data?: ExportData[]) {
  switch (type) {
    case 'reports':
      return [
        { key: 'id', header: 'ID Laporan' },
        { key: 'user_name', header: 'Pelapor' },
        { key: 'kelas', header: 'Kelas' },
        { key: 'shift', header: 'Shift' },
        { key: 'ruangan', header: 'Ruangan' },
        { key: 'jenis', header: 'Jenis' },
        { key: 'kategori', header: 'Kategori' },
        { key: 'status', header: 'Status' },
        { key: 'deskripsi', header: 'Deskripsi' },
        { key: 'created_at', header: 'Tanggal Dibuat' }
      ]
    case 'users':
      return [
        { key: 'id', header: 'ID' },
        { key: 'username', header: 'Username' },
        { key: 'name', header: 'Nama' },
        { key: 'email', header: 'Email' },
        { key: 'role', header: 'Role' },
        { key: 'created_at', header: 'Tanggal Dibuat' }
      ]
    case 'master-data':
      return [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Nama' },
        { key: 'type', header: 'Tipe' },
        { key: 'description', header: 'Deskripsi' },
        { key: 'created_at', header: 'Tanggal Dibuat' }
      ]
    default:
      return Object.keys(data?.[0] || {}).map(key => ({
        key,
        header: key.charAt(0).toUpperCase() + key.slice(1)
      }))
  }
}

function prepareTableData(data: ExportData[], type: string): string[][] {
  const columns = getTableColumns(type, data)
  
  return data.map(row => 
    columns.map(col => {
      const value = row[col.key]
      if (value === null || value === undefined) return ''
      
      // Format dates
      if (col.key.includes('_at') || col.key.includes('date')) {
        return new Date(value as string | number | Date).toLocaleDateString('id-ID')
      }
      
      // Format status
      if (col.key === 'status') {
        const statusMap: { [key: string]: string } = {
          'menunggu': 'Menunggu',
          'diproses': 'Diproses',
          'selesai': 'Selesai'
        }
        return statusMap[value as string] || value
      }
      
      // Format role
      if (col.key === 'role') {
        const roleMap: { [key: string]: string } = {
          'admin': 'Admin',
          'ketua_kelas': 'Ketua Kelas',
          'staff': 'Staff',
          'kepala_bagian': 'Kepala Bagian'
        }
        return roleMap[value as string] || value
      }
      
      return String(value)
    })
  ) as string[][]
}

function getColumnStyles(type: string) {
  const baseStyles = {
    fontSize: 8,
    cellPadding: 3,
  }
  
  switch (type) {
    case 'reports':
      return {
        0: { cellWidth: 20 }, // ID
        1: { cellWidth: 25 }, // User Name
        2: { cellWidth: 15 }, // Kelas
        3: { cellWidth: 15 }, // Shift
        4: { cellWidth: 15 }, // Ruangan
        5: { cellWidth: 15 }, // Jenis
        6: { cellWidth: 20 }, // Kategori
        7: { cellWidth: 15 }, // Status
        8: { cellWidth: 40 }, // Deskripsi
        9: { cellWidth: 20 }, // Created At
      }
    default:
      return baseStyles
  }
}
