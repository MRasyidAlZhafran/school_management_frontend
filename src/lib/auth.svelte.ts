import { browser } from '$app/environment';
import { sesiOrtuDemo } from '$lib/data/mock-ortu';
import type { GuruAPI, PenggunaAPI } from '$lib/api/guru';

export interface SesiAnak {
	siswaId: number;
	nisn: string;
	namaLengkap: string;
	kelas: string;
	tingkat: number;
}

export type PeranSesi = 'guru' | 'ortu';

export interface Sesi {
	role: PeranSesi;
	penggunaId: number;
	surel: string;
	namaLengkap: string;
	// Guru
	guruId?: number;
	nip?: string | null;
	// Bersama
	nomorTelepon?: string | null;
	// Orang tua
	orangTuaId?: number;
	daftarAnak?: SesiAnak[];
	anakAktifId?: number | null;
}

const KUNCI_SESI = 'sesi-sekolah';
const KUNCI_SESI_LAMA = 'sesi-guru-sekolah';
const KUNCI_CADANGAN = 'sesi-guru-cadangan';

let sesi = $state<Sesi | null>(null);

function tulisSesi(baru: Sesi) {
	sesi = baru;
	if (browser) localStorage.setItem(KUNCI_SESI, JSON.stringify(baru));
}

export function bacaSesi(): Sesi | null {
	return sesi;
}

export function inisialisasiSesi() {
	if (!browser) return;
	try {
		const mentah = localStorage.getItem(KUNCI_SESI) ?? localStorage.getItem(KUNCI_SESI_LAMA);
		if (!mentah) {
			sesi = null;
			return;
		}
		const data = JSON.parse(mentah) as Partial<Sesi>;
		sesi = {
			role: data.role ?? 'guru',
			penggunaId: data.penggunaId ?? 0,
			surel: data.surel ?? '',
			namaLengkap: data.namaLengkap ?? '',
			guruId: data.guruId,
			nip: data.nip,
			nomorTelepon: data.nomorTelepon,
			orangTuaId: data.orangTuaId,
			daftarAnak: data.daftarAnak,
			anakAktifId: data.anakAktifId ?? null
		};
	} catch {
		sesi = null;
	}
}

export function simpanSesi(pengguna: PenggunaAPI, guru: GuruAPI) {
	tulisSesi({
		role: 'guru',
		penggunaId: pengguna.id,
		guruId: guru.id,
		surel: pengguna.surel,
		namaLengkap: guru.namaLengkap,
		nip: guru.nip,
		nomorTelepon: guru.nomorTelepon
	});
}

export function hapusSesi() {
	sesi = null;
	if (browser) localStorage.removeItem(KUNCI_SESI);
}

export function aturAnakAktif(siswaId: number) {
	const s = bacaSesi();
	if (!s) return;
	tulisSesi({ ...s, anakAktifId: siswaId });
}

// SEMENTARA — toggle preview role ortu. Hapus saat login/siswa dari rekan sudah masuk.
export function masukDemoOrtu() {
	const s = bacaSesi();
	if (browser && s) localStorage.setItem(KUNCI_CADANGAN, JSON.stringify(s));
	tulisSesi(sesiOrtuDemo);
}

export function kembaliDariDemoOrtu() {
	if (!browser) return;
	const mentah = localStorage.getItem(KUNCI_CADANGAN);
	localStorage.removeItem(KUNCI_CADANGAN);
	if (mentah) {
		try {
			const data = JSON.parse(mentah) as Partial<Sesi>;
			if (data.role) {
				tulisSesi(data as Sesi);
				return;
			}
		} catch {
			/* cadangan rusak — lanjut logout */
		}
	}
	hapusSesi();
}

export function inisial(nama: string): string {
	const p = (nama ?? '').trim().split(/\s+/);
	return ((p[0]?.[0] ?? '') + (p[1]?.[0] ?? '')).toUpperCase();
}
