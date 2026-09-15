import { browser } from '$app/environment';
import type { GuruAPI, PenggunaAPI } from '$lib/api/guru';
import type { SiswaAPI } from '$lib/api/siswa';

export interface SesiGuru {
	penggunaId: number;
	guruId: number;
	surel: string;
	namaLengkap: string;
	nip: string | null;
	nomorTelepon: string | null;
}

export interface SesiSiswa {
	penggunaId: number;
	siswaId: number;
	surel: string;
	namaLengkap: string;
	nisn: string;
	kelasId: number | null;
}

const KUNCI_SESI = 'sesi-guru-sekolah';
const KUNCI_SESI_SISWA = 'sesi-siswa-sekolah';

let sesi = $state<SesiGuru | null>(null);
let sesiSiswa = $state<SesiSiswa | null>(null);

export function bacaSesi(): SesiGuru | null {
	return sesi;
}

export function bacaSesiSiswa(): SesiSiswa | null {
	return sesiSiswa;
}

export function inisialisasiSesi() {
	if (!browser) return;
	try {
		const mentah = localStorage.getItem(KUNCI_SESI);
		sesi = mentah ? (JSON.parse(mentah) as SesiGuru) : null;
		
		const mentahSiswa = localStorage.getItem(KUNCI_SESI_SISWA);
		sesiSiswa = mentahSiswa ? (JSON.parse(mentahSiswa) as SesiSiswa) : null;
	} catch {
		sesi = null;
		sesiSiswa = null;
	}
}

export function simpanSesi(pengguna: PenggunaAPI, guru: GuruAPI) {
	const baru: SesiGuru = {
		penggunaId: pengguna.id,
		guruId: guru.id,
		surel: pengguna.surel,
		namaLengkap: guru.namaLengkap,
		nip: guru.nip,
		nomorTelepon: guru.nomorTelepon
	};
	sesi = baru;
	if (browser) localStorage.setItem(KUNCI_SESI, JSON.stringify(baru));
}

export function simpanSesiSiswa(pengguna: PenggunaAPI, siswa: SiswaAPI) {
	const baru: SesiSiswa = {
		penggunaId: pengguna.id,
		siswaId: siswa.id,
		surel: pengguna.surel,
		namaLengkap: siswa.namaLengkap,
		nisn: siswa.nisn,
		kelasId: siswa.kelasId
	};
	sesiSiswa = baru;
	if (browser) localStorage.setItem(KUNCI_SESI_SISWA, JSON.stringify(baru));
}

export function hapusSesi() {
	sesi = null;
	if (browser) localStorage.removeItem(KUNCI_SESI);
}

export function hapusSesiSiswa() {
	sesiSiswa = null;
	if (browser) localStorage.removeItem(KUNCI_SESI_SISWA);
}

export function inisial(nama: string): string {
	const p = (nama ?? '').trim().split(/\s+/);
	return ((p[0]?.[0] ?? '') + (p[1]?.[0] ?? '')).toUpperCase();
}
