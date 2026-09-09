<script lang="ts">
	let nama = 'Ahmad Fauzi';

	const statistik = [
		{
			label: 'Total Siswa',
			value: '450',
			sub: '+5% bln ini',
			icon: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4m7 0a4 4 0 11-4-4M3 20a4 4 0 016 0',
			bg: 'bg-primary',
			border: 'border-primary/80',
			badge: 'bg-primary/15 text-primary'
		},
		{
			label: 'Guru & Staf',
			value: '32',
			sub: 'Tetap',
			icon: 'M22 10L12 5 2 10l10 5 10-5zM6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5',
			bg: 'bg-secondary',
			border: 'border-secondary/80',
			badge: 'bg-secondary/15 text-secondary'
		},
		{
			label: 'Rombel / Kelas',
			value: '12',
			sub: 'Aktif',
			icon: 'M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10',
			bg: 'bg-tertiary',
			border: 'border-tertiary/80',
			badge: 'bg-tertiary/15 text-tertiary'
		},
		{
			label: 'Pendaftar Baru',
			value: '18',
			sub: 'Perlu Verifikasi',
			icon: 'M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z',
			bg: 'bg-neutral-custom',
			border: 'border-neutral-custom/80',
			badge: 'bg-neutral-custom/15 text-neutral-custom'
		}
	];

	const aksesCepat = [
		{
			href: '/guru/jurnal',
			label: 'Mulai Absensi',
			desc: 'Buka halaman presensi QR',
			bg: 'bg-secondary',
			border: 'border-secondary/80',
			ikon: 'M9 12h6m-6 4h6m2 6H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
		},
		{
			href: '/guru/poin',
			label: 'Input Poin',
			desc: 'Catat poin prestasi / pelanggaran',
			bg: 'bg-primary',
			border: 'border-primary/80',
			ikon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
		}
	];

	const pengumuman = [
		{ id: 1, judul: 'Rapat Evaluasi Semester', tanggal: '08 Sep 2026', kategori: 'Penting' },
		{ id: 2, judul: 'Ujian Tengah Semester Gasal', tanggal: '15 Sep 2026', kategori: 'Akademik' },
		{ id: 3, judul: 'Pendaftaran Ekstrakurikuler', tanggal: '20 Sep 2026', kategori: 'Kegiatan' }
	];
</script>

<div class="space-y-5 px-4">
	<!-- Greeting -->
	<div class="flex items-center gap-3 pt-1">
		<div
			class="flex h-14 w-14 items-center justify-center rounded-2xl border-b-4 border-primary/90 bg-primary text-white shadow-md"
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="h-7 w-7"
			>
				<path d="M22 10L12 5 2 10l10 5 10-5z" />
				<path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
				<path d="M22 10v6" />
			</svg>
		</div>
		<div>
			<h1 class="text-xl font-black text-primary">Selamat datang, {nama}!</h1>
			<p class="text-xs font-medium text-slate-500">Ringkasan sekolah hari ini.</p>
		</div>
	</div>

	<!-- Statistik (4 kartu ala Duolingo) -->
	<div class="grid grid-cols-2 gap-3">
		{#each statistik as s}
			<div class="rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm">
				<span
					class="flex h-9 w-9 items-center justify-center rounded-xl {s.bg} text-white shadow-sm"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="h-5 w-5"
					>
						<path d={s.icon} />
					</svg>
				</span>
				<p class="mt-2 text-2xl font-black text-slate-800">{s.value}</p>
				<p class="text-xs font-bold text-slate-500">{s.label}</p>
				<span class="mt-1 inline-block rounded-lg px-2.5 py-1 text-[10px] font-black {s.badge}">
					{s.sub}
				</span>
			</div>
		{/each}
	</div>

	<!-- Aksi Singkat: tombol 3D ala Duolingo -->
	<h2 class="pt-1 text-base font-black text-primary">Aksi Cepat</h2>
	<div class="grid grid-cols-2 gap-3">
		{#each aksesCepat as a}
			<a
				href={a.href}
				class="flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-b-8 {a.bg} {a.border} px-4 py-5 text-center text-white transition-all duration-150 hover:brightness-105 active:translate-y-1 active:border-b-4"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="mb-1 h-7 w-7"
				>
					<path d={a.ikon} />
				</svg>
				<span class="text-base font-black leading-tight">{a.label}</span>
				<span class="text-[10px] font-bold opacity-80">{a.desc}</span>
			</a>
		{/each}
	</div>

	<!-- Pengumuman -->
	<div class="rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm">
		<h2 class="mb-2 text-base font-black text-primary">Agenda & Pengumuman</h2>
		<div class="divide-y divide-slate-100">
			{#each pengumuman as item}
				<div class="flex items-start justify-between gap-3 py-3">
					<div class="min-w-0">
						<p class="truncate text-sm font-bold text-slate-700">{item.judul}</p>
						<p class="mt-0.5 text-xs font-medium text-slate-400">{item.tanggal}</p>
					</div>
					<span
						class="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black {item.kategori === 'Penting'
							? 'bg-primary/15 text-primary'
							: item.kategori === 'Akademik'
								? 'bg-secondary/15 text-secondary'
								: 'bg-tertiary/15 text-tertiary'}"
					>
						{item.kategori}
					</span>
				</div>
			{/each}
		</div>
	</div>
</div>