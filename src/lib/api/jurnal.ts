import { api } from '$lib/api/client';

export type StatusKehadiranAPI = 'BELUM' | 'HADIR' | 'TERLAMBAT' | 'IZIN' | 'SAKIT' | 'ALPA';

export type StatusJurnal = 'hadir' | 'terlambat' | 'izin' | 'sakit' | 'alpa' | 'belum';

export interface InfoJadwal {
	id_jadwal: number;
	nama_kelas: string;
	nama_mapel: string;
	jam: string;
	ruangan: string;
}

export interface SiswaJadwal {
	id_siswa: number;
	nisn: string;
	nama_lengkap: string;
	status_kehadiran: StatusKehadiranAPI;
	waktu_scan: string | null;
}

export interface ResponsJadwalJurnal {
	jadwal: InfoJadwal;
	siswa: SiswaJadwal[];
}

export interface SiswaJurnalLocal {
	id: number;
	nisn: string;
	nama: string;
	status: StatusJurnal;
	waktuScan?: string | null;
}

export const petaStatusAPI: Record<StatusKehadiranAPI, StatusJurnal> = {
	BELUM: 'belum',
	HADIR: 'hadir',
	TERLAMBAT: 'terlambat',
	IZIN: 'izin',
	SAKIT: 'sakit',
	ALPA: 'alpa'
};

export const petaStatusLocal: Record<Exclude<StatusJurnal, 'belum'>, StatusKehadiranAPI> = {
	hadir: 'HADIR',
	terlambat: 'TERLAMBAT',
	izin: 'IZIN',
	sakit: 'SAKIT',
	alpa: 'ALPA'
};

export async function ambilJadwalJurnal(idJadwal: number): Promise<ResponsJadwalJurnal> {
	return api<ResponsJadwalJurnal>(`/jurnal/${idJadwal}`);
}

export async function overrideAbsensi(payload: {
	id_jadwal: number;
	id_siswa: number;
	status_kehadiran: StatusKehadiranAPI;
}) {
	return api<{ ok: boolean }>('/absensi/override', { method: 'POST', body: payload });
}

export interface ItemDaftarSiswaSubmit {
	id_siswa: number;
	status_kehadiran: StatusKehadiranAPI;
}

export async function kirimJurnalSesi(payload: {
	id_jadwal: number;
	materi_pembelajaran: string;
	catatan_jurnal: string;
	daftar_siswa: ItemDaftarSiswaSubmit[];
}) {
	return api<{ ok: boolean }>('/jurnal/submit', { method: 'POST', body: payload });
}
