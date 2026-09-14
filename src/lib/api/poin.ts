import { api } from '$lib/api/client';

export interface SiswaAPI {
	id: number;
	penggunaId: number;
	nisn: string | null;
	namaLengkap: string;
	kelasId: number | null;
	kunciQrRahasia: string | null;
	uidKartu: string | null;
	createdAt?: string;
	updatedAt?: string;
}

export interface KategoriPoinAPI {
	id: number;
	jenis: 'positif' | 'negatif';
	namaKategori: string;
	bobotPoin: number;
	createdAt?: string;
	updatedAt?: string;
}

export interface GuruAPI {
	id: number;
	penggunaId: number;
	nip: string | null;
	namaLengkap: string;
	nomorTelepon: string | null;
	createdAt?: string;
	updatedAt?: string;
}

export interface KelasAPI {
	id: number;
	namaKelas: string;
	tingkatKelas: number;
	waliKelasId: number | null;
	createdAt?: string;
	updatedAt?: string;
}

export interface CatatanPoinAPI {
	id: number;
	siswaId: number;
	kategoriPoinId: number;
	tanggal: string;
	dilaporkanOleh: number | null;
	deskripsi: string | null;
	urlFotoBukti: string | null;
	createdAt?: string;
	updatedAt?: string;
}

export interface KirimCatatanPoinPayload {
	siswaId: number;
	kategoriPoinId: number;
	tanggal: string;
	dilaporkanOleh?: number;
	deskripsi?: string;
}

export function ambilSiswa(): Promise<SiswaAPI[]> {
	return api<SiswaAPI[]>('/siswa');
}

export function ambilKategoriPoin(): Promise<KategoriPoinAPI[]> {
	return api<KategoriPoinAPI[]>('/kategori_poin');
}

export function ambilCatatanPoin(): Promise<CatatanPoinAPI[]> {
	return api<CatatanPoinAPI[]>('/catatan_poin_siswa');
}

export function ambilDaftarGuru(): Promise<GuruAPI[]> {
	return api<GuruAPI[]>('/guru');
}

export function ambilDaftarKelas(): Promise<KelasAPI[]> {
	return api<KelasAPI[]>('/kelas');
}

export function kirimCatatanPoin(payload: KirimCatatanPoinPayload): Promise<CatatanPoinAPI> {
	return api<CatatanPoinAPI>('/catatan_poin_siswa', { method: 'POST', body: payload });
}
