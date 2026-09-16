import { browser } from '$app/environment';
import type { GuruAPI, PenggunaAPI } from '$lib/api/guru';

export interface SesiGuru {
	penggunaId: number;
	guruId: number;
	surel: string;
	namaLengkap: string;
	nip: string | null;
	nomorTelepon: string | null;
}

const KUNCI_SESI = 'sesi-guru-sekolah';

let sesi = $state<SesiGuru | null>(null);

export function bacaSesi(): SesiGuru | null {
	return sesi;
}

export function inisialisasiSesi() {
	if (!browser) return;
	try {
		const mentah = localStorage.getItem(KUNCI_SESI);
		sesi = mentah ? (JSON.parse(mentah) as SesiGuru) : null;
	} catch {
		sesi = null;
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

export function hapusSesi() {
	sesi = null;
	if (browser) localStorage.removeItem(KUNCI_SESI);
}

export function inisial(nama: string): string {
	const p = (nama ?? '').trim().split(/\s+/);
	return ((p[0]?.[0] ?? '') + (p[1]?.[0] ?? '')).toUpperCase();
}
