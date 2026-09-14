import { api } from '$lib/api/client';
import { bacaSesi } from '$lib/auth.svelte';

export type StatusKehadiranAPI = 'BELUM' | 'HADIR' | 'IZIN' | 'SAKIT' | 'ALPA';

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
	jurnal_sekarang: {
		id: number;
		materi_pembelajaran: string;
		catatan_jurnal: string;
	} | null;
}

export interface SiswaJurnalLocal {
	id: number;
	nisn: string;
	nama: string;
	status: StatusJurnal;
	waktuScan?: string | null;
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

interface JurnalKelasAPI {
	id: number;
	jadwalId: number;
	tanggal: string;
	materiPembelajaran: string | null;
	catatanKondisiKelas: string | null;
	diisiOleh: number;
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

function hariIni(): string {
	return new Date().toISOString().slice(0, 10);
}

function jamFormat(iso: string) {
	return iso?.slice(0, 5) ?? '--:--';
}

export async function ambilJadwalJurnal(idJadwal: number): Promise<ResponsJadwalJurnal> {
	const [jadwal, semuaSiswa, semuaAbsensi, semuaJurnal] = await Promise.all([
		api<JadwalPelajaranAPI>(`/jadwal_pelajaran/${idJadwal}`),
		api<SiswaAPI[]>('/siswa'),
		api<AbsensiPelajaranAPI[]>('/absensi_pelajaran'),
		api<JurnalKelasAPI[]>('/jurnal_kelas')
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
	const jurnalHariIni = semuaJurnal.find((j) => j.jadwalId === idJadwal && j.tanggal === tanggal);

	return {
		jadwal: {
			id_jadwal: idJadwal,
			nama_kelas: kelas?.namaKelas ?? `Kelas #${jadwal.kelasId}`,
			nama_mapel: mapel?.namaPelajaran ?? `Mapel #${jadwal.mataPelajaranId}`,
			jam: `${jamFormat(jadwal.jamMulai)} - ${jamFormat(jadwal.jamSelesai)}`,
			ruangan: '-'
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

export async function kirimJurnalSesi(payload: {
	id_jadwal: number;
	materi_pembelajaran: string;
	catatan_jurnal: string;
	daftar_siswa: { id_siswa: number; status_kehadiran: StatusKehadiranAPI }[];
}) {
	const tanggal = hariIni();
	const guruId = bacaSesi()?.guruId;
	if (!guruId) throw new Error('Sesi guru tidak ditemukan. Silakan login ulang.');
	for (const item of payload.daftar_siswa) {
		if (item.status_kehadiran === 'BELUM') continue;
		await overrideAbsensi({
			id_jadwal: payload.id_jadwal,
			id_siswa: item.id_siswa,
			status_kehadiran: item.status_kehadiran
		});
	}
	const semua = await api<JurnalKelasAPI[]>('/jurnal_kelas');
	const ada = semua.find((j) => j.jadwalId === payload.id_jadwal && j.tanggal === tanggal);
	if (ada) {
		return api<JurnalKelasAPI>(`/jurnal_kelas/${ada.id}`, {
			method: 'PATCH',
			body: {
				materiPembelajaran: payload.materi_pembelajaran || null,
				catatanKondisiKelas: payload.catatan_jurnal || null
			}
		});
	}
	return api<JurnalKelasAPI>('/jurnal_kelas', {
		method: 'POST',
		body: {
			jadwalId: payload.id_jadwal,
			tanggal,
			materiPembelajaran: payload.materi_pembelajaran || null,
			catatanKondisiKelas: payload.catatan_jurnal || null,
			diisiOleh: guruId
		}
	});
}
