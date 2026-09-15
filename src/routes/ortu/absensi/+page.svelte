<script lang="ts">
	import { bacaSesi } from '$lib/auth.svelte';
	import { absensiHarianMock, absensiPelajaranMock, type StatusSiswa } from '$lib/data/mock-ortu';

	type Segmen = 'harian' | 'pelajaran';

	let segmen = $state<Segmen>('harian');
	let filterTanggal = $state('');

	const sesiAktif = $derived(bacaSesi());
	const anakAktif = $derived(
		sesiAktif?.daftarAnak?.find((a) => a.siswaId === sesiAktif.anakAktifId) ??
			sesiAktif?.daftarAnak?.[0]
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
	const metodeLabel: Record<string, string> = {
		qr: 'QR',
		kartu: 'Kartu',
		manual: 'Input Guru'
	};

	function fmtHari(tanggal: string): string {
		return new Date(`${tanggal}T00:00:00`).toLocaleDateString('id-ID', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	const harian = $derived(
		absensiHarianMock
			.filter((x) => x.siswaId === anakAktif?.siswaId)
			.filter((x) => !filterTanggal || x.tanggal === filterTanggal)
			.sort((a, b) => b.tanggal.localeCompare(a.tanggal))
	);
	const pelajaran = $derived(
		absensiPelajaranMock
			.filter((x) => x.siswaId === anakAktif?.siswaId)
			.filter((x) => !filterTanggal || x.tanggal === filterTanggal)
			.sort((a, b) => b.tanggal.localeCompare(a.tanggal))
	);
	const hadirTotal = $derived(harian.filter((x) => x.status === 'hadir').length);
</script>

<div class="space-y-4 px-4 pb-2">
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
		Mode Demo — data contoh.
	</div>

	<!-- ============ Header ============ -->
	<div
		class="rounded-3xl border-b-4 border-b-[#12243f] bg-gradient-to-br from-primary to-primary/90 p-5 text-white shadow-lg shadow-primary/20"
	>
		<p class="text-[11px] font-black tracking-widest text-white/60 uppercase">
			Kehadiran {anakAktif?.namaLengkap ?? ''}
		</p>
		<h1 class="mt-1 text-lg font-black">Rekap Kehadiran</h1>
		<div class="mt-3 grid grid-cols-3 gap-2 text-center">
			<div class="rounded-xl border-b-4 border-b-white/15 bg-white/10 p-2">
				<p class="text-[10px] font-bold text-white/60">Hadir</p>
				<p class="text-sm font-extrabold">{hadirTotal}</p>
			</div>
			<div class="rounded-xl border-b-4 border-b-white/15 bg-white/10 p-2">
				<p class="text-[10px] font-bold text-white/60">Terlambat (izin)</p>
				<p class="text-sm font-extrabold">{harian.filter((x) => x.status === 'izin').length}</p>
			</div>
			<div class="rounded-xl border-b-4 border-b-white/15 bg-white/10 p-2">
				<p class="text-[10px] font-bold text-white/60">Tidak Hadir</p>
				<p class="text-sm font-extrabold">{harian.filter((x) => x.status !== 'hadir').length}</p>
			</div>
		</div>
	</div>

	<!-- ============ Segmen ============ -->
	<div class="grid grid-cols-2 gap-2">
		<button
			type="button"
			onclick={() => (segmen = 'harian')}
			class="rounded-xl border-2 border-b-4 py-2 text-xs font-black transition active:translate-y-0.5 active:border-b-2 {segmen ===
			'harian'
				? 'border-primary border-b-primary bg-primary text-white'
				: 'border-slate-200 border-b-slate-300 bg-white text-slate-500'}"
		>
			Harian
		</button>
		<button
			type="button"
			onclick={() => (segmen = 'pelajaran')}
			class="rounded-xl border-2 border-b-4 py-2 text-xs font-black transition active:translate-y-0.5 active:border-b-2 {segmen ===
			'pelajaran'
				? 'border-primary border-b-primary bg-primary text-white'
				: 'border-slate-200 border-b-slate-300 bg-white text-slate-500'}"
		>
			Per Pelajaran
		</button>
	</div>

	<!-- ============ Filter Tanggal ============ -->
	<div>
		<label for="filter-tanggal" class="mb-1 block text-[11px] font-bold text-slate-400">
			Filter tanggal (kosongkan untuk semua)
		</label>
		<input
			id="filter-tanggal"
			type="date"
			bind:value={filterTanggal}
			class="w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none"
		/>
	</div>

	{#if segmen === 'harian'}
		{#if harian.length === 0}
			<p class="py-10 text-center text-sm font-bold text-slate-400">
				Tidak ada data harian untuk tanggal ini.
			</p>
		{:else}
			<div class="space-y-3">
				{#each harian as item (item.tanggal)}
					<div
						class="flex items-center gap-3 rounded-2xl border-2 border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white p-4 shadow-sm"
					>
						<div class="min-w-0 flex-1">
							<p class="text-sm font-extrabold text-slate-800">{fmtHari(item.tanggal)}</p>
							<p class="mt-0.5 text-xs font-medium text-slate-400">
								{item.jamMasuk
									? `Masuk ${item.jamMasuk} · Keluar ${item.jamKeluar ?? '-'}`
									: `Catatan: ${metodeLabel[item.metode]}`}
							</p>
							<p
								class="mt-1 inline-block rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-500"
							>
								{metodeLabel[item.metode]}
							</p>
						</div>
						<span
							class="shrink-0 rounded-full border-2 border-b-2 px-3 py-1 text-xs font-black {badgeStatus[
								item.status
							]}"
						>
							{labelStatus[item.status]}
						</span>
					</div>
				{/each}
			</div>
		{/if}
	{:else}
		{#if pelajaran.length === 0}
			<p class="py-10 text-center text-sm font-bold text-slate-400">
				Tidak ada data pelajaran untuk tanggal ini.
			</p>
		{:else}
			<div class="space-y-3">
				{#each pelajaran as item (item.tanggal + item.mapel)}
					<div
						class="rounded-2xl border-2 border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white p-4 shadow-sm"
					>
						<div class="flex items-center gap-2">
							<span
								class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-b-2 border-primary/20 bg-primary/5 text-sm font-black text-primary"
							>
								{item.mapel.slice(0, 3).toUpperCase()}
							</span>
							<div class="min-w-0 flex-1">
								<p class="truncate text-sm font-extrabold text-slate-800">{item.mapel}</p>
								<p class="text-xs font-medium text-slate-400">
									{fmtHari(item.tanggal)} · {item.jamMulai}-{item.jamSelesai}
								</p>
							</div>
							<span
								class="shrink-0 rounded-full border-2 border-b-2 px-3 py-1 text-xs font-black {badgeStatus[
									item.status
								]}"
							>
								{labelStatus[item.status]}
							</span>
						</div>
						<p class="mt-2 border-t border-slate-100 pt-2 text-xs font-bold text-slate-500">
							Guru: {item.guru}
						</p>
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>
