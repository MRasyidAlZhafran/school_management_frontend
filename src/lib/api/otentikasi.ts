import { api } from '$lib/api/client';
import { ambilPengguna, type GuruAPI, type PenggunaAPI } from '$lib/api/guru';

export interface HasilLogin {
	pengguna: PenggunaAPI;
	guru: GuruAPI;
}

export async function cariGuruByNip(nip: string): Promise<HasilLogin> {
	const semuaGuru = await api<GuruAPI[]>('/guru');
	const guru = semuaGuru.find((g) => g.nip?.trim() === nip.trim());
	if (!guru) throw new Error('NIP tidak ditemukan.');
	const pengguna = await ambilPengguna(guru.penggunaId);
	if (!pengguna.isAktif) throw new Error('Akun dinonaktifkan. Hubungi admin.');
	return { pengguna, guru };
}

export function butuhAturSandi(pengguna: PenggunaAPI): boolean {
	return !pengguna.kataSandi || pengguna.kataSandi.trim() === '';
}

export function verifikasiSandi(pengguna: PenggunaAPI, kataSandi: string) {
	if (pengguna.kataSandi !== kataSandi) throw new Error('Kata sandi salah.');
}

export function aturSandiBaru(penggunaId: number, kataSandi: string): Promise<PenggunaAPI> {
	return api<PenggunaAPI>(`/pengguna/${penggunaId}`, { method: 'PATCH', body: { kataSandi } });
}
