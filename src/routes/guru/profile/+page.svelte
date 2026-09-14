<script lang="ts">
	import { onMount } from 'svelte';
	import {
		ambilGuru,
		ambilJadwalGuru,
		ambilKelas,
		ambilMapel,
		ambilPengguna,
		type GuruAPI,
		type PenggunaAPI
	} from '$lib/api/guru';
	import { bacaSesi, hapusSesi, inisial } from '$lib/auth.svelte';
	import { fade, scale } from 'svelte/transition';

	let guru = $state<GuruAPI | null>(null);
	let pengguna = $state<PenggunaAPI | null>(null);
	let namaMapel = $state('Mata Pelajaran');
	let namaKelas = $state('Kelas');
	let memuat = $state(true);
	let pesanError = $state('');
	let tanyaKeluar = $state(false);

	const sesi = $derived(bacaSesi());
	const akunAktif = $derived(pengguna?.isAktif ?? true);

	onMount(() => {
		if (sesi) void muatProfil();
	});

	async function muatProfil() {
		const s = sesi;
		if (!s) return;
		memuat = true;
		pesanError = '';
		try {
			const [g, p] = await Promise.all([ambilGuru(s.guruId), ambilPengguna(s.penggunaId)]);
			guru = g;
			pengguna = p;
			const jadwal = await ambilJadwalGuru(s.guruId);
			if (jadwal[0]) {
				const [mapel, kelas] = await Promise.all([
					ambilMapel(jadwal[0].mataPelajaranId),
					ambilKelas(jadwal[0].kelasId)
				]);
				if (mapel) namaMapel = mapel.namaPelajaran;
				if (kelas) namaKelas = kelas.namaKelas;
			}
		} catch (e) {
			pesanError = e instanceof Error ? e.message : 'Gagal memuat profil.';
		} finally {
			memuat = false;
		}
	}

	function keluar() {
		hapusSesi();
	}
</script>

<div class="space-y-4 px-4 pb-2">
	{#if memuat}
		<!-- ============ Skeleton ============ -->
		<div class="animate-pulse">
			<div
				class="rounded-3xl border-b-4 border-b-[#12243f] bg-gradient-to-br from-primary to-primary/90 p-5 text-center"
			>
				<div class="mx-auto h-20 w-20 rounded-2xl border-b-4 border-slate-300 bg-slate-200"></div>
				<div class="mx-auto mt-4 h-4 w-48 rounded-full bg-slate-200"></div>
				<div class="mx-auto mt-2 h-3 w-28 rounded-full bg-slate-200"></div>
				<div class="mt-4 flex justify-center gap-2">
					<div class="h-8 w-24 rounded-xl bg-slate-200"></div>
					<div class="h-8 w-24 rounded-xl bg-slate-200"></div>
				</div>
			</div>
			<div
				class="mt-4 space-y-3 rounded-2xl border-2 border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white p-4"
			>
				{#each [1, 2, 3, 4] as i (i)}
					<div class="flex items-center gap-3">
						<div class="h-8 w-8 rounded-lg bg-slate-200"></div>
						<div class="flex-1 space-y-1.5">
							<div class="h-3 w-24 rounded-full bg-slate-200"></div>
							<div class="h-3.5 w-40 rounded-full bg-slate-200"></div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{:else if pesanError}
		<!-- ============ Gagal ============ -->
		<div class="rounded-2xl border-2 border-b-4 border-rose-200 border-b-rose-300 bg-rose-50 p-4">
			<div class="flex items-center gap-2">
				<span
					class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="h-3.5 w-3.5"
					>
						<line x1="12" y1="8" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
						<circle cx="12" cy="12" r="10" />
					</svg>
				</span>
				<p class="text-sm font-black text-rose-700">Profil Tidak Dapat Dimuat</p>
			</div>
			<p class="mt-1 text-xs font-medium text-rose-600">{pesanError}</p>
			<button
				type="button"
				onclick={muatProfil}
				class="mt-3 w-full rounded-2xl border-b-4 border-b-rose-400 bg-rose-500 py-3 text-sm font-black text-white shadow-sm shadow-rose-500/20 transition-all duration-150 active:translate-y-0.5 active:border-b-2"
			>
				Muat Ulang
			</button>
		</div>
	{:else}
		<!-- ============ Kartu Profil ============ -->
		<div
			class="rounded-3xl border-b-4 border-b-[#12243f] bg-gradient-to-br from-primary to-primary/90 p-5 text-center text-white shadow-lg shadow-primary/20"
		>
			<p class="text-[11px] font-black tracking-widest text-white/60 uppercase">Profil Guru</p>
			<div
				class="mx-auto mt-3 flex h-20 w-20 items-center justify-center rounded-2xl border-b-4 border-slate-300 bg-white text-2xl font-black text-primary shadow-lg shadow-slate-500/30"
			>
				{inisial(guru?.namaLengkap ?? '')}
			</div>
			<h1 class="mt-4 text-lg font-black">{guru?.namaLengkap ?? 'Guru'}</h1>
			<p class="mb-4 text-xs text-white/70">Guru Pengampu</p>
			<div class="flex justify-center gap-2">
				<span
					class="rounded-xl border-2 border-b-4 border-secondary border-b-[#1f8ba3] bg-white/10 px-3 py-1.5 text-xs font-black text-white"
				>
					{namaMapel}
				</span>
				<span
					class="rounded-xl border-2 border-b-4 border-white/20 border-b-white/10 bg-white/5 px-3 py-1.5 text-xs font-black text-white/90"
				>
					{namaKelas}
				</span>
			</div>
		</div>

		<!-- ============ Informasi Umum ============ -->
		<div
			class="rounded-2xl border-2 border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white p-4 shadow-sm"
		>
			<div class="mb-1 flex items-center gap-2">
				<div
					class="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/15 text-secondary"
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
						<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
					</svg>
				</div>
				<h2 class="text-sm font-black text-primary">Informasi Umum</h2>
			</div>
			<div class="divide-y divide-slate-100">
				<div class="flex items-center gap-3 py-3">
					<div
						class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary"
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
							<path d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5" />
							<path d="M14 2h4v2h-4z" />
						</svg>
					</div>
					<div class="flex-1">
						<p class="text-[11px] font-bold tracking-wide text-slate-400 uppercase">NIP</p>
						<p class="text-sm font-bold text-slate-800">{guru?.nip ?? '-'}</p>
					</div>
				</div>
				<div class="flex items-center gap-3 py-3">
					<div
						class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary"
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
							<path
								d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 016.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z"
							/>
						</svg>
					</div>
					<div class="flex-1">
						<p class="text-[11px] font-bold tracking-wide text-slate-400 uppercase">
							Mata Pelajaran
						</p>
						<p class="text-sm font-bold text-slate-800">{namaMapel}</p>
					</div>
				</div>
				<div class="flex items-center gap-3 py-3">
					<div
						class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary"
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
							<path
								d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
							/>
						</svg>
					</div>
					<div class="flex-1">
						<p class="text-[11px] font-bold tracking-wide text-slate-400 uppercase">
							Nomor Telepon
						</p>
						<p class="text-sm font-bold text-slate-800">{guru?.nomorTelepon ?? '-'}</p>
					</div>
				</div>
				<div class="flex items-center gap-3 py-3">
					<div
						class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary"
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
							<path
								d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
							/>
						</svg>
					</div>
					<div class="flex-1">
						<p class="text-[11px] font-bold tracking-wide text-slate-400 uppercase">Status</p>
						<p class="text-sm font-bold text-slate-800">
							{akunAktif ? 'Akun Aktif' : 'Akun Nonaktif'}
						</p>
					</div>
					<span
						class="shrink-0 rounded-full border-2 border-b-2 px-2.5 py-0.5 text-xs font-black {akunAktif
							? 'border-emerald-200 border-b-emerald-300 bg-emerald-50 text-emerald-700'
							: 'border-rose-200 border-b-rose-300 bg-rose-50 text-rose-700'}"
					>
						{akunAktif ? 'Aktif' : 'Nonaktif'}
					</span>
				</div>
			</div>
		</div>
	{/if}

	<!-- ============ Logout ============ -->
	<button
		type="button"
		onclick={() => (tanyaKeluar = true)}
		class="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-b-4 border-rose-300 border-b-rose-400 bg-rose-500 py-3 text-sm font-black text-white shadow-sm shadow-rose-500/20 transition-all duration-150 hover:bg-rose-600 active:translate-y-0.5 active:border-b-2"
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
			<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m7 14l5-5-5-5m5 5H9" />
		</svg>
		Logout
	</button>

	<p class="pt-1 text-center text-[10px] font-bold text-slate-300">
		Sekolah App · Portal Guru v1.0
	</p>

	{#if tanyaKeluar}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-5 backdrop-blur-sm"
			transition:fade={{ duration: 150 }}
			role="dialog"
			aria-modal="true"
			aria-label="Konfirmasi keluar"
		>
			<div
				class="w-full max-w-sm rounded-3xl border-2 border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white p-6 text-center shadow-2xl"
				transition:scale={{ duration: 160 }}
			>
				<div
					class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-b-4 border-rose-300 bg-rose-100 text-rose-600"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="h-6 w-6"
					>
						<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m7 14l5-5-5-5m5 5H9" />
					</svg>
				</div>
				<h2 class="mt-4 text-lg font-black text-slate-800">Keluar dari aplikasi?</h2>
				<p class="mt-1 text-xs font-medium text-slate-500">Kamu akan kembali ke halaman masuk.</p>
				<div class="mt-5 grid grid-cols-2 gap-3">
					<button
						type="button"
						onclick={() => (tanyaKeluar = false)}
						class="rounded-2xl border-2 border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white py-3 text-sm font-black text-slate-500 transition-all duration-150 active:translate-y-0.5 active:border-b-2"
					>
						Batal
					</button>
					<button
						type="button"
						onclick={keluar}
						class="rounded-2xl border-b-4 border-b-rose-600 bg-rose-500 py-3 text-sm font-black text-white transition-all duration-150 hover:bg-rose-600 active:translate-y-0.5 active:border-b-2"
					>
						Ya, Keluar
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
