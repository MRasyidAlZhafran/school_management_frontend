import { api } from '$lib/api/client';

export interface GuruAPI {
	id: number;
	penggunaId: number;
	nip: string | null;
	namaLengkap: string;
	nomorTelepon: string | null;
	createdAt?: string;
	updatedAt?: string;
}

export interface PenggunaAPI {
	id: number;
	surel: string;
	kataSandi: string;
	isAktif: boolean;
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

export interface MataPelajaranAPI {
	id: number;
	namaPelajaran: string;
	kodePelajaran: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface JadwalPelajaranAPI {
	id: number;
	tahunAjaranId: number;
	kelasId: number;
	mataPelajaranId: number;
	guruId: number;
	hari: number;
	jamMulai: string;
	jamSelesai: string;
	createdAt?: string;
	updatedAt?: string;
}

export function ambilGuru(id: number): Promise<GuruAPI> {
	return api<GuruAPI>(`/guru/${id}`);
}

export function ambilPengguna(id: number): Promise<PenggunaAPI> {
	return api<PenggunaAPI>(`/pengguna/${id}`);
}

export async function ambilJadwalGuru(guruId: number): Promise<JadwalPelajaranAPI[]> {
	const semua = await api<JadwalPelajaranAPI[]>('/jadwal_pelajaran');
	return semua.filter((j) => j.guruId === guruId);
}

export async function ambilMapel(id: number): Promise<MataPelajaranAPI | null> {
	if (!id) return null;
	try {
		return await api<MataPelajaranAPI>(`/mata_pelajaran/${id}`);
	} catch {
		return null;
	}
}

export async function ambilKelas(id: number): Promise<KelasAPI | null> {
	if (!id) return null;
	try {
		return await api<KelasAPI>(`/kelas/${id}`);
	} catch {
		return null;
	}
}
