<script lang="ts">
	import { bacaSesi } from '$lib/auth.svelte';
	import { jurnalMock } from '$lib/data/mock-ortu';

	const sesiAktif = $derived(bacaSesi());
	const anakAktif = $derived(
		sesiAktif?.daftarAnak?.find((a) => a.siswaId === sesiAktif.anakAktifId) ??
			sesiAktif?.daftarAnak?.[0]
	);

	const jurnal = $derived([...jurnalMock].sort((a, b) => b.tanggal.localeCompare(a.tanggal)));

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
			Pembelajaran {anakAktif?.namaLengkap ?? ''}
		</p>
		<h1 class="mt-1 text-lg font-black">Jurnal Kelas {anakAktif?.kelas ?? ''}</h1>
		<p class="mt-1 text-xs font-medium text-white/70">
			Rekap materi & catatan dari guru {anakAktif?.namaLengkap
				? `kelas ${anakAktif?.kelas ?? ''}`
				: ''}.
		</p>
	</div>

	{#if jurnal.length === 0}
		<p class="py-10 text-center text-sm font-bold text-slate-400">Belum ada jurnal pembelajaran.</p>
	{:else}
		<div class="space-y-3">
			{#each jurnal as item (item.tanggal + item.mapel)}
				<div
					class="overflow-hidden rounded-2xl border-2 border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white shadow-sm"
				>
					<div class="flex items-center gap-2 border-b border-slate-100 bg-primary/5 px-4 py-2.5">
						<span
							class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-b-2 border-primary/20 bg-white text-xs font-black text-primary"
						>
							{item.mapel.slice(0, 3).toUpperCase()}
						</span>
						<div class="min-w-0 flex-1">
							<p class="truncate text-sm font-extrabold text-primary">{item.mapel}</p>
							<p class="text-[11px] font-bold text-slate-400">{fmtHari(item.tanggal)}</p>
						</div>
						<span class="shrink-0 text-[10px] font-black text-slate-400">
							{item.jamMulai}-{item.jamSelesai}
						</span>
					</div>
					<div class="space-y-3 p-4">
						<div>
							<p class="text-[11px] font-black tracking-widest text-secondary uppercase">Materi</p>
							<p class="mt-1 text-sm font-bold text-slate-700">{item.materi}</p>
						</div>
						<div>
							<p class="text-[11px] font-black tracking-widest text-neutral-custom uppercase">
								Catatan Kondisi Kelas
							</p>
							<p class="mt-1 text-xs font-medium text-slate-500">{item.catatan}</p>
						</div>
					</div>
					<div
						class="border-t border-slate-100 bg-slate-50 px-4 py-2 text-[11px] font-bold text-slate-400"
					>
						Guru: {item.guru}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
