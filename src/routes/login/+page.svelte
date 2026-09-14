<script lang="ts">
	import { masukGuru } from '$lib/api/otentikasi';
	import { simpanSesi } from '$lib/auth.svelte';

	let surel = $state('');
	let kataSandi = $state('');
	let lihatSandi = $state(false);
	let memproses = $state(false);
	let pesanError = $state('');

	async function logMasuk() {
		const s = surel.trim();
		if (!s || !kataSandi || memproses) return;
		memproses = true;
		pesanError = '';
		try {
			const hasil = await masukGuru(s, kataSandi);
			simpanSesi(hasil.pengguna, hasil.guru);
		} catch (e) {
			const mentah = e instanceof Error ? e.message : 'Terjadi kesalahan.';
			pesanError =
				mentah === 'Failed to fetch'
					? 'Tidak dapat terhubung ke server. Pastikan backend berjalan di localhost:3000.'
					: mentah;
		} finally {
			memproses = false;
		}
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
				<path d="M22 10L12 5 2 10l10 5 10-5z" />
				<path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
				<path d="M22 10v6" />
			</svg>
		</div>
		<h1 class="mt-4 text-xl font-black">Sekolah App</h1>
		<p class="text-[11px] font-black tracking-widest text-white/60 uppercase">
			Portal Guru · Masuk
		</p>
		<p class="mt-2 text-xs font-medium text-white/70">
			Masuk untuk mengelola absensi, jurnal, dan catatan poin siswa.
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

	<!-- ============ Form Masuk ============ -->
	<form
		onsubmit={(e) => {
			e.preventDefault();
			void logMasuk();
		}}
		class="space-y-4 rounded-2xl border-2 border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white p-4 shadow-sm"
	>
		<div>
			<label for="surel" class="mb-1.5 block text-sm font-bold text-slate-700">Surel</label>
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
					<path d="M4 6h16v12H4z" />
					<polyline points="22,6 12,13 2,6" />
				</svg>
				<input
					id="surel"
					type="email"
					bind:value={surel}
					autocomplete="username"
					placeholder="nama@sekolah.sch.id"
					class="w-full rounded-xl border-2 border-[#E2E8F0] py-2.5 pr-3.5 pl-10 font-medium text-slate-800 placeholder:text-slate-400 focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none"
				/>
			</div>
		</div>

		<div>
			<label for="kata-sandi" class="mb-1.5 block text-sm font-bold text-slate-700">
				Kata Sandi
			</label>
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
					<path
						d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
					/>
				</svg>
				<input
					id="kata-sandi"
					type={lihatSandi ? 'text' : 'password'}
					bind:value={kataSandi}
					autocomplete="current-password"
					placeholder="••••••••"
					class="w-full rounded-xl border-2 border-[#E2E8F0] py-2.5 pr-11 pl-10 font-medium text-slate-800 placeholder:text-slate-400 focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none"
				/>
				<button
					type="button"
					onclick={() => (lihatSandi = !lihatSandi)}
					class="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-secondary"
					aria-label={lihatSandi ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
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
			type="submit"
			disabled={memproses || !surel.trim() || !kataSandi}
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
	</form>

	<!-- ============ Bantuan Pengisian Data ============ -->
	<div
		class="rounded-2xl border-2 border-b-4 border-secondary/30 border-b-secondary/40 bg-secondary/5 p-4 text-xs font-medium text-slate-600"
	>
		<p class="font-black text-secondary">Belum punya akun guru?</p>
		<p class="mt-1 leading-relaxed">
			Buka Swagger UI backend di <span class="font-black text-slate-800">localhost:3000/doc/ui</span
			>, buat data <span class="font-black text-slate-800">pengguna</span> (isi surel & kata sandi),
			lalu buat data <span class="font-black text-slate-800">guru</span> dengan
			<span class="font-black text-slate-800">penggunaId</span> yang sama. Login memakai surel & kata
			sandi tersebut.
		</p>
	</div>
</div>
