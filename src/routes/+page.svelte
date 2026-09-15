<script lang="ts">
	import { resolve } from '$app/paths';
	import { aturAnakAktif, bacaSesi } from '$lib/auth.svelte';
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import {
		absensiHarianMock,
		absensiPelajaranMock,
		daftarAnakDemo,
		poinMock,
		type StatusSiswa
	} from '$lib/data/mock-ortu';

	const sesiAktif = $derived(bacaSesi());
	const role = $derived(sesiAktif?.role ?? 'guru');

	function fmtHari(tanggal: string): string {
		return new Date(`${tanggal}T00:00:00`).toLocaleDateString('id-ID', {
			weekday: 'long',
			day: 'numeric',
			month: 'long'
		});
	}

	// ============================================================
	// Data ortu (SEMENTARA — dari mock, bukan API)
	// ============================================================
	const anakAktif = $derived(
		sesiAktif?.daftarAnak?.find((a) => a.siswaId === sesiAktif.anakAktifId) ??
			sesiAktif?.daftarAnak?.[0]
	);
	const todayIso = new Date().toISOString().slice(0, 10);
	const kehadiranHariIni = $derived(
		absensiHarianMock.find((x) => x.siswaId === anakAktif?.siswaId && x.tanggal === todayIso)
	);
	const pelajaranHariIni = $derived(
		absensiPelajaranMock
			.filter((x) => x.siswaId === anakAktif?.siswaId && x.tanggal === todayIso)
			.map((x) => x.mapel)
			.join(', ') || 'Tidak ada jadwal'
	);
	const poinAnak = $derived(poinMock.filter((p) => p.siswaId === anakAktif?.siswaId));
	const totalPoin = $derived(poinAnak.reduce((acc, p) => acc + p.bobot, 0));
	const poinTerakhir = $derived(
		[...poinAnak].sort((a, b) => b.tanggal.localeCompare(a.tanggal))[0]
	);

	const labelStatus: Record<StatusSiswa, string> = {
		hadir: 'Hadir',
		izin: 'Izin',
		sakit: 'Sakit',
		alpa: 'Alpa'
	};
	const badgeStatus: Record<StatusSiswa, string> = {
		hadir: 'border-emerald-300 bg-emerald-100 text-emerald-700',
		izin: 'border-amber-300 bg-amber-100 text-amber-700',
		sakit: 'border-blue-300 bg-blue-100 text-blue-700',
		alpa: 'border-rose-300 bg-rose-100 text-rose-700'
	};

	const pengumuman = [
		{ id: 1, judul: 'Rapat Evaluasi Semester', tanggal: '08 Sep 2026', kategori: 'Penting' },
		{ id: 2, judul: 'Ujian Tengah Semester Gasal', tanggal: '15 Sep 2026', kategori: 'Akademik' },
		{ id: 3, judul: 'Iuran Komite Bulan Ini', tanggal: '20 Sep 2026', kategori: 'Kegiatan' }
	];

	// ============================================================
	// Data guru (dashboards statis seperti sebelumnya)
	// ============================================================
	const namaGuru = $derived(bacaSesi()?.namaLengkap ?? 'Guru');
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
	const aksesCepat: {
		href: '/guru/jurnal' | '/guru/poin';
		label: string;
		desc: string;
		bg: string;
		border: string;
		ikon: string;
	}[] = [
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
</script>

{#if role === 'ortu'}
	<div class="space-y-5 px-4">
		<!-- ============ Banner Mode Demo (SEMENTARA) ============ -->
		<div
			class="flex items-center gap-2 rounded-2xl border-2 border-b-4 border-[#4F2E00]/30 border-b-[#4F2E00]/50 bg-tertiary/10 px-4 py-2.5 text-[11px] font-bold text-tertiary"
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="h-4 w-4 shrink-0"
			>
				<circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
			</svg>
			Mode Demo Orang Tua — data contoh, bukan data asli.
		</div>

		<!-- ============ Sapaan Ortu ============ -->
		<div class="flex items-center gap-3 pt-1">
			<Avatar nama={anakAktif?.namaLengkap ?? ''} size="lg" />
			<div class="min-w-0">
				<h1 class="truncate text-xl font-black text-primary">
					Halo, {bacaSesi()?.namaLengkap ?? 'Orang Tua'}!
				</h1>
				<p class="truncate text-xs font-medium text-slate-500">
					Pantau perkembangan {anakAktif?.namaLengkap ?? 'anak'} hari ini.
				</p>
			</div>
		</div>

		<!-- ============ Pilih Anak ============ -->
		{#if (daftarAnakDemo.length ?? 0) > 1}
			<div class="flex gap-2 overflow-x-auto pb-1">
				{#each daftarAnakDemo as anak (anak.siswaId)}
					<button
						type="button"
						onclick={() => aturAnakAktif(anak.siswaId)}
						class="shrink-0 rounded-xl border-2 border-b-4 px-3 py-2 text-xs font-black transition active:translate-y-0.5 active:border-b-2 {anak.siswaId ===
						anakAktif?.siswaId
							? 'border-secondary border-b-[#1f8ba3] bg-secondary text-white'
							: 'border-slate-200 border-b-slate-300 bg-white text-slate-500'}"
					>
						{anak.namaLengkap}
					</button>
				{/each}
			</div>
		{/if}

		<!-- ============ Kartu Anak ============ -->
		<div
			class="rounded-3xl border-b-4 border-b-[#12243f] bg-gradient-to-br from-primary to-primary/90 p-5 text-white shadow-lg shadow-primary/20"
		>
			<p class="text-[11px] font-black tracking-widest text-white/60 uppercase">Anak Terpilih</p>
			<div class="mt-2 flex items-center gap-3">
				<Avatar nama={anakAktif?.namaLengkap ?? ''} size="md" />
				<div class="min-w-0">
					<h2 class="truncate text-lg font-black">{anakAktif?.namaLengkap ?? '-'}</h2>
					<p class="text-xs text-white/70">
						{anakAktif?.kelas ?? '-'} · NISN {anakAktif?.nisn ?? '-'}
					</p>
				</div>
			</div>
			<div class="mt-4 grid grid-cols-2 gap-2">
				<div class="rounded-xl border-b-4 border-b-white/15 bg-white/10 p-2.5 text-center">
					<p class="text-xs font-bold text-white/60">Hari Ini</p>
					<p class="text-sm font-black">
						{kehadiranHariIni ? labelStatus[kehadiranHariIni.status] : 'Belum Ada Data'}
					</p>
					<p class="text-[10px] font-medium text-white/50">{fmtHari(todayIso)}</p>
				</div>
				<div class="rounded-xl border-b-4 border-b-white/15 bg-white/10 p-2.5 text-center">
					<p class="text-xs font-bold text-white/60">Total Poin</p>
					<p class="text-sm font-black">{totalPoin > 0 ? `+${totalPoin}` : totalPoin}</p>
					<p class="text-[10px] font-medium text-white/50">dari {poinAnak.length} catatan</p>
				</div>
			</div>
		</div>

		<!-- ============ Ringkasan ============ -->
		<h2 class="pt-1 text-base font-black text-primary">Ringkasan</h2>
		<div class="space-y-3">
			<div
				class="rounded-2xl border-2 border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white p-4 shadow-sm"
			>
				<div class="flex items-center justify-between gap-2">
					<div class="min-w-0">
						<p class="text-xs font-bold text-slate-400">Kehadiran hari ini</p>
						<p class="truncate text-sm font-extrabold text-slate-800">
							{pelajaranHariIni}
						</p>
					</div>
					{#if kehadiranHariIni}
						<span
							class="shrink-0 rounded-full border-2 border-b-2 px-2.5 py-1 text-xs font-black {badgeStatus[
								kehadiranHariIni.status
							]}"
						>
							{labelStatus[kehadiranHariIni.status]}
						</span>
					{/if}
				</div>
			</div>

			{#if poinTerakhir}
				<div
					class="rounded-2xl border-2 border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white p-4 shadow-sm"
				>
					<p class="text-xs font-bold text-slate-400">
						Poin terakhir · {fmtHari(poinTerakhir.tanggal)}
					</p>
					<div class="mt-1 flex items-center gap-2">
						<span
							class="shrink-0 rounded-lg border-2 border-b-2 px-2 py-0.5 text-xs font-black {poinTerakhir.jenis ===
							'positif'
								? 'border-emerald-300 bg-emerald-100 text-emerald-700'
								: 'border-rose-300 bg-rose-100 text-rose-700'}"
						>
							{poinTerakhir.bobot > 0 ? `+${poinTerakhir.bobot}` : poinTerakhir.bobot}
						</span>
						<p class="min-w-0 flex-1 truncate text-sm font-bold text-slate-700">
							{poinTerakhir.kategori} — {poinTerakhir.deskripsi}
						</p>
					</div>
				</div>
			{/if}

			<div
				class="rounded-2xl border-2 border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white p-4 shadow-sm"
			>
				<p class="text-xs font-bold text-slate-400">Info singkat</p>
				<p class="mt-1 text-sm font-bold text-slate-700">
					Materi lengkap tiap pelajaran bisa dilihat di halaman Pembelajaran.
				</p>
			</div>
		</div>

		<!-- ============ Akses Cepat Ortu ============ -->
		<h2 class="pt-1 text-base font-black text-primary">Akses Cepat</h2>
		<div class="grid grid-cols-2 gap-3">
			<a
				href={resolve('/ortu/jurnal')}
				class="flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-b-8 border-secondary/80 bg-secondary px-4 py-5 text-center text-white transition-all duration-150 active:translate-y-1 active:border-b-4"
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
					<path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
				</svg>
				<span class="text-base leading-tight font-black">Pembelajaran</span>
				<span class="text-[10px] font-bold opacity-80">Materi & catatan kelas</span>
			</a>
			<a
				href={resolve('/ortu/absensi')}
				class="flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-b-8 border-primary/80 bg-primary px-4 py-5 text-center text-white transition-all duration-150 active:translate-y-1 active:border-b-4"
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
					<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
				</svg>
				<span class="text-base leading-tight font-black">Kehadiran</span>
				<span class="text-[10px] font-bold opacity-80">Rekap harian & per mapel</span>
			</a>
		</div>

		<!-- ============ Pengumuman ============ -->
		<div class="rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm">
			<h2 class="mb-2 text-base font-black text-primary">Agenda & Pengumuman</h2>
			<div class="divide-y divide-slate-100">
				{#each pengumuman as item (item.id)}
					<div class="flex items-start justify-between gap-3 py-3">
						<div class="min-w-0">
							<p class="truncate text-sm font-bold text-slate-700">{item.judul}</p>
							<p class="mt-0.5 text-xs font-medium text-slate-400">{item.tanggal}</p>
						</div>
						<span
							class="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black {item.kategori ===
							'Penting'
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
{:else}
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
				<h1 class="text-xl font-black text-primary">Selamat datang, {namaGuru}!</h1>
				<p class="text-xs font-medium text-slate-500">Ringkasan sekolah hari ini.</p>
			</div>
		</div>

		<!-- Statistik (4 kartu ala Duolingo) -->
		<div class="grid grid-cols-2 gap-3">
			{#each statistik as s (s.label)}
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
			{#each aksesCepat as a (a.href)}
				<a
					href={resolve(a.href)}
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
					<span class="text-base leading-tight font-black">{a.label}</span>
					<span class="text-[10px] font-bold opacity-80">{a.desc}</span>
				</a>
			{/each}
		</div>

		<!-- Pengumuman -->
		<div class="rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm">
			<h2 class="mb-2 text-base font-black text-primary">Agenda & Pengumuman</h2>
			<div class="divide-y divide-slate-100">
				{#each pengumuman as item (item.id)}
					<div class="flex items-start justify-between gap-3 py-3">
						<div class="min-w-0">
							<p class="truncate text-sm font-bold text-slate-700">{item.judul}</p>
							<p class="mt-0.5 text-xs font-medium text-slate-400">{item.tanggal}</p>
						</div>
						<span
							class="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black {item.kategori ===
							'Penting'
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
{/if}
