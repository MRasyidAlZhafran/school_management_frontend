import { api } from '$lib/api/client';
import type { KelasAPI, PenggunaAPI } from './guru';

export interface SiswaAPI {
	id: number;
	penggunaId: number;
	nisn: string;
	namaLengkap: string;
	kelasId: number | null;
	kunciQrRahasia: string | null;
	uidKartu: string | null;
	createdAt?: string;
	updatedAt?: string;
}

export function ambilSiswa(id: number): Promise<SiswaAPI> {
	return api<SiswaAPI>(`/siswa/${id}`);
}
