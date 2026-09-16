<script lang="ts">
	import { bacaSesiSiswa, hapusSesiSiswa, inisial } from '$lib/auth.svelte';
	import { onMount } from 'svelte';
	import { ambilJadwalKelas, type JadwalPelajaranSiswaAPI } from '$lib/api/jadwal';
	import { ambilSiswa } from '$lib/api/siswa';
	import { ambilKelas } from '$lib/api/guru';
	import { hariJadwalSekarang, cariStatusSesi } from '$lib/api/jurnal';

	let sesi = $state(bacaSesiSiswa());
	let jadwalHariIni = $state<JadwalPelajaranSiswaAPI[]>([]);
	let namaKelas = $state('Memuat...');
	let loading = $state(true);

	onMount(async () => {
		if (sesi?.siswaId) {
			try {
				const s = await ambilSiswa(sesi.siswaId);
				if (s.kelasId) {
					const kData = await ambilKelas(s.kelasId);
					if (kData) namaKelas = kData.namaKelas;
					
					const jadwalSemua = await ambilJadwalKelas(s.kelasId);
					const hariIni = hariJadwalSekarang();
					jadwalHariIni = jadwalSemua.filter((j) => j.hari === hariIni);
				} else {
					namaKelas = 'Belum ada kelas';
				}
			} catch (e) {
				console.error(e);
				namaKelas = 'Gagal memuat';
			} finally {
				loading = false;
			}
		} else {
			loading = false;
		}
	});

	function keluar() {
		hapusSesiSiswa();
		window.location.href = '/login-siswa';
	}
</script>

<main class="space-y-4 p-4 pb-20 pt-4">
	<!-- Hero / Kartu Pelajar Digital -->
	<section class="overflow-hidden rounded-3xl border-b-4 border-b-[#12243f] bg-gradient-to-br from-primary to-primary/90 p-5 text-white shadow-lg shadow-primary/20">
		<div class="flex items-center justify-between">
			<div>
				<h2 class="text-xs font-bold text-white/70">Kartu Pelajar Digital</h2>
				<p class="text-xl font-black">{sesi?.namaLengkap}</p>
				<p class="mt-1 text-sm font-medium text-secondary">{namaKelas}</p>
			</div>
			<!-- QR Placeholder -->
			<div class="flex h-20 w-20 flex-col items-center justify-center rounded-xl bg-white p-2 shadow-inner">
				<svg viewBox="0 0 24 24" fill="none" stroke="#1a365d" stroke-width="2" class="h-10 w-10 opacity-50">
					<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
					<rect x="7" y="7" width="3" height="3"/>
					<rect x="14" y="7" width="3" height="3"/>
					<rect x="7" y="14" width="3" height="3"/>
					<rect x="14" y="14" width="3" height="3"/>
				</svg>
				<span class="mt-1 text-[8px] font-bold text-slate-400 uppercase">Ketuk untuk Scan</span>
			</div>
		</div>
	</section>

	<div class="grid grid-cols-2 gap-4">
		<!-- Ringkasan Kehadiran -->
		<div class="rounded-2xl border-2 border-b-4 border-slate-200 border-b-slate-300 bg-white p-4">
			<div class="flex items-center gap-2">
				<div class="rounded-lg bg-emerald-100 p-2 text-emerald-600">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="h-4 w-4">
						<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
						<polyline points="22 4 12 14.01 9 11.01" />
					</svg>
				</div>
				<h3 class="text-xs font-bold text-slate-500">Kehadiran</h3>
			</div>
			<div class="mt-3">
				<p class="text-2xl font-black text-slate-800">100<span class="text-sm font-bold text-slate-400">%</span></p>
				<p class="text-[10px] font-bold text-emerald-600">Hadir hari ini</p>
			</div>
		</div>

		<!-- Ringkasan Poin -->
		<div class="rounded-2xl border-2 border-b-4 border-slate-200 border-b-slate-300 bg-white p-4">
			<div class="flex items-center gap-2">
				<div class="rounded-lg bg-amber-100 p-2 text-amber-600">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="h-4 w-4">
						<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
					</svg>
				</div>
				<h3 class="text-xs font-bold text-slate-500">Total Poin</h3>
			</div>
			<div class="mt-3">
				<p class="text-2xl font-black text-slate-800">150</p>
				<p class="text-[10px] font-bold text-slate-400">Poin Prestasi</p>
			</div>
		</div>
	</div>

	<!-- Jadwal Pelajaran -->
	<section class="rounded-2xl border-2 border-b-4 border-slate-200 border-b-slate-300 bg-white p-4">
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-sm font-bold text-slate-800">Jadwal Hari Ini</h2>
			<a href="/siswa/jadwal" class="text-[10px] font-black text-secondary uppercase hover:underline">Lihat Semua</a>
		</div>
		<div class="space-y-3">
			{#if loading}
				<div class="animate-pulse space-y-3">
					<div class="h-14 rounded-xl bg-slate-100"></div>
					<div class="h-14 rounded-xl bg-slate-100"></div>
				</div>
			{:else if jadwalHariIni.length === 0}
				<div class="rounded-xl border-2 border-dashed border-slate-200 p-4 text-center">
					<p class="text-xs font-bold text-slate-400">Tidak ada jadwal hari ini</p>
				</div>
			{:else}
				{#each jadwalHariIni as j}
					{@const statusSesi = cariStatusSesi(
						{ hari: j.hari, jamMulai: j.jamMulai, jamSelesai: j.jamSelesai },
						new Date()
					)}
					<div 
						class="flex items-center gap-3 transition-opacity duration-300 {statusSesi !== 'berjalan' ? 'opacity-50 grayscale-[50%]' : ''}"
					>
						<div class="flex w-14 flex-col items-center justify-center rounded-xl py-1.5 text-center {statusSesi === 'berjalan' ? 'bg-secondary/10' : 'bg-slate-100'}">
							<span class="text-xs font-black {statusSesi === 'berjalan' ? 'text-secondary' : 'text-slate-800'}">{j.jamMulai.slice(0, 5)}</span>
							<span class="text-[9px] font-bold {statusSesi === 'berjalan' ? 'text-secondary/70' : 'text-slate-400'}">{j.jamSelesai.slice(0, 5)}</span>
						</div>
						<div class="flex-1">
							<h4 class="text-sm font-bold text-slate-800">{j.mataPelajaran || 'Mapel'}</h4>
							<p class="text-xs font-medium text-slate-500">{j.guru || 'Guru'}</p>
						</div>
						{#if statusSesi === 'selesai'}
							<div class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-500">Selesai</div>
						{:else if statusSesi === 'berjalan'}
							<div class="relative flex h-2 w-2">
								<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75"></span>
								<span class="relative inline-flex h-2 w-2 rounded-full bg-secondary"></span>
							</div>
						{/if}
					</div>
				{/each}
			{/if}
		</div>
	</section>
</main>
