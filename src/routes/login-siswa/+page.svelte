<script lang="ts">
	import {
		aturSandiBaru,
		butuhAturSandi,
		cariSiswaByNisn,
		verifikasiSandi,
		type HasilLoginSiswa
	} from '$lib/api/otentikasi';
	import { simpanSesiSiswa } from '$lib/auth.svelte';

	type Tahap = 'nisn' | 'sandiBaru' | 'sandiBiasa';

	let tahap = $state<Tahap>('nisn');
	let temuan = $state<HasilLoginSiswa | null>(null);

	let nisn = $state('');
	let sandi = $state('');
	let sandiBaru = $state('');
	let konfirmasi = $state('');

	let lihatSandi = $state(false);
	let lihatSandiBaru = $state(false);
	let lihatKonfirmasi = $state(false);

	let memproses = $state(false);
	let pesanError = $state('');

	function bacaPesan(e: unknown): string {
		const mentah = e instanceof Error ? e.message : 'Terjadi kesalahan.';
		return mentah === 'Failed to fetch'
			? 'Tidak dapat terhubung ke server. Pastikan backend berjalan di localhost:3000.'
			: mentah;
	}

	async function cariNisn() {
		if (!nisn.trim() || memproses) return;
		memproses = true;
		pesanError = '';
		try {
			const hasil = await cariSiswaByNisn(nisn);
			temuan = hasil;
			tahap = butuhAturSandi(hasil.pengguna) ? 'sandiBaru' : 'sandiBiasa';
		} catch (e) {
			pesanError = bacaPesan(e);
		} finally {
			memproses = false;
		}
	}

	async function simpanSandiBaru() {
		if (memproses || !temuan) return;
		const sandiSiap = sandiBaru.trim();
		if (sandiSiap.length < 8) {
			pesanError = 'Password baru minimal 8 karakter.';
			return;
		}
		if (sandiSiap !== konfirmasi) {
			pesanError = 'Konfirmasi password tidak sama.';
			return;
		}
		memproses = true;
		pesanError = '';
		try {
			const pengguna = await aturSandiBaru(temuan.pengguna.id, sandiSiap);
			simpanSesiSiswa(pengguna, temuan.siswa);
			window.location.href = '/siswa/dashboard';
		} catch (e) {
			pesanError = bacaPesan(e);
		} finally {
			memproses = false;
		}
	}

	async function masukSandi() {
		if (memproses || !temuan) return;
		if (!sandi) {
			pesanError = 'Isi kata sandi.';
			return;
		}
		memproses = true;
		pesanError = '';
		try {
			verifikasiSandi(temuan.pengguna, sandi);
			simpanSesiSiswa(temuan.pengguna, temuan.siswa);
			window.location.href = '/siswa/dashboard';
		} catch (e) {
			pesanError = bacaPesan(e);
		} finally {
			memproses = false;
		}
	}

	function gantiNisn() {
		tahap = 'nisn';
		temuan = null;
		nisn = '';
		sandi = '';
		sandiBaru = '';
		konfirmasi = '';
		pesanError = '';
	}
</script>

<div class="space-y-4 px-4 pb-4">
	<!-- ============ Hero ============ -->
	<div
		class="rounded-3xl border-b-4 border-b-[#12243f] bg-gradient-to-br from-primary to-primary/90 p-6 text-center text-white shadow-lg shadow-primary/20"
	>
		<div
			class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-b-4 border-secondary bg-white text-primary shadow-lg shadow-slate-500/30"
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="#1a365d"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="h-8 w-8"
			>
				<path d="M12 2a10 10 0 0 0-10 10 10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm0 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
			</svg>
		</div>
		<h1 class="mt-4 text-xl font-black">Sekolah App</h1>
		<p class="text-[11px] font-black tracking-widest text-white/60 uppercase">
			Portal Siswa · Masuk
		</p>
		<p class="mt-2 text-xs font-medium text-white/70">
			Masuk dengan NISN. Jika baru pertama kali, Anda akan diminta membuat password.
		</p>
	</div>

	{#if pesanError}
		<div
			class="flex items-center gap-2 rounded-2xl border-2 border-b-4 border-rose-300 border-b-rose-400 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-700"
			role="alert"
		>
			<span
				class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white"
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
					<line x1="12" y1="8" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
				</svg>
			</span>
			{pesanError}
		</div>
	{/if}

	<!-- ============ Tahap 1: Masukkan NISN ============ -->
	{#if tahap === 'nisn'}
		<form
			onsubmit={(e) => {
				e.preventDefault();
				void cariNisn();
			}}
			class="space-y-4 rounded-2xl border-2 border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white p-4 shadow-sm"
		>
			<div>
				<label for="nisn" class="mb-1.5 block text-sm font-bold text-slate-700">NISN</label>
				<div class="relative">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400"
					>
						<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
					</svg>
					<input
						id="nisn"
						type="text"
						bind:value={nisn}
						autocomplete="username"
						inputmode="numeric"
						placeholder="Masukkan NISN siswa"
						class="w-full rounded-xl border-2 border-[#E2E8F0] py-2.5 pr-3.5 pl-10 font-medium text-slate-800 placeholder:text-slate-400 focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none"
					/>
				</div>
			</div>

			<button
				type="submit"
				disabled={memproses || !nisn.trim()}
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
					<path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
					<polyline points="10 17 15 12 10 7" />
					<line x1="15" y1="12" x2="3" y2="12" />
				</svg>
				{memproses ? 'Memeriksa...' : 'Lanjut'}
			</button>
		</form>
	{:else if tahap === 'sandiBaru' && temuan}
		<!-- ============ Tahap 2a: Buat Password Baru ============ -->
		<div
			class="space-y-4 rounded-2xl border-2 border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white p-4 shadow-sm"
		>
			<div class="rounded-xl bg-secondary/10 p-3 text-center">
				<p class="text-sm font-black text-secondary">Selamat datang, {temuan.siswa.namaLengkap}!</p>
				<p class="text-xs font-medium text-slate-500">
					Kamu login pertama kali. Buat password baru:
				</p>
			</div>

			<div>
				<label for="sandi-baru" class="mb-1.5 block text-sm font-bold text-slate-700">
					Password Baru
				</label>
				<div class="relative">
					<input
						id="sandi-baru"
						type={lihatSandiBaru ? 'text' : 'password'}
						bind:value={sandiBaru}
						autocomplete="new-password"
						placeholder="Minimal 8 karakter"
						class="w-full rounded-xl border-2 border-[#E2E8F0] py-2.5 pr-11 pl-3.5 font-medium text-slate-800 placeholder:text-slate-400 focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none"
					/>
					<button
						type="button"
						onclick={() => (lihatSandiBaru = !lihatSandiBaru)}
						class="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-secondary"
						aria-label={lihatSandiBaru ? 'Sembunyikan password baru' : 'Tampilkan password baru'}
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
							{#if lihatSandiBaru}
								<path
									d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"
								/>
								<line x1="1" y1="1" x2="23" y2="23" />
							{:else}
								<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
								<circle cx="12" cy="12" r="3" />
							{/if}
						</svg>
					</button>
				</div>
			</div>

			<div>
				<label for="konfirmasi-sandi" class="mb-1.5 block text-sm font-bold text-slate-700">
					Konfirmasi Password
				</label>
				<div class="relative">
					<input
						id="konfirmasi-sandi"
						type={lihatKonfirmasi ? 'text' : 'password'}
						bind:value={konfirmasi}
						autocomplete="new-password"
						placeholder="Ulangi password baru"
						class="w-full rounded-xl border-2 border-[#E2E8F0] py-2.5 pr-11 pl-3.5 font-medium text-slate-800 placeholder:text-slate-400 focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none"
					/>
					<button
						type="button"
						onclick={() => (lihatKonfirmasi = !lihatKonfirmasi)}
						class="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-secondary"
						aria-label={lihatKonfirmasi ? 'Sembunyikan konfirmasi' : 'Tampilkan konfirmasi'}
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
							{#if lihatKonfirmasi}
								<path
									d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"
								/>
								<line x1="1" y1="1" x2="23" y2="23" />
							{:else}
								<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
								<circle cx="12" cy="12" r="3" />
							{/if}
						</svg>
					</button>
				</div>
				<p class="mt-1 text-xs text-slate-400">
					Minimal 8 karakter. Jangan gunakan kata sandi yang mudah ditebak.
				</p>
			</div>

			<button
				type="button"
				onclick={simpanSandiBaru}
				disabled={memproses}
				class="flex w-full items-center justify-center gap-2 rounded-2xl border-b-4 border-b-[#12243f] bg-primary py-3.5 text-sm font-black text-white shadow-md shadow-primary/20 transition-all duration-150 active:translate-y-0.5 active:border-b-2 disabled:cursor-not-allowed disabled:opacity-40"
			>
				{memproses ? 'Menyimpan...' : 'Simpan & Masuk'}
			</button>

			<button
				type="button"
				onclick={gantiNisn}
				class="w-full text-center text-xs font-bold text-slate-400 transition hover:text-secondary"
			>
				Ganti NISN
			</button>
		</div>
	{:else if tahap === 'sandiBiasa' && temuan}
		<!-- ============ Tahap 2b: Masukkan Password ============ -->
		<div
			class="space-y-4 rounded-2xl border-2 border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white p-4 shadow-sm"
		>
			<div class="rounded-xl bg-secondary/10 p-3 text-center">
				<p class="text-sm font-black text-secondary">{temuan.siswa.namaLengkap}</p>
				<p class="text-xs font-medium text-slate-500">Masukkan password untuk melanjutkan.</p>
			</div>

			<div>
				<label for="sandi-biasa" class="mb-1.5 block text-sm font-bold text-slate-700">
					Password
				</label>
				<div class="relative">
					<input
						id="sandi-biasa"
						type={lihatSandi ? 'text' : 'password'}
						bind:value={sandi}
						autocomplete="current-password"
						placeholder="Masukkan password"
						class="w-full rounded-xl border-2 border-[#E2E8F0] py-2.5 pr-11 pl-3.5 font-medium text-slate-800 placeholder:text-slate-400 focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none"
					/>
					<button
						type="button"
						onclick={() => (lihatSandi = !lihatSandi)}
						class="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-secondary"
						aria-label={lihatSandi ? 'Sembunyikan password' : 'Tampilkan password'}
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
							{#if lihatSandi}
								<path
									d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"
								/>
								<line x1="1" y1="1" x2="23" y2="23" />
							{:else}
								<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
								<circle cx="12" cy="12" r="3" />
							{/if}
						</svg>
					</button>
				</div>
			</div>

			<button
				type="button"
				onclick={masukSandi}
				disabled={memproses || !sandi}
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
					<path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
					<polyline points="10 17 15 12 10 7" />
					<line x1="15" y1="12" x2="3" y2="12" />
				</svg>
				{memproses ? 'Memeriksa...' : 'Masuk'}
			</button>

			<button
				type="button"
				onclick={gantiNisn}
				class="w-full text-center text-xs font-bold text-slate-400 transition hover:text-secondary"
			>
				Ganti NISN
			</button>
		</div>
	{/if}
</div>
