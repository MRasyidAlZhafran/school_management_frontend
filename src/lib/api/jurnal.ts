import { api } from '$lib/api/client';
import { bacaSesi } from '$lib/auth.svelte';

export type StatusKehadiranAPI = 'BELUM' | 'HADIR' | 'IZIN' | 'SAKIT' | 'ALPA';

export type StatusJurnal = 'hadir' | 'terlambat' | 'izin' | 'sakit' | 'alpa' | 'belum';

export type StatusSesi = 'belum' | 'berjalan' | 'selesai';

export interface InfoJadwal {
	id_jadwal: number;
	nama_kelas: string;
	nama_mapel: string;
	ruangan: string;
	hari: number;
	jamMulai: string;
	jamSelesai: string;
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

export interface HasilSelesaiSesi {
	tersimpan: number;
	hadir: number;
	total: number;
}

interface JadwalPelajaranAPI {
	id: number;
	kelasId: number;
	mataPelajaranId: number;
	guruId: number;
	hari: number;
	jamMulai: string;
	jamSelesai: string;
}

interface KelasAPI {
	id: number;
	namaKelas: string;
}

interface MapelAPI {
	id: number;
	namaPelajaran: string;
}

interface SiswaAPI {
	id: number;
	nisn: string | null;
	namaLengkap: string;
	kelasId: number | null;
}

interface AbsensiPelajaranAPI {
	id: number;
	jadwalId: number;
	siswaId: number;
	tanggal: string;
	status: 'hadir' | 'izin' | 'sakit' | 'alpa';
	dicatatOleh: number | null;
}

export const petaStatusAPI: Record<StatusKehadiranAPI, StatusJurnal> = {
	BELUM: 'belum',
	HADIR: 'hadir',
	IZIN: 'izin',
	SAKIT: 'sakit',
	ALPA: 'alpa'
};

export const petaStatusLocal: Record<Exclude<StatusJurnal, 'belum'>, StatusKehadiranAPI> = {
	hadir: 'HADIR',
	terlambat: 'HADIR',
	izin: 'IZIN',
	sakit: 'SAKIT',
	alpa: 'ALPA'
};

const statusKeBackend: Record<
	Exclude<StatusKehadiranAPI, 'BELUM'>,
	AbsensiPelajaranAPI['status']
> = {
	HADIR: 'hadir',
	IZIN: 'izin',
	SAKIT: 'sakit',
	ALPA: 'alpa'
};

function keMenit(jam: string): number {
	const [h = '0', m = '0'] = jam.split(':');
	return Number(h) * 60 + Number(m);
}

export function cariStatusSesi(
	sesi: { hari: number; jamMulai: string; jamSelesai: string },
	sekarang = new Date()
): StatusSesi {
	const hariJadwalJs = sesi.hari % 7;
	if (hariJadwalJs !== sekarang.getDay()) return 'belum';
	const menitSekarang = sekarang.getHours() * 60 + sekarang.getMinutes();
	const mulai = keMenit(sesi.jamMulai);
	const selesai = keMenit(sesi.jamSelesai);
	if (menitSekarang < mulai) return 'belum';
	if (menitSekarang >= selesai) return 'selesai';
	return 'berjalan';
}

export function hariJadwalSekarang(sekarang = new Date()): number {
	const day = sekarang.getDay();
	return day === 0 ? 7 : day;
}

function hariIni(): string {
	return new Date().toISOString().slice(0, 10);
}

export async function ambilJadwalJurnal(idJadwal: number): Promise<ResponsJadwalJurnal> {
	const [jadwal, semuaSiswa, semuaAbsensi] = await Promise.all([
		api<JadwalPelajaranAPI>(`/jadwal_pelajaran/${idJadwal}`),
		api<SiswaAPI[]>('/siswa'),
		api<AbsensiPelajaranAPI[]>('/absensi_pelajaran')
	]);

	const [kelas, mapel] = await Promise.all([
		api<KelasAPI>(`/kelas/${jadwal.kelasId}`).catch(() => null),
		api<MapelAPI>(`/mata_pelajaran/${jadwal.mataPelajaranId}`).catch(() => null)
	]);

	const tanggal = hariIni();
	const siswaKelas = semuaSiswa.filter((s) => s.kelasId === jadwal.kelasId);
	const absensiHariIni = semuaAbsensi.filter(
		(a) => a.jadwalId === idJadwal && a.tanggal === tanggal
	);

	return {
		jadwal: {
			id_jadwal: idJadwal,
			nama_kelas: kelas?.namaKelas ?? `Kelas #${jadwal.kelasId}`,
			nama_mapel: mapel?.namaPelajaran ?? `Mapel #${jadwal.mataPelajaranId}`,
			ruangan: '-',
			hari: jadwal.hari,
			jamMulai: jadwal.jamMulai,
			jamSelesai: jadwal.jamSelesai
		},
		siswa: siswaKelas.map((s) => {
			const abs = absensiHariIni.find((a) => a.siswaId === s.id);
			return {
				id_siswa: s.id,
				nisn: s.nisn ?? '',
				nama_lengkap: s.namaLengkap,
				status_kehadiran: abs ? (abs.status.toUpperCase() as StatusKehadiranAPI) : 'BELUM',
				waktu_scan: null
			};
		})
	};
}

export async function overrideAbsensi(payload: {
	id_jadwal: number;
	id_siswa: number;
	status_kehadiran: StatusKehadiranAPI;
}) {
	const tanggal = hariIni();
	const guruId = bacaSesi()?.guruId ?? null;
	if (payload.status_kehadiran === 'BELUM') return;
	const semua = await api<AbsensiPelajaranAPI[]>('/absensi_pelajaran');
	const ada = semua.find(
		(a) =>
			a.jadwalId === payload.id_jadwal && a.siswaId === payload.id_siswa && a.tanggal === tanggal
	);
	const statusBackend = statusKeBackend[payload.status_kehadiran];
	if (ada) {
		if (ada.status === statusBackend) return;
		return api<AbsensiPelajaranAPI>(`/absensi_pelajaran/${ada.id}`, {
			method: 'PATCH',
			body: { status: statusBackend }
		});
	}
	return api<AbsensiPelajaranAPI>('/absensi_pelajaran', {
		method: 'POST',
		body: {
			jadwalId: payload.id_jadwal,
			siswaId: payload.id_siswa,
			tanggal,
			status: statusBackend,
			dicatatOleh: guruId
		}
	});
}

export async function selesaikanSesi(payload: {
	id_jadwal: number;
	daftar_siswa: SiswaJurnalLocal[];
}): Promise<HasilSelesaiSesi> {
	let tersimpan = 0;
	let hadir = 0;
	for (const siswa of payload.daftar_siswa) {
		if (siswa.status === 'belum') continue;
		hadir += siswa.status === 'hadir' || siswa.status === 'terlambat' ? 1 : 0;
		await overrideAbsensi({
			id_jadwal: payload.id_jadwal,
			id_siswa: siswa.id,
			status_kehadiran: petaStatusLocal[siswa.status]
		});
		tersimpan += 1;
	}
	return { tersimpan, hadir, total: payload.daftar_siswa.length };
}
