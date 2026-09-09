export interface Siswa {
	id: string;
	nama: string;
	nis: string;
	nisn?: string;
	kelas: string;
	jenisKelamin: 'L' | 'P';
	tanggalLahir?: string;
	tempatLahir?: string;
	alamat?: string;
	noHp?: string;
	email?: string;
	namaOrtu?: string;
	noHpOrtu?: string;
	status: 'aktif' | 'alumni' | 'nonaktif';
	createdAt: string;
	updatedAt: string;
}

export interface Guru {
	id: string;
	nik: string;
	nama: string;
	jenisKelamin: 'L' | 'P';
	jabatan: string;
	mataPelajaran?: string;
	tanggalLahir?: string;
	tempatLahir?: string;
	alamat?: string;
	noHp?: string;
	email?: string;
	status: 'aktif' | 'nonaktif';
	createdAt: string;
	updatedAt: string;
}

export interface JurnalKelas {
	id: string;
	guruId: string;
	siswaId: string;
	kelas: string;
	mataPelajaran: string;
	materi: string;
	tanggal: string;
	jamMulai?: string;
	jamSelesai?: string;
	totalHadir: number;
	totalSiswa: number;
	catatan?: string;
	createdAt: string;
	updatedAt: string;
}

export interface AbsensiPelajaran {
	id: string;
	jurnalKelasId: string;
	siswaId: string;
	status: 'hadir' | 'izin' | 'sakit' | 'alpa';
	keterangan?: string;
	createdAt: string;
	updatedAt: string;
}

export interface AbsensiHarian {
	id: string;
	siswaId: string;
	tanggal: string;
	status: 'hadir' | 'izin' | 'sakit' | 'alpa';
	jamMasuk?: string;
	jamPulang?: string;
	keterangan?: string;
	petugasId?: string;
	createdAt: string;
	updatedAt: string;
}

export interface KategoriPoin {
	id: string;
	nama: string;
	deskripsi?: string;
	nilai: number;
	isPrestasi: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CatatanPoinSiswa {
	id: string;
	siswaId: string;
	kategoriPoinId: string;
	nilai: number;
	tanggal: string;
	deskripsi?: string;
	petugasId?: string;
	createdAt: string;
	updatedAt: string;
}
