<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { ambilJadwalKelas, type JadwalPelajaranSiswaAPI } from '$lib/api/jadwal';
	import { ambilSiswa } from '$lib/api/siswa';
	import { ambilKelas } from '$lib/api/guru';
	import { bacaSesiSiswa } from '$lib/auth.svelte';
	import { hariJadwalSekarang, cariStatusSesi } from '$lib/api/jurnal';

	let sesi = $state(bacaSesiSiswa());
	let jadwalMingguan = $state<Record<number, JadwalPelajaranSiswaAPI[]>>({});
	let namaKelas = $state('Memuat...');
	let loading = $state(true);
	
	const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
	const hariIni = hariJadwalSekarang();

	onMount(async () => {
		if (sesi?.siswaId) {
			try {
				const s = await ambilSiswa(sesi.siswaId);
				if (s.kelasId) {
					const kData = await ambilKelas(s.kelasId);
					if (kData) namaKelas = kData.namaKelas;
					
					const jadwalSemua = await ambilJadwalKelas(s.kelasId);
					
					// Group by hari
					const grouped: Record<number, JadwalPelajaranSiswaAPI[]> = {};
					for (const j of jadwalSemua) {
						if (!grouped[j.hari]) grouped[j.hari] = [];
						grouped[j.hari].push(j);
					}
					jadwalMingguan = grouped;
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
</script>

<div class="space-y-4 p-4 pb-20 pt-4">
	<div class="flex items-center gap-3">
		<a
			href={resolve('/siswa/dashboard')}
			class="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white text-slate-500 shadow-sm transition-all active:translate-y-0.5 active:border-b-2"
		>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
				<path d="M15 18l-6-6 6-6" />
			</svg>
		</a>
		<div>
			<h1 class="text-xl font-black text-primary">Jadwal Kelas</h1>
			<p class="text-[11px] font-bold text-slate-500 uppercase">{namaKelas}</p>
		</div>
	</div>

	{#if loading}
		<div class="animate-pulse space-y-4">
			<div class="h-40 rounded-2xl bg-slate-200"></div>
			<div class="h-40 rounded-2xl bg-slate-200"></div>
		</div>
	{:else if Object.keys(jadwalMingguan).length === 0}
		<div class="rounded-3xl border-2 border-dashed border-slate-300 p-8 text-center mt-8">
			<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-8 w-8">
					<path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
				</svg>
			</div>
			<p class="text-sm font-bold text-slate-500">Belum ada jadwal tersimpan untuk kelas ini.</p>
		</div>
	{:else}
		{#each [1, 2, 3, 4, 5, 6] as hariNum}
			{#if jadwalMingguan[hariNum] && jadwalMingguan[hariNum].length > 0}
				<section class="rounded-2xl border-2 border-b-4 {hariIni === hariNum ? 'border-primary/20 border-b-primary/30' : 'border-[#E2E8F0] border-b-[#CBD5E1]'} bg-white overflow-hidden shadow-sm">
					<div class="{hariIni === hariNum ? 'bg-primary text-white' : 'bg-slate-50 border-b border-slate-100'} px-4 py-3 flex items-center justify-between">
						<h2 class="text-sm font-black flex items-center gap-2">
							{HARI[hariNum]}
							{#if hariIni === hariNum}
								<span class="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-black uppercase text-white">Hari Ini</span>
							{/if}
						</h2>
						<p class="text-[10px] font-bold {hariIni === hariNum ? 'text-white/70' : 'text-slate-400'}">{jadwalMingguan[hariNum].length} Mata Pelajaran</p>
					</div>
					
					<div class="p-4 space-y-3">
						{#each jadwalMingguan[hariNum] as j}
							{@const isToday = hariIni === hariNum}
							{@const statusSesi = isToday ? cariStatusSesi(
								{ hari: j.hari, jamMulai: j.jamMulai, jamSelesai: j.jamSelesai },
								new Date()
							) : 'belum'}
							{@const isFaded = isToday && statusSesi !== 'berjalan'}
							
							<div class="flex items-center gap-3 transition-opacity duration-300 {isFaded ? 'opacity-50 grayscale-[50%]' : ''}">
								<div class="flex w-14 flex-col items-center justify-center rounded-xl py-1.5 text-center {statusSesi === 'berjalan' ? 'bg-secondary/10' : 'bg-slate-100'}">
									<span class="text-xs font-black {statusSesi === 'berjalan' ? 'text-secondary' : 'text-slate-800'}">{j.jamMulai.slice(0, 5)}</span>
									<span class="text-[9px] font-bold {statusSesi === 'berjalan' ? 'text-secondary/70' : 'text-slate-400'}">{j.jamSelesai.slice(0, 5)}</span>
								</div>
								<div class="flex-1">
									<h4 class="text-sm font-bold text-slate-800">{j.mataPelajaran || 'Mapel'}</h4>
									<p class="text-xs font-medium text-slate-500">{j.guru || 'Guru'}</p>
								</div>
								{#if isToday}
									{#if statusSesi === 'selesai'}
										<div class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-500">Selesai</div>
									{:else if statusSesi === 'berjalan'}
										<div class="relative flex h-2 w-2">
											<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75"></span>
											<span class="relative inline-flex h-2 w-2 rounded-full bg-secondary"></span>
										</div>
									{/if}
								{/if}
							</div>
						{/each}
					</div>
				</section>
			{/if}
		{/each}
	{/if}
</div>
