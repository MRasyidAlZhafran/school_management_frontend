export interface SiswaOption {
	id: string;
	nis: string;
	nama: string;
	kelas: string;
}

export interface KategoriPoinOption {
	id: string;
	nama: string;
	nilai: number;
	isPrestasi: boolean;
}

export interface RiwayatPoin {
	id: string;
	siswaNama: string;
	nis: string;
	kategori: string;
	nilai: number;
	isPrestasi: boolean;
	tanggal: string;
	pelapor: string;
	fotoBukti: boolean;
}

export const daftarSiswaPoin: SiswaOption[] = [
	{ id: 's1', nis: '20240101', nama: 'Ahmad Fauzi', kelas: 'XII IPA 1' },
	{ id: 's2', nis: '20240102', nama: 'Bunga Citra Lestari', kelas: 'XII IPA 1' },
	{ id: 's3', nis: '20240103', nama: 'Citra Kirana', kelas: 'XII IPA 1' },
	{ id: 's4', nis: '20240104', nama: 'Dewi Lestari', kelas: 'XII IPA 1' },
	{ id: 's5', nis: '20240105', nama: 'Eko Prasetyo', kelas: 'XII IPA 1' },
	{ id: 's6', nis: '20240106', nama: 'Farhan Maulana', kelas: 'XII IPA 1' },
	{ id: 's7', nis: '20240107', nama: 'Galih Pratama', kelas: 'XII IPA 1' },
	{ id: 's8', nis: '20240108', nama: 'Intan Permata', kelas: 'XII IPA 1' }
];

export const daftarKategoriPoin: KategoriPoinOption[] = [
	{ id: 'k1', nama: 'Terlambat Masuk Sekolah', nilai: -5, isPrestasi: false },
	{ id: 'k2', nama: 'Tidak Membawa Buku Pelajaran', nilai: -5, isPrestasi: false },
	{ id: 'k3', nama: 'Tidak Memakai Seragam Lengkap', nilai: -10, isPrestasi: false },
	{ id: 'k4', nama: 'Membuang Sampah Sembarangan', nilai: -5, isPrestasi: false },
	{ id: 'k5', nama: 'Berkata Tidak Sopan', nilai: -10, isPrestasi: false },
	{ id: 'k6', nama: 'Merusak Fasilitas Sekolah', nilai: -20, isPrestasi: false },
	{ id: 'p1', nama: 'Mengikuti Lomba Sekolah', nilai: 10, isPrestasi: true },
	{ id: 'p2', nama: 'Juara Lomba Olahraga', nilai: 15, isPrestasi: true },
	{ id: 'p3', nama: 'Juara Lomba Matematika', nilai: 20, isPrestasi: true },
	{ id: 'p4', nama: 'Juara Olimpiade Sains', nilai: 25, isPrestasi: true },
	{ id: 'p5', nama: 'Menjadi Petugas Upacara', nilai: 5, isPrestasi: true }
];

export const mockRiwayatPoin: RiwayatPoin[] = [
	{
		id: 'r1',
		siswaNama: 'Citra Kirana',
		nis: '20240103',
		kategori: 'Juara Lomba Matematika',
		nilai: 20,
		isPrestasi: true,
		tanggal: '2026-09-06',
		pelapor: 'Ahmad Fauzi, S.Pd.',
		fotoBukti: true
	},
	{
		id: 'r2',
		siswaNama: 'Eko Prasetyo',
		nis: '20240105',
		kategori: 'Tidak Membawa Buku Pelajaran',
		nilai: -5,
		isPrestasi: false,
		tanggal: '2026-09-07',
		pelapor: 'Budi Santoso, S.Pd.',
		fotoBukti: false
	},
	{
		id: 'r3',
		siswaNama: 'Dewi Lestari',
		nis: '20240104',
		kategori: 'Terlambat Masuk Sekolah',
		nilai: -5,
		isPrestasi: false,
		tanggal: '2026-09-08',
		pelapor: 'Ahmad Fauzi, S.Pd.',
		fotoBukti: false
	},
	{
		id: 'r4',
		siswaNama: 'Farhan Maulana',
		nis: '20240106',
		kategori: 'Merusak Fasilitas Sekolah',
		nilai: -20,
		isPrestasi: false,
		tanggal: '2026-09-08',
		pelapor: 'Basuki Rahmat, S.Pd.',
		fotoBukti: true
	},
	{
		id: 'r5',
		siswaNama: 'Bunga Citra Lestari',
		nis: '20240102',
		kategori: 'Juara Olimpiade Sains',
		nilai: 25,
		isPrestasi: true,
		tanggal: '2026-09-05',
		pelapor: 'Ahmad Fauzi, S.Pd.',
		fotoBukti: true
	},
	{
		id: 'r6',
		siswaNama: 'Galih Pratama',
		nis: '20240107',
		kategori: 'Berkata Tidak Sopan',
		nilai: -10,
		isPrestasi: false,
		tanggal: '2026-09-04',
		pelapor: 'Budi Santoso, S.Pd.',
		fotoBukti: false
	}
];