import { api } from '$lib/api/client';
import { ambilPengguna, type GuruAPI, type PenggunaAPI } from '$lib/api/guru';
import { type SiswaAPI } from '$lib/api/siswa';

export interface HasilLoginGuru {
	pengguna: PenggunaAPI;
	guru: GuruAPI;
}

export interface HasilLoginSiswa {
	pengguna: PenggunaAPI;
	siswa: SiswaAPI;
}

export async function cariGuruByNip(nip: string): Promise<HasilLoginGuru> {
	const semuaGuru = await api<GuruAPI[]>('/guru');
	const guru = semuaGuru.find((g) => g.nip?.trim() === nip.trim());
	if (!guru) throw new Error('NIP tidak ditemukan.');
	const pengguna = await ambilPengguna(guru.penggunaId);
	if (!pengguna.isAktif) throw new Error('Akun dinonaktifkan. Hubungi admin.');
	return { pengguna, guru };
}

export async function cariSiswaByNisn(nisn: string): Promise<HasilLoginSiswa> {
	const semuaSiswa = await api<SiswaAPI[]>('/siswa');
	const siswa = semuaSiswa.find((s) => s.nisn?.trim() === nisn.trim());
	if (!siswa) throw new Error('NISN tidak ditemukan.');
	const pengguna = await ambilPengguna(siswa.penggunaId);
	if (!pengguna.isAktif) throw new Error('Akun dinonaktifkan. Hubungi admin.');
	return { pengguna, siswa };
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
