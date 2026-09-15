<script lang="ts">
	import { bacaSesi } from '$lib/auth.svelte';
	import { poinMock } from '$lib/data/mock-ortu';

	const sesiAktif = $derived(bacaSesi());
	const anakAktif = $derived(
		sesiAktif?.daftarAnak?.find((a) => a.siswaId === sesiAktif.anakAktifId) ??
			sesiAktif?.daftarAnak?.[0]
	);

	const poinAnak = $derived(
		poinMock
			.filter((p) => p.siswaId === anakAktif?.siswaId)
			.sort((a, b) => b.tanggal.localeCompare(a.tanggal))
	);
	const totalPoin = $derived(poinAnak.reduce((acc, p) => acc + p.bobot, 0));
	const jumlahPositif = $derived(poinAnak.filter((p) => p.bobot > 0).length);
	const jumlahNegatif = $derived(poinAnak.filter((p) => p.bobot < 0).length);

	function fmtHari(tanggal: string): string {
		return new Date(`${tanggal}T00:00:00`).toLocaleDateString('id-ID', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}
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
			Poin {anakAktif?.namaLengkap ?? ''}
		</p>
		<h1 class="mt-1 text-lg font-black">Prestasi & Pelanggaran</h1>
		<div class="mt-4 flex items-end justify-between">
			<div>
				<p class="text-xs font-bold text-white/60">Total Poin</p>
				<p class="text-4xl font-black">{totalPoin > 0 ? `+${totalPoin}` : totalPoin}</p>
			</div>
			<div class="flex gap-2">
				<span
					class="rounded-xl border-b-4 border-b-white/15 bg-white/10 px-3 py-1.5 text-xs font-black"
				>
					{jumlahPositif} Positif
				</span>
				<span
					class="rounded-xl border-b-4 border-b-white/15 bg-white/10 px-3 py-1.5 text-xs font-black"
				>
					{jumlahNegatif} Negatif
				</span>
			</div>
		</div>
	</div>

	<!-- ============ Riwayat Poin ============ -->
	<h2 class="pt-1 text-base font-black text-primary">Riwayat</h2>
	{#if poinAnak.length === 0}
		<p class="py-10 text-center text-sm font-bold text-slate-400">Belum ada catatan poin.</p>
	{:else}
		<div class="space-y-3">
			{#each poinAnak as item (item.tanggal + item.kategori + item.deskripsi)}
				<div
					class="rounded-2xl border-2 border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white p-4 shadow-sm"
				>
					<div class="flex items-start gap-3">
						<span
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-b-2 text-sm font-black {item.jenis ===
							'positif'
								? 'border-emerald-300 bg-emerald-100 text-emerald-700'
								: 'border-rose-300 bg-rose-100 text-rose-700'}"
						>
							{item.bobot > 0 ? `+${item.bobot}` : item.bobot}
						</span>
						<div class="min-w-0 flex-1">
							<div class="flex items-center justify-between gap-2">
								<p class="text-sm font-extrabold text-slate-800">{item.kategori}</p>
								<p class="shrink-0 text-[10px] font-black text-slate-400 uppercase">
									{fmtHari(item.tanggal)}
								</p>
							</div>
							<p class="mt-0.5 text-xs font-medium text-slate-500">{item.deskripsi}</p>
							<p
								class="mt-2 inline-block rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-500"
							>
								Dilaporkan {item.guru}
							</p>
							{#if item.urlFotoBukti}
								<span
									class="ml-1 inline-block rounded-lg bg-sky-100 px-2 py-0.5 text-[10px] font-black text-sky-600"
								>
									Ada bukti foto
								</span>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
