# Slip Gaji Generator

Slip Gaji Generator adalah aplikasi web untuk membuat slip gaji dengan cepat, rapi, dan siap export ke PDF. Aplikasi ini dibuat untuk mempermudah proses input data karyawan, komponen pendapatan, potongan, hingga menghasilkan tampilan slip gaji yang siap dibagikan.

## Preview

Aplikasi ini menyediakan:
- Form input data slip gaji
- Preview layout slip gaji
- Export hasil menjadi PDF
- Upload dan pengaturan posisi logo perusahaan

## Features

- Input data perusahaan dan periode gaji
- Input data karyawan
- Pilihan status PTKP
- Input komponen pendapatan
- Input komponen potongan
- Tambah item custom pada bagian pendapatan dan potongan
- Hapus item custom yang sudah ditambahkan
- Auto-fill bagian `Diterima Oleh` berdasarkan nama dan jabatan karyawan
- Upload logo perusahaan
- Atur zoom dan posisi horizontal logo
- Export slip gaji ke format PDF
- Tampilan form tetap konsisten di desktop dan mobile
- Layout hasil PDF yang sudah dirapikan untuk kebutuhan cetak

## Tech Stack

Project ini dibangun menggunakan:

- React
- Vite
- Tailwind CSS
- html2canvas
- jsPDF

## Installation

Clone repository ini lalu install dependencies:

```bash
git clone https://github.com/dannesluthfiyah/slipgajigenerator.git
cd slipgajigenerator
npm install
```

## Run Locally

Jalankan project di local development:

```bash
npm run dev
```

Jika ingin menjalankan agar bisa diakses dari jaringan lokal:

```bash
npm run dev:host
```

## Build

Untuk build production:

```bash
npm run build
```

Untuk preview hasil build:

```bash
npm run preview
```

## How To Use

1. Upload logo perusahaan jika diperlukan
2. Atur zoom dan posisi logo, lalu klik `Save`
3. Isi periode gaji
4. Isi nama perusahaan
5. Isi data karyawan
6. Isi komponen pendapatan
7. Isi komponen potongan
8. Tambahkan item custom jika diperlukan pada bagian `Lainnya`
9. Isi pihak `Dibuat Oleh` dan `Disetujui Oleh`
10. Bagian `Diterima Oleh` akan terisi otomatis dari nama dan jabatan karyawan
11. Klik tombol download untuk mengunduh slip gaji dalam format PDF

## Project Structure

```bash
src/
  components/
    ExportPDF.jsx
    FormInput.jsx
    PayslipPreview.jsx
  utils/
    PayrollCalculator.js
  App.jsx
  index.css
  main.jsx
```

## Main Components

### `FormInput.jsx`

Menangani seluruh form input utama:
- data perusahaan
- data karyawan
- pendapatan
- potongan
- approval
- upload dan editor logo

### `PayslipPreview.jsx`

Menangani tampilan slip gaji yang digunakan sebagai sumber export PDF.

### `ExportPDF.jsx`

Menangani proses export preview menjadi file PDF.

### `PayrollCalculator.js`

Berisi helper untuk:
- format angka
- format rupiah
- perhitungan total pendapatan
- perhitungan total potongan
- perhitungan take home pay

## Notes

- Hasil PDF dirancang agar tampil lebih rapi untuk kebutuhan cetak
- Layout form di mobile dibuat tetap mempertahankan susunan desktop, dengan ukuran tampilan yang menyesuaikan layar
- Item custom pada pendapatan dan potongan bisa ditambah maupun dihapus
- `Diterima Oleh` mengikuti data karyawan secara otomatis

## Future Improvements

Beberapa ide pengembangan berikutnya:

- Menambahkan template slip gaji lain
- Menambahkan export ke format gambar
- Menambahkan penyimpanan data slip
- Menambahkan multi-karyawan
- Menambahkan pilihan tema warna slip gaji

## Author

Made by Dannes Luthfiyah

GitHub:
https://github.com/dannesluthfiyah/slipgajigenerator
