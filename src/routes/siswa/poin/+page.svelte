<script lang="ts">
	import { onMount } from 'svelte';
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import {
		ambilCatatanPoin,
		ambilDaftarGuru,
		ambilKategoriPoin,
		type CatatanPoinAPI,
		type GuruAPI,
		type KategoriPoinAPI
	} from '$lib/api/poin';
	import { bacaSesiSiswa } from '$lib/auth.svelte';

	type FilterRiwayat = 'semua' | 'pelanggaran' | 'prestasi';

	interface RiwayatPoin {
		id: string;
		kategori: string;
		nilai: number;
		isPrestasi: boolean;
		tanggal: string;
		pelapor: string;
		fotoBukti: boolean;
	}

	let riwayat = $state<RiwayatPoin[]>([]);
	let memuat = $state(true);
	let pesanError = $state('');
	let filter = $state<FilterRiwayat>('semua');

	const sesi = $derived(bacaSesiSiswa());

	onMount(() => {
		if (sesi) {
			void muatData();
		}
	});

	async function muatData() {
		memuat = true;
		pesanError = '';
		try {
			const [kategori, catatan, guru] = await Promise.all([
				ambilKategoriPoin(),
				ambilCatatanPoin(),
				ambilDaftarGuru()
			]);
			
			// Filter hanya catatan poin milik siswa yang sedang login
			const catatanSiswaIni = catatan.filter((c) => c.siswaId === sesi?.id);
			riwayat = mapRiwayat(catatanSiswaIni, kategori, guru);
		} catch (e) {
			pesanError = e instanceof Error ? e.message : 'Gagal memuat data poin.';
		} finally {
			memuat = false;
		}
	}

	function mapRiwayat(
		catatan: CatatanPoinAPI[],
		kategori: KategoriPoinAPI[],
		guru: GuruAPI[]
	): RiwayatPoin[] {
		const petaKategori = new Map(kategori.map((k) => [k.id, k]));
		const petaGuru = new Map(guru.map((g) => [g.id, g]));
		
		return catatan
			.map((c) => {
				const k = petaKategori.get(c.kategoriPoinId);
				const g = c.dilaporkanOleh != null ? petaGuru.get(c.dilaporkanOleh) : undefined;
				return {
					id: String(c.id),
					kategori: k?.namaKategori ?? '-',
					nilai: k ? (k.jenis === 'positif' ? Math.abs(k.bobotPoin) : -Math.abs(k.bobotPoin)) : 0,
					isPrestasi: k?.jenis === 'positif',
					tanggal: c.tanggal,
					pelapor: g?.namaLengkap ?? 'Sistem',
					fotoBukti: Boolean(c.urlFotoBukti)
				};
			})
			.sort((a, b) => b.tanggal.localeCompare(a.tanggal));
	}

	const riwayatFilter = $derived(
		filter === 'semua' ? riwayat : riwayat.filter((r) => r.isPrestasi === (filter === 'prestasi'))
	);

	const poinPrestasi = $derived(
		riwayat.filter((r) => r.isPrestasi).reduce((sum, r) => sum + r.nilai, 0)
	);
	
	const poinPelanggaran = $derived(
		Math.abs(riwayat.filter((r) => !r.isPrestasi).reduce((sum, r) => sum + r.nilai, 0))
	);
	
	const totalPoinSiswa = $derived(poinPrestasi - poinPelanggaran);

	function formatTanggal(t: string): string {
		return new Date(`${t}T00:00:00`).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}

	function formatNilai(nilai: number): string {
		return nilai > 0 ? `+${nilai}` : `${nilai}`;
	}
</script>

<div class="space-y-4 px-4">
	<!-- ============ Header ============ -->
	<div
		class="rounded-3xl border-b-4 border-b-[#12243f] bg-gradient-to-br from-primary to-primary/90 p-5 text-white shadow-lg shadow-primary/20"
	>
		<p class="text-[11px] font-black tracking-widest text-white/60 uppercase">
			Ringkasan Kedisiplinan
		</p>
		<h1 class="mt-1 text-2xl font-black">
			{totalPoinSiswa > 0 ? '+' : ''}{totalPoinSiswa} <span class="text-sm font-bold text-white/70">Poin</span>
		</h1>
		<div class="mt-4 grid grid-cols-2 gap-3 text-center">
			<div class="rounded-xl border-b-4 border-b-emerald-600/30 bg-emerald-500/20 p-2.5">
				<p class="text-[10px] font-bold text-emerald-100 uppercase tracking-wide">Prestasi</p>
				<p class="mt-0.5 text-base font-extrabold text-emerald-50">+{poinPrestasi}</p>
			</div>
			<div class="rounded-xl border-b-4 border-b-rose-600/30 bg-rose-500/20 p-2.5">
				<p class="text-[10px] font-bold text-rose-100 uppercase tracking-wide">Pelanggaran</p>
				<p class="mt-0.5 text-base font-extrabold text-rose-50">-{poinPelanggaran}</p>
			</div>
		</div>
	</div>

	<!-- ============ Memuat / Gagal ============ -->
	{#if memuat}
		<div class="animate-pulse space-y-3">
			{#each Array(4) as _}
				<div class="h-20 w-full rounded-2xl bg-slate-200"></div>
			{/each}
		</div>
	{:else if pesanError}
		<div class="rounded-2xl border-2 border-b-4 border-rose-200 border-b-rose-300 bg-rose-50 p-4">
			<div class="flex items-center gap-2">
				<span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5">
						<line x1="12" y1="8" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
						<circle cx="12" cy="12" r="10" />
					</svg>
				</span>
				<p class="text-sm font-black text-rose-700">Gagal Memuat Riwayat</p>
			</div>
			<p class="mt-1 text-xs font-medium text-rose-600">{pesanError}</p>
			<button type="button" onclick={muatData} class="mt-3 w-full rounded-2xl border-b-4 border-b-rose-400 bg-rose-500 py-3 text-sm font-black text-white shadow-sm shadow-rose-500/20 transition-all active:translate-y-0.5 active:border-b-2">
				Coba Lagi
			</button>
		</div>
	{:else if riwayat.length === 0}
		<div class="flex flex-col items-center justify-center space-y-3 px-4 py-12 text-center">
			<div class="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-300">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8">
					<circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
				</svg>
			</div>
			<div>
				<p class="text-sm font-bold text-slate-600">Belum Ada Catatan</p>
				<p class="mt-1 text-xs font-medium text-slate-400">Kamu belum memiliki catatan pelanggaran atau prestasi.</p>
			</div>
		</div>
	{:else}
		<!-- ============ Riwayat ============ -->
		<div class="rounded-2xl border-2 border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white p-4 shadow-sm">
			<div class="mb-4 flex flex-col gap-3">
				<div class="flex items-center gap-2">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/15 text-secondary">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
							<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
							<polyline points="22 4 12 14.01 9 11.01" />
						</svg>
					</div>
					<h2 class="font-black text-primary">Riwayat Poinmu</h2>
				</div>
				<div class="flex flex-wrap gap-2">
					<button
						type="button"
						onclick={() => (filter = 'semua')}
						class="rounded-xl border-2 px-3.5 py-1.5 text-xs font-black transition active:translate-y-0.5 {filter === 'semua' ? 'border-b-4 border-b-[#12243f] bg-primary text-white' : 'border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white text-slate-500'}"
					>
						Semua
					</button>
					<button
						type="button"
						onclick={() => (filter = 'prestasi')}
						class="rounded-xl border-2 px-3.5 py-1.5 text-xs font-black transition active:translate-y-0.5 {filter === 'prestasi' ? 'border-b-4 border-b-[#1f8ba3] bg-secondary text-primary' : 'border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white text-slate-500'}"
					>
						Prestasi
					</button>
					<button
						type="button"
						onclick={() => (filter = 'pelanggaran')}
						class="rounded-xl border-2 px-3.5 py-1.5 text-xs font-black transition active:translate-y-0.5 {filter === 'pelanggaran' ? 'border-b-4 border-b-[#382200] bg-tertiary text-white' : 'border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white text-slate-500'}"
					>
						Pelanggaran
					</button>
				</div>
			</div>

			<div class="divide-y divide-slate-100">
				{#each riwayatFilter as r (r.id)}
					<div class="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
						<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-b-4 {r.isPrestasi ? 'border-emerald-200 border-b-emerald-300 bg-emerald-50 text-emerald-600' : 'border-amber-200 border-b-amber-300 bg-amber-50 text-amber-600'}">
							{#if r.isPrestasi}
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="h-5 w-5">
									<path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke-linecap="round" stroke-linejoin="round"/>
									<polyline points="22 4 12 14.01 9 11.01" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							{:else}
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="h-5 w-5">
									<circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round"/>
									<line x1="12" y1="8" x2="12" y2="12" stroke-linecap="round" stroke-linejoin="round"/>
									<line x1="12" y1="16" x2="12.01" y2="16" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							{/if}
						</div>
						
						<div class="min-w-0 flex-1">
							<div class="flex items-center justify-between gap-2">
								<p class="text-sm font-bold text-slate-800 leading-tight">{r.kategori}</p>
								<span class="shrink-0 rounded-full border-2 border-b-2 px-2.5 py-0.5 text-xs font-black {r.isPrestasi ? 'border-emerald-200 border-b-emerald-300 bg-emerald-50 text-emerald-700' : 'border-amber-200 border-b-amber-400 bg-amber-50 text-amber-800'}">
									{formatNilai(r.nilai)} Poin
								</span>
							</div>
							<p class="mt-1 flex flex-wrap items-center gap-x-1.5 text-[11px] font-bold text-slate-400">
								<span>{formatTanggal(r.tanggal)}</span>
								<span aria-hidden="true">·</span>
								<span class="text-slate-500">Oleh: {r.pelapor}</span>
							</p>
						</div>
						{#if r.fotoBukti}
							<button type="button" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-b-4 border-slate-200 border-b-slate-300 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400" title="Bukti foto">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
									<path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
									<circle cx="12" cy="13" r="4" />
								</svg>
							</button>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
