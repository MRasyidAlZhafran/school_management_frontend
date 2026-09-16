import { api } from '$lib/api/client';

export interface JadwalPelajaranSiswaAPI {
	id: number;
	hari: number;
	jamMulai: string;
	jamSelesai: string;
	mataPelajaran: string;
	guru: string;
}

export function ambilJadwalKelas(kelasId: number): Promise<JadwalPelajaranSiswaAPI[]> {
	return api<JadwalPelajaranSiswaAPI[]>(`/jadwal_pelajaran/kelas/${kelasId}`);
}
