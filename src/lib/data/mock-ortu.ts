// SEMENTARA — Preview tampilan role Orang Tua.
// Data dummy ini hanya untuk menampilkan UI dan akan DIPECAT/DIGANTI
// saat integrasi login & role siswa dari rekan sudah di-push.
import type { Sesi, SesiAnak } from '$lib/auth.svelte';

export type StatusSiswa = 'hadir' | 'izin' | 'sakit' | 'alpa';

export interface AbsensiHarianMock {
	siswaId: number;
	tanggal: string; // YYYY-MM-DD
	jamMasuk: string | null;
	jamKeluar: string | null;
	status: StatusSiswa;
	metode: 'qr' | 'kartu' | 'manual';
}

export interface AbsensiPelajaranMock {
	siswaId: number;
	tanggal: string;
	mapel: string;
	guru: string;
	jamMulai: string;
	jamSelesai: string;
	status: StatusSiswa;
}

export interface CatatanPoinMock {
	siswaId: number;
	tanggal: string;
	jenis: 'positif' | 'negatif';
	kategori: string;
	bobot: number;
	deskripsi: string;
	guru: string;
	urlFotoBukti?: string;
}

export interface JurnalMock {
	tanggal: string;
	mapel: string;
	guru: string;
	jamMulai: string;
	jamSelesai: string;
	materi: string;
	catatan: string;
}

export const sesiOrtuDemo: Sesi = {
	role: 'ortu',
	penggunaId: 101,
	orangTuaId: 1,
	surel: 'ibu.rina.azizah@sekolah.id',
	namaLengkap: 'Hj. Rina Azizah',
	nomorTelepon: '081234567899',
	anakAktifId: 1,
	daftarAnak: [
		{
			siswaId: 1,
			nisn: '0000000001',
			namaLengkap: 'Rina Putri Azizah',
			kelas: 'X IPA 1',
			tingkat: 10
		},
		{
			siswaId: 2,
			nisn: '0000000002',
			namaLengkap: 'Budi Santoso Azizah',
			kelas: 'X IPA 1',
			tingkat: 10
		}
	]
};

export const daftarAnakDemo: SesiAnak[] = sesiOrtuDemo.daftarAnak ?? [];

export const absensiHarianMock: AbsensiHarianMock[] = [
	{
		siswaId: 1,
		tanggal: '2026-09-15',
		jamMasuk: '07:02',
		jamKeluar: '13:30',
		status: 'hadir',
		metode: 'qr'
	},
	{
		siswaId: 1,
		tanggal: '2026-09-14',
		jamMasuk: '06:58',
		jamKeluar: '13:25',
		status: 'hadir',
		metode: 'qr'
	},
	{
		siswaId: 1,
		tanggal: '2026-09-11',
		jamMasuk: null,
		jamKeluar: null,
		status: 'sakit',
		metode: 'manual'
	},
	{
		siswaId: 1,
		tanggal: '2026-09-10',
		jamMasuk: '07:05',
		jamKeluar: '13:12',
		status: 'hadir',
		metode: 'qr'
	},
	{
		siswaId: 1,
		tanggal: '2026-09-09',
		jamMasuk: '07:00',
		jamKeluar: '13:28',
		status: 'hadir',
		metode: 'qr'
	},
	{
		siswaId: 2,
		tanggal: '2026-09-15',
		jamMasuk: '07:04',
		jamKeluar: '13:20',
		status: 'hadir',
		metode: 'qr'
	},
	{
		siswaId: 2,
		tanggal: '2026-09-14',
		jamMasuk: '07:11',
		jamKeluar: '13:22',
		status: 'hadir',
		metode: 'qr'
	},
	{
		siswaId: 2,
		tanggal: '2026-09-11',
		jamMasuk: null,
		jamKeluar: null,
		status: 'izin',
		metode: 'manual'
	}
];

export const absensiPelajaranMock: AbsensiPelajaranMock[] = [
	{
		siswaId: 1,
		tanggal: '2026-09-15',
		mapel: 'Fisika',
		guru: 'Pak Budi Prasetyo',
		jamMulai: '07:30',
		jamSelesai: '09:00',
		status: 'hadir'
	},
	{
		siswaId: 1,
		tanggal: '2026-09-15',
		mapel: 'Matematika',
		guru: 'Bu Sri Wahyuni',
		jamMulai: '09:10',
		jamSelesai: '10:40',
		status: 'hadir'
	},
	{
		siswaId: 1,
		tanggal: '2026-09-15',
		mapel: 'B. Indonesia',
		guru: 'Pak Andi Saputra',
		jamMulai: '10:50',
		jamSelesai: '12:20',
		status: 'sakit'
	},
	{
		siswaId: 1,
		tanggal: '2026-09-14',
		mapel: 'Matematika',
		guru: 'Bu Sri Wahyuni',
		jamMulai: '07:30',
		jamSelesai: '09:00',
		status: 'hadir'
	},
	{
		siswaId: 1,
		tanggal: '2026-09-14',
		mapel: 'B. Inggris',
		guru: 'Pak Andi Saputra',
		jamMulai: '13:00',
		jamSelesai: '14:30',
		status: 'hadir'
	},
	{
		siswaId: 2,
		tanggal: '2026-09-15',
		mapel: 'Fisika',
		guru: 'Pak Budi Prasetyo',
		jamMulai: '07:30',
		jamSelesai: '09:00',
		status: 'hadir'
	}
];

export const poinMock: CatatanPoinMock[] = [
	{
		siswaId: 1,
		tanggal: '2026-09-15',
		jenis: 'positif',
		kategori: 'Rajin',
		bobot: 5,
		deskripsi: 'Menyelesaikan soal fisika di papan tulis tanpa diminta',
		guru: 'Pak Budi Prasetyo'
	},
	{
		siswaId: 1,
		tanggal: '2026-09-12',
		jenis: 'positif',
		kategori: 'Rajin',
		bobot: 5,
		deskripsi: 'Membantu teman saat kerja kelompok Matematika',
		guru: 'Bu Sri Wahyuni'
	},
	{
		siswaId: 1,
		tanggal: '2026-09-10',
		jenis: 'negatif',
		kategori: 'Terlambat',
		bobot: -3,
		deskripsi: 'Datang terlambat 8 menit saat pelajaran Matematika',
		guru: 'Bu Sri Wahyuni',
		urlFotoBukti: 'demo'
	},
	{
		siswaId: 1,
		tanggal: '2026-09-05',
		jenis: 'positif',
		kategori: 'Rajin',
		bobot: 5,
		deskripsi: 'Juara cerdas cermat tingkat angkatan',
		guru: 'Pak Andi Saputra'
	},
	{
		siswaId: 2,
		tanggal: '2026-09-15',
		jenis: 'negatif',
		kategori: 'Terlambat',
		bobot: -3,
		deskripsi: 'Terlambat datang saat upacara Senin pagi',
		guru: 'Pak Budi Prasetyo'
	}
];

export const jurnalMock: JurnalMock[] = [
	{
		tanggal: '2026-09-15',
		mapel: 'Fisika',
		guru: 'Pak Budi Prasetyo',
		jamMulai: '07:30',
		jamSelesai: '09:00',
		materi: 'Gerak Lurus Beraturan (GLB): definisi, rumus s = v·t, dan contoh soal',
		catatan: 'Kelas kondusif. Tiga siswa mengerjakan soal di papan tulis.'
	},
	{
		tanggal: '2026-09-15',
		mapel: 'Matematika',
		guru: 'Bu Sri Wahyuni',
		jamMulai: '09:10',
		jamSelesai: '10:40',
		materi: 'Logaritma: definisi, sifat-sifat dasar, dan penyederhanaan bentuk log',
		catatan: 'Sebagian siswa masih kesulitan sifat perkalian log. PR 5 soal dikumpulkan Jumat.'
	},
	{
		tanggal: '2026-09-14',
		mapel: 'B. Inggris',
		guru: 'Pak Andi Saputra',
		jamMulai: '13:00',
		jamSelesai: '14:30',
		materi: 'Present Tense: pola kalimat positif, negatif, dan tanya',
		catatan: 'Diskusi kelompok mengerjakan worksheet; kelas cukup antusias.'
	}
];
