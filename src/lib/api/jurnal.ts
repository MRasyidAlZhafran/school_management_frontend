import { api } from '$lib/api/client';
import { mockSiswaJurnal } from '$lib/data/mock-jurnal';

// Mode demo: selama backend composite belum tersedia, pakai mock data.
// Balik menjadi `true` saat endpoint sesuai API-KONTRAK-JURNAL.md sudah ada.
const GunakanAPI = false;

const PENUNDAAN_DEMO = 350;

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
	if (GunakanAPI) {
		return api<ResponsJadwalJurnal>(`/jurnal/${idJadwal}`);
	}

	await tunda(PENUNDAAN_DEMO);
	return {
		jadwal: {
			id_jadwal: idJadwal,
			nama_kelas: 'XII IPA 1',
			nama_mapel: 'Fisika',
			jam: '07:30 - 09:00',
			ruangan: '203'
		},
		siswa: mockSiswaJurnal.map((s, i) => ({
			id_siswa: i + 1,
			nisn: s.nis,
			nama_lengkap: s.nama,
			status_kehadiran: 'BELUM',
			waktu_scan: null
		}))
	};
}

export async function overrideAbsensi(payload: {
	id_jadwal: number;
	id_siswa: number;
	status_kehadiran: StatusKehadiranAPI;
}) {
	if (GunakanAPI) {
		return api<{ ok: boolean }>('/absensi/override', { method: 'POST', body: payload });
	}

	await tunda(PENUNDAAN_DEMO);
	return { ok: true };
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
	if (GunakanAPI) {
		return api<{ ok: boolean }>('/jurnal/submit', { method: 'POST', body: payload });
	}

	await tunda(PENUNDAAN_DEMO);
	return { ok: true };
}

export function tunda(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
