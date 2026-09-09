<script lang="ts">
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import Dropdown from '$lib/components/ui/Dropdown.svelte';
	import {
		daftarKategoriPoin,
		daftarSiswaPoin,
		mockRiwayatPoin,
		type RiwayatPoin
	} from '$lib/data/mock-poin';

	type JenisPoin = 'pelanggaran' | 'prestasi';
	type FilterRiwayat = 'semua' | JenisPoin;

	let siswaDipilih = $state<string>('');
	let jenisPoin = $state<JenisPoin>('pelanggaran');
	let kategoriDipilih = $state<string>('');
	let tanggalKejadian = $state('2026-09-08');
	let deskripsi = $state('');
	let fileBukti = $state<{ nama: string } | null>(null);
	let dragAktif = $state(false);

	let riwayat = $state<RiwayatPoin[]>(mockRiwayatPoin.map((r) => ({ ...r })));
	let filter = $state<FilterRiwayat>('semua');
	let sukses = $state(false);
	let pesanSukses = $state('');

	const kategoriFilter = $derived(
		daftarKategoriPoin.filter((k) => k.isPrestasi === (jenisPoin === 'prestasi'))
	);
	const siswaTerpilih = $derived(daftarSiswaPoin.find((s) => s.id === siswaDipilih));

	function gantiJenis(jenis: JenisPoin) {
		jenisPoin = jenis;
		const pertama = daftarKategoriPoin.find((k) => k.isPrestasi === (jenis === 'prestasi'));
		kategoriDipilih = pertama ? pertama.id : '';
	}

	function onPilihFile(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (file) fileBukti = { nama: file.name };
	}

	function hapusFile() {
		fileBukti = null;
	}

	const riwayatFilter = $derived(
		filter === 'semua' ? riwayat : riwayat.filter((r) => r.isPrestasi === (filter === 'prestasi'))
	);

	const totalPelanggaran = $derived(riwayat.filter((r) => !r.isPrestasi).length);
	const totalPrestasi = $derived(riwayat.filter((r) => r.isPrestasi).length);

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

	function kirimLaporan() {
		if (!siswaDipilih || !kategoriDipilih) return;
		const k = daftarKategoriPoin.find((x) => x.id === kategoriDipilih);
		if (!k) return;

		const baru: RiwayatPoin = {
			id: `r${Date.now()}`,
			siswaNama: siswaTerpilih?.nama ?? '',
			nis: siswaTerpilih?.nis ?? '',
			kategori: k.nama,
			nilai: k.nilai,
			isPrestasi: k.isPrestasi,
			tanggal: tanggalKejadian,
			pelapor: 'Ahmad Fauzi, S.Pd.',
			fotoBukti: fileBukti !== null
		};

		riwayat = [baru, ...riwayat];
		pesanSukses = `Poin ${k.isPrestasi ? 'prestasi' : 'pelanggaran'} '${k.nama}' (${formatNilai(
			k.nilai
		)} poin) untuk ${baru.siswaNama} berhasil dilaporkan.`;
		sukses = true;

		siswaDipilih = '';
		kategoriDipilih = '';
		tanggalKejadian = '2026-09-08';
		deskripsi = '';
		fileBukti = null;
	}
</script>

<div class="space-y-4 px-4">
	<!-- ============ Header ============ -->
	<div
		class="rounded-3xl border-b-4 border-b-[#12243f] bg-gradient-to-br from-primary to-primary/90 p-4 text-white shadow-lg shadow-primary/20"
	>
		<p class="text-[11px] font-black tracking-widest text-white/60 uppercase">
			Kedisiplinan & Prestasi
		</p>
		<h1 class="mt-0.5 text-lg font-black">Catatan Poin Siswa</h1>
		<div class="mt-3 grid grid-cols-3 gap-2 text-center">
			<div class="rounded-xl border-b-4 border-b-white/15 bg-white/10 p-2">
				<p class="text-[10px] font-bold text-white/60">Semua</p>
				<p class="text-sm font-extrabold">{riwayat.length}</p>
			</div>
			<div class="rounded-xl border-b-4 border-b-white/15 bg-white/10 p-2">
				<p class="text-[10px] font-bold text-white/60">Pelanggaran</p>
				<p class="text-sm font-extrabold">{totalPelanggaran}</p>
			</div>
			<div class="rounded-xl border-b-4 border-b-white/15 bg-white/10 p-2">
				<p class="text-[10px] font-bold text-white/60">Prestasi</p>
				<p class="text-sm font-extrabold">{totalPrestasi}</p>
			</div>
		</div>
	</div>

	<!-- ============ Form Pelaporan Poin ============ -->
	<div
		class="rounded-2xl border-2 border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white p-4 shadow-sm"
	>
		<div class="mb-4 flex items-center gap-2">
			<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="h-4 w-4"
				>
					<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
					<polyline points="14 2 14 8 20 8" />
					<path d="M8 13h6M8 17h8" />
				</svg>
			</div>
			<h2 class="font-black text-primary">Form Pelaporan Poin</h2>
			<span
				class="ml-auto rounded-lg border-b-2 border-b-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-400"
			>
				+ prestasi · − pelanggaran
			</span>
		</div>

		<div class="space-y-4">
			<!-- Select Siswa -->
			<Dropdown
				label="Siswa"
				placeholder="Pilih siswa..."
				options={daftarSiswaPoin.map((s) => ({
					value: s.id,
					label: s.nama,
					hint: `${s.nis} · Kelas ${s.kelas}`
				}))}
				bind:value={siswaDipilih}
			/>

			<!-- Jenis Poin (Radio Toggle) -->
			<div>
				<span class="mb-1.5 block text-sm font-bold text-slate-700">Jenis Poin</span>
				<div class="grid grid-cols-2 gap-3">
					<button
						type="button"
						onclick={() => gantiJenis('pelanggaran')}
						aria-pressed={jenisPoin === 'pelanggaran'}
						class="flex items-center justify-center gap-2 rounded-2xl border-2 py-3 text-sm font-black transition-all duration-150 active:translate-y-0.5 active:border-b-2 {jenisPoin ===
						'pelanggaran'
							? 'border-b-4 border-b-[#382200] bg-tertiary text-white shadow-lg shadow-tertiary/25'
							: 'border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white text-slate-500'}"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="h-4 w-4"
						>
							<circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line
								x1="12"
								y1="16"
								x2="12.01"
								y2="16"
							/>
						</svg>
						Pelanggaran
					</button>
					<button
						type="button"
						onclick={() => gantiJenis('prestasi')}
						aria-pressed={jenisPoin === 'prestasi'}
						class="flex items-center justify-center gap-2 rounded-2xl border-2 py-3 text-sm font-black transition-all duration-150 active:translate-y-0.5 active:border-b-2 {jenisPoin ===
						'prestasi'
							? 'border-b-4 border-b-[#1f8ba3] bg-secondary text-primary shadow-lg shadow-secondary/30'
							: 'border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white text-slate-500'}"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="h-4 w-4"
						>
							<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
							<polyline points="22 4 12 14.01 9 11.01" />
						</svg>
						Prestasi
					</button>
				</div>
			</div>

			<!-- Dropdown Kategori Poin -->
			<Dropdown
				label="Kategori Poin"
				placeholder="Pilih kategori..."
				options={kategoriFilter.map((k) => ({
					value: k.id,
					label: k.nama,
					hint: `${formatNilai(k.nilai)} Poin`
				}))}
				bind:value={kategoriDipilih}
			/>

			<!-- Tanggal Kejadian -->
			<div>
				<label for="tanggal" class="mb-1.5 block text-sm font-bold text-slate-700">
					Tanggal Kejadian
				</label>
				<input
					id="tanggal"
					type="date"
					bind:value={tanggalKejadian}
					class="w-full rounded-xl border-2 border-[#E2E8F0] px-3 py-2.5 font-medium text-slate-800 focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none"
				/>
			</div>

			<!-- Deskripsi -->
			<div>
				<label
					for="deskripsi"
					class="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-slate-700"
				>
					Deskripsi / Catatan Kejadian
					<span class="text-xs font-medium text-slate-400">({deskripsi.length}/500)</span>
				</label>
				<textarea
					id="deskripsi"
					bind:value={deskripsi}
					maxlength="500"
					rows="4"
					placeholder="Jelaskan kronologi kejadian secara rinci..."
					class="w-full rounded-xl border-2 border-[#E2E8F0] p-3 text-sm font-medium placeholder:text-slate-400 focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none"
				></textarea>
			</div>

			<!-- Upload Bukti Foto -->
			<div>
				<span class="mb-1.5 block text-sm font-bold text-slate-700">Foto Bukti (opsional)</span>
				{#if fileBukti}
					<div
						class="flex items-center justify-between gap-3 rounded-2xl border-2 border-b-4 border-emerald-200 border-b-emerald-300 bg-emerald-50 px-4 py-3"
					>
						<div class="flex min-w-0 items-center gap-3">
							<div
								class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-b-2 border-b-emerald-300 bg-emerald-100 text-emerald-700"
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
									<path
										d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
									/>
									<circle cx="12" cy="13" r="4" />
								</svg>
							</div>
							<div class="min-w-0">
								<p class="truncate text-sm font-bold text-emerald-800">{fileBukti.nama}</p>
								<p class="text-xs font-medium text-emerald-600">Bukti terunggah</p>
							</div>
						</div>
						<button
							type="button"
							onclick={hapusFile}
							class="rounded-lg p-1.5 text-emerald-700 transition hover:bg-emerald-100"
							aria-label="Hapus file"
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="h-4 w-4"
							>
								<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
							</svg>
						</button>
					</div>
				{:else}
					<label
						for="file-bukti"
						class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 px-4 py-7 text-center transition-all duration-200 {dragAktif
							? 'border-secondary bg-secondary/5'
							: 'hover:border-secondary hover:bg-slate-50'}"
						ondragover={(e) => {
							e.preventDefault();
							dragAktif = true;
						}}
						ondragleave={(e) => {
							e.preventDefault();
							dragAktif = false;
						}}
						ondrop={(e) => {
							e.preventDefault();
							dragAktif = false;
							const file = e.dataTransfer?.files?.[0];
							if (file) fileBukti = { nama: file.name };
						}}
					>
						<div
							class="flex h-11 w-11 items-center justify-center rounded-full border-b-2 border-b-slate-300 bg-slate-100 text-slate-500"
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
								<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
								<polyline points="17 8 12 3 7 8" />
								<line x1="12" y1="3" x2="12" y2="15" />
							</svg>
						</div>
						<p class="text-sm font-bold text-slate-600">
							Seret foto bukti ke sini, atau <span class="text-secondary">klik untuk memilih</span>
						</p>
						<p class="text-xs font-medium text-slate-400">JPG / PNG, maksimal 2MB</p>
					</label>
				{/if}
				<input id="file-bukti" type="file" accept="image/*" class="hidden" onchange={onPilihFile} />
			</div>

			<!-- Tombol Kirim -->
			<button
				type="button"
				onclick={kirimLaporan}
				disabled={!siswaDipilih || !kategoriDipilih}
				class="flex w-full items-center justify-center gap-2 rounded-2xl border-b-4 border-b-[#12243f] bg-primary py-3.5 text-sm font-black text-white shadow-md shadow-primary/20 transition-all duration-150 active:translate-y-0.5 active:border-b-2 disabled:cursor-not-allowed disabled:opacity-40"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="h-4 w-4"
				>
					<line x1="22" y1="2" x2="11" y2="13" />
					<polygon points="22 2 15 22 11 13 2 9 22 2" />
				</svg>
				Kirim Laporan Poin
			</button>
		</div>
	</div>

	<!-- ============ Riwayat ============ -->
	<div
		class="rounded-2xl border-2 border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white p-4 shadow-sm"
	>
		<div class="mb-4 flex flex-col gap-3">
			<div class="flex items-center gap-2">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/15 text-secondary"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="h-4 w-4"
					>
						<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
						<polyline points="22 4 12 14.01 9 11.01" />
					</svg>
				</div>
				<h2 class="font-black text-primary">Riwayat Pelaporan</h2>
			</div>
			<div class="flex flex-wrap gap-2">
				<button
					type="button"
					onclick={() => (filter = 'semua')}
					class="rounded-xl border-2 px-3.5 py-1.5 text-xs font-black transition active:translate-y-0.5 {filter ===
					'semua'
						? 'border-b-4 border-b-[#12243f] bg-primary text-white'
						: 'border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white text-slate-500'}"
				>
					Semua
				</button>
				<button
					type="button"
					onclick={() => (filter = 'pelanggaran')}
					class="rounded-xl border-2 px-3.5 py-1.5 text-xs font-black transition active:translate-y-0.5 {filter ===
					'pelanggaran'
						? 'border-b-4 border-b-[#382200] bg-tertiary text-white'
						: 'border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white text-slate-500'}"
				>
					Pelanggaran
				</button>
				<button
					type="button"
					onclick={() => (filter = 'prestasi')}
					class="rounded-xl border-2 px-3.5 py-1.5 text-xs font-black transition active:translate-y-0.5 {filter ===
					'prestasi'
						? 'border-b-4 border-b-[#1f8ba3] bg-secondary text-primary'
						: 'border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white text-slate-500'}"
				>
					Prestasi
				</button>
			</div>
		</div>

		{#if sukses}
			<div
				class="mb-4 flex items-center gap-2 rounded-2xl border-2 border-b-4 border-emerald-300 border-b-emerald-400 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700"
				role="status"
			>
				<span
					class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="3"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="h-3 w-3"
					>
						<path d="M5 13l4 4L19 7" />
					</svg>
				</span>
				{pesanSukses}
			</div>
		{/if}

		<div class="divide-y divide-slate-100">
			{#each riwayatFilter as r (r.id)}
				<div class="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
					<Avatar nama={r.siswaNama} size="sm" />
					<div class="min-w-0 flex-1">
						<div class="flex items-center justify-between gap-3">
							<p class="truncate text-sm font-bold text-slate-800">{r.siswaNama}</p>
							<span
								class="shrink-0 rounded-full border-2 border-b-2 px-2.5 py-0.5 text-xs font-black {r.isPrestasi
									? 'border-emerald-200 border-b-emerald-300 bg-emerald-50 text-emerald-700'
									: 'border-amber-200 border-b-amber-400 bg-amber-50 text-amber-800'}"
							>
								{formatNilai(r.nilai)} Poin
							</span>
						</div>
						<p class="text-sm font-medium text-slate-500">{r.kategori}</p>
						<p class="mt-1 flex flex-wrap items-center gap-x-1.5 text-xs text-slate-400">
							<span>{formatTanggal(r.tanggal)}</span>
							<span aria-hidden="true">·</span>
							<span>{r.pelapor}</span>
						</p>
					</div>
					{#if r.fotoBukti}
						<button
							type="button"
							class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-b-4 border-slate-200 border-b-slate-300 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400"
							title="Bukti foto"
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
								<path
									d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
								/>
								<circle cx="12" cy="13" r="4" />
							</svg>
						</button>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>
