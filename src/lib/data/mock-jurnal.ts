export type StatusPresensi = 'hadir' | 'izin' | 'sakit' | 'alpa' | 'belum';

export interface SiswaJurnal {
	id: string;
	nis: string;
	nama: string;
	status: StatusPresensi;
}

export const daftarKelas = ['X', 'XI IPA 1', 'XI IPA 2', 'XII IPA 1', 'XII IPS 1'];

export const daftarMapel = [
	'Matematika',
	'Bahasa Indonesia',
	'Fisika',
	'Kimia',
	'Biologi',
	'Sejarah'
];

export const pilihanStatus: { value: Exclude<StatusPresensi, 'belum'>; label: string; icon: string }[] = [
	{ value: 'hadir', label: 'Hadir', icon: 'M5 13l4 4L19 7' },
	{ value: 'izin', label: 'Izin', icon: 'M12 11c0-1 .5-2 2-2s2 1 2 2c0 .8-.4 1.3-1 1.8-.6.4-1 1-1 1.7' },
	{ value: 'sakit', label: 'Sakit', icon: 'M12 6v6l4 2' },
	{ value: 'alpa', label: 'Alpa', icon: 'M6 6l12 12M18 6L6 18' }
];

export const warnaStatusSegmen: Record<
	Exclude<StatusPresensi, 'belum'>,
	{ aktif: string; inaktif: string }
> = {
	hadir: {
		aktif: 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-emerald-200',
		inaktif: 'border-transparent text-slate-400 hover:text-slate-600'
	},
	izin: {
		aktif: 'bg-amber-50 text-amber-700 border-amber-300 shadow-amber-200',
		inaktif: 'border-transparent text-slate-400 hover:text-slate-600'
	},
	sakit: {
		aktif: 'bg-blue-50 text-blue-700 border-blue-300 shadow-blue-200',
		inaktif: 'border-transparent text-slate-400 hover:text-slate-600'
	},
	alpa: {
		aktif: 'bg-rose-50 text-rose-700 border-rose-300 shadow-rose-200',
		inaktif: 'border-transparent text-slate-400 hover:text-slate-600'
	}
};

export const warnaRekap: Record<Exclude<StatusPresensi, 'belum'>, string> = {
	hadir: 'bg-emerald-100 text-emerald-700',
	izin: 'bg-amber-100 text-amber-700',
	sakit: 'bg-blue-100 text-blue-700',
	alpa: 'bg-rose-100 text-rose-700'
};

export const warnaAvatar = [
	'bg-emerald-100 text-emerald-700',
	'bg-amber-100 text-amber-700',
	'bg-sky-100 text-sky-700',
	'bg-violet-100 text-violet-700',
	'bg-rose-100 text-rose-700',
	'bg-teal-100 text-teal-700',
	'bg-indigo-100 text-indigo-700',
	'bg-fuchsia-100 text-fuchsia-700'
];

export const mockSiswaJurnal: SiswaJurnal[] = [
	{ id: 's1', nis: '20240101', nama: 'Ahmad Fauzi', status: 'belum' },
	{ id: 's2', nis: '20240102', nama: 'Bunga Citra Lestari', status: 'belum' },
	{ id: 's3', nis: '20240103', nama: 'Citra Kirana', status: 'belum' },
	{ id: 's4', nis: '20240104', nama: 'Dewi Lestari', status: 'belum' },
	{ id: 's5', nis: '20240105', nama: 'Eko Prasetyo', status: 'belum' },
	{ id: 's6', nis: '20240106', nama: 'Farhan Maulana', status: 'belum' },
	{ id: 's7', nis: '20240107', nama: 'Galih Pratama', status: 'belum' },
	{ id: 's8', nis: '20240108', nama: 'Intan Permata', status: 'belum' }
];
