import { api } from '$lib/api/client';
import type { GuruAPI, PenggunaAPI } from '$lib/api/guru';

export interface HasilLogin {
	pengguna: PenggunaAPI;
	guru: GuruAPI;
}

export async function masukGuru(surel: string, kataSandi: string): Promise<HasilLogin> {
	const semuaPengguna = await api<PenggunaAPI[]>('/pengguna');
	const pengguna = semuaPengguna.find(
		(p) => p.surel.trim().toLowerCase() === surel.trim().toLowerCase() && p.kataSandi === kataSandi
	);
	if (!pengguna) throw new Error('Surel atau kata sandi salah.');
	if (!pengguna.isAktif) throw new Error('Akun dinonaktifkan. Hubungi admin.');

	const semuaGuru = await api<GuruAPI[]>('/guru');
	const guru = semuaGuru.find((g) => g.penggunaId === pengguna.id);
	if (!guru) throw new Error('Akun ini tidak terdaftar sebagai guru.');

	return { pengguna, guru };
}
