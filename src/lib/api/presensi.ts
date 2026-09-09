import { api } from '$lib/api/client';
import { mockSiswaJurnal, type SiswaJurnal } from '$lib/data/mock-jurnal';

// =====================================================================
// Lapisan API untuk alur Presensi QR.
// Saat backend sudah jadi, cukup ikuti format komentar di bawah dan
// nilai `GunakanAPI` menjadi true. Tanpa backend, fungsi memakai mock.
// =====================================================================

const GunakanAPI = false;
const TOKEN_TTL_DETIK = 30;

interface SesiPresensi {
	sesiId: string;
	token: string;
	exp: number;
}

interface ScanQRPayload {
	sesiId: string;
	token: string;
	siswaId: string;
}

interface DaftarSiswaPayload {
	siswa: Pick<SiswaJurnal, 'id' | 'nis' | 'nama'>[];
	statusMap: Record<string, SiswaJurnal['status']>;
}

// Default debounce agar kegagalan API tidak menumpuk
const PENUNDAAN_MOCK = 350;

// ---- API ideal dari backend (untuk rekan kamu) ----
// POST /presensi/sesi          -> { sesiId, token, exp }
// GET  /presensi/sesi/:id      -> { siswa: [...], perSiswa: { id: status } }
// POST /presensi/scan          -> { ok, siswaId }  body scan (dari siswa)
// POST /jurnal-kelas           -> { id }  body jurnal

export async function buatSesiPresensi(kelas: string, mapel: string): Promise<SesiPresensi> {
	if (GunakanAPI) {
		// Nanti: return await api<SesiPresensi>('/presensi/sesi', {
		// 	method: 'POST',
		// 	body: { kelas, mapel }
		// });
	}

	await tunda(PENUNDAAN_MOCK);
	const sesiId = crypto.randomUUID();
	return {
		sesiId,
		token: buatToken(kelas, mapel),
		exp: Date.now() + TOKEN_TTL_DETIK * 1000
	};
}

export async function ambilDaftarSiswaKelas(): Promise<DaftarSiswaPayload> {
	if (GunakanAPI) {
		// Nanti: return await api<DaftarSiswaPayload>('/kelas/XII IPA 1/siswa', {
		// 	method: 'GET'
		// });
	}

	await tunda(PENUNDAAN_MOCK);
	const statusMap: Record<string, SiswaJurnal['status']> = {};
	for (const s of mockSiswaJurnal) statusMap[s.id] = s.status;
	return {
		siswa: mockSiswaJurnal.map(({ id, nis, nama }) => ({ id, nis, nama })),
		statusMap
	};
}

export async function catatScanQR(payload: ScanQRPayload): Promise<string> {
	if (GunakanAPI) {
		// Nanti: return await api<string>('/presensi/scan', {
		// 	method: 'POST',
		// 	body: payload
		// });
	}

	await tunda(PENUNDAAN_MOCK);
	return payload.siswaId;
}

export async function kirimJurnalKelas(body: {
	kelas: string;
	mataPelajaran: string;
	materi: string;
	catatan: string;
	tanggal: string;
	jamMulai: string;
	jamSelesai: string;
	totalHadir: number;
	absensi: Record<string, SiswaJurnal['status']>;
}): Promise<{ id: string }> {
	if (GunakanAPI) {
		// Nanti: return await api<{ id: string }>('/jurnal-kelas', {
		// 	method: 'POST',
		// 	body
		// });
	}

	await tunda(PENUNDAAN_MOCK);
	return { id: crypto.randomUUID() };
}

export function buatToken(kelas: string, mapel: string): string {
	const segmen = Math.floor(Date.now() / (TOKEN_TTL_DETIK * 1000));
	return `${kelas}|${mapel}|${segmen}`;
}

export function tunda(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}