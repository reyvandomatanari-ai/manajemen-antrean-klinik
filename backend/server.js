const express = require('express');
const cors = require('cors'); // <-- 1. Ini kode CORS pertama (mengambil modul)
const app = express();
const PORT = 3000;

app.use(cors()); // <-- 2. Ini kode CORS kedua (mengizinkan akses dari frontend)
app.use(express.json());

// Tempat penyimpanan data antrean pasien sementara di memori server
let daftarAntrean = [];

// API 1: Mengambil semua data antrean (Untuk Halaman Admin)
app.get('/api/antrean', (req, res) => {
    res.json(daftarAntrean);
});

// API 2: Menambahkan pasien baru ke antrean (Untuk Halaman Form Pasien)
app.post('/api/antrean', (req, res) => {
    const { nama, dokter, jam } = req.body;

    if (!nama || !dokter || !jam) {
        return res.status(400).json({ pesan: "Data tidak lengkap!" });
    }

    const nomorUrut = daftarAntrean.length + 1;
    const formatNomor = 'A-' + String(nomorUrut).padStart(3, '0');

    const pasienBaru = {
        nomor: formatNomor,
        nama: nama,
        dokter: dokter,
        jam: jam,
        status: 'Menunggu'
    };

    daftarAntrean.push(pasienBaru);
    res.status(201).json(pasienBaru);
});
// API 3: Memperbarui status pasien (Untuk Tombol Panggil di Admin)
app.put('/api/antrean/:nomor', (req, res) => {
    const { nomor } = req.params;
    const { status } = req.body;

    const pasien = daftarAntrean.find(p => p.nomor === nomor);
    
    if (pasien) {
        pasien.status = status;
        return res.json({ pesan: "Status berhasil diperbarui", pasien });
    }

    res.status(404).json({ pesan: "Pasien tidak ditemukan" });
});

// Menyalakan server di port 3000
app.listen(PORT, () => {
    console.log(`Server klinik berjalan sukses di http://localhost:${PORT}`);
});
