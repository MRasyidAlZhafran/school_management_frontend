<script lang="ts">
	import { bacaSesi, aturAnakAktif, hapusSesi, inisial } from '$lib/auth.svelte';
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import { daftarAnakDemo } from '$lib/data/mock-ortu';
	import { fade, scale } from 'svelte/transition';

	let tanyaKeluar = $state(false);

	const sesiAktif = $derived(bacaSesi());
	const anakAktif = $derived(
		sesiAktif?.daftarAnak?.find((a) => a.siswaId === sesiAktif.anakAktifId) ??
			sesiAktif?.daftarAnak?.[0]
	);
	const anakLain = $derived(daftarAnakDemo.filter((a) => a.siswaId !== anakAktif?.siswaId));
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
		Mode Demo — akun contoh.
	</div>

	<!-- ============ Kartu Profil Ortu ============ -->
	<div
		class="rounded-3xl border-b-4 border-b-[#12243f] bg-gradient-to-br from-primary to-primary/90 p-5 text-center text-white shadow-lg shadow-primary/20"
	>
		<p class="text-[11px] font-black tracking-widest text-white/60 uppercase">Profil Orang Tua</p>
		<div
			class="mx-auto mt-3 flex h-20 w-20 items-center justify-center rounded-2xl border-b-4 border-slate-300 bg-white text-2xl font-black text-primary shadow-lg shadow-slate-500/30"
		>
			{inisial(sesiAktif?.namaLengkap ?? '')}
		</div>
		<h1 class="mt-4 text-lg font-black">{sesiAktif?.namaLengkap ?? 'Orang Tua'}</h1>
		<p class="mb-4 text-xs text-white/70">Wali Murid</p>
		<div class="flex justify-center gap-2">
			<span
				class="rounded-xl border-2 border-b-4 border-secondary border-b-[#1f8ba3] bg-white/10 px-3 py-1.5 text-xs font-black text-white"
			>
				{daftarAnakDemo.length} Anak
			</span>
			<span
				class="rounded-xl border-2 border-b-4 border-white/20 border-b-white/10 bg-white/5 px-3 py-1.5 text-xs font-black text-white/90"
			>
				{anakAktif?.kelas ?? '-'}
			</span>
		</div>
	</div>

	<!-- ============ Informasi Akun ============ -->
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
				<div class="flex-1">
					<p class="text-[11px] font-bold tracking-wide text-slate-400 uppercase">Nama</p>
					<p class="text-sm font-bold text-slate-800">{sesiAktif?.namaLengkap ?? '-'}</p>
				</div>
			</div>
			<div class="flex items-center gap-3 py-3">
				<div class="flex-1">
					<p class="text-[11px] font-bold tracking-wide text-slate-400 uppercase">Surel</p>
					<p class="text-sm font-bold text-slate-800">{sesiAktif?.surel ?? '-'}</p>
				</div>
			</div>
			<div class="flex items-center gap-3 py-3">
				<div class="flex-1">
					<p class="text-[11px] font-bold tracking-wide text-slate-400 uppercase">Nomor Telepon</p>
					<p class="text-sm font-bold text-slate-800">{sesiAktif?.nomorTelepon ?? '-'}</p>
				</div>
			</div>
		</div>
	</div>

	<!-- ============ Anak & Switch ============ -->
	<div
		class="rounded-2xl border-2 border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white p-4 shadow-sm"
	>
		<div class="mb-2 flex items-center gap-2">
			<div class="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
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
						d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M12 7a4 4 0 10-4-4m7 0a4 4 0 11-4-4"
					/>
				</svg>
			</div>
			<h2 class="text-sm font-black text-primary">Anak</h2>
		</div>

		<div class="space-y-2">
			{#each daftarAnakDemo as anak (anak.siswaId)}
				<div
					class="flex items-center gap-3 rounded-xl border-2 border-b-4 p-2.5 {anak.siswaId ===
					anakAktif?.siswaId
						? 'border-secondary border-b-[#1f8ba3] bg-secondary/5'
						: 'border-slate-200 border-b-slate-300 bg-white'}"
				>
					<Avatar nama={anak.namaLengkap} size="md" />
					<div class="min-w-0 flex-1">
						<p class="truncate text-sm font-bold text-slate-800">{anak.namaLengkap}</p>
						<p class="font-mono text-xs text-neutral-custom">{anak.kelas} · NISN {anak.nisn}</p>
					</div>
					{#if anak.siswaId === anakAktif?.siswaId}
						<span
							class="shrink-0 rounded-full border-2 border-b-2 border-secondary bg-secondary px-2.5 py-0.5 text-[10px] font-black text-white"
						>
							Aktif
						</span>
					{:else}
						<button
							type="button"
							onclick={() => aturAnakAktif(anak.siswaId)}
							class="shrink-0 rounded-full border-2 border-b-2 border-slate-300 bg-slate-50 px-2.5 py-0.5 text-[10px] font-black text-slate-500 transition active:translate-y-0.5"
						>
							Pilih
						</button>
					{/if}
				</div>
			{/each}
		</div>

		{#if anakLain.length > 0}
			<p class="mt-2 text-[11px] font-medium text-slate-400">
				Rekap kehadiran, poin, dan jurnal di aplikasi akan mengikuti anak yang aktif.
			</p>
		{/if}
	</div>

	<!-- ============ Logout ============ -->
	<button
		type="button"
		onclick={() => (tanyaKeluar = true)}
		class="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-b-4 border-rose-300 border-b-rose-400 bg-rose-500 py-3 text-sm font-black text-white shadow-sm shadow-rose-500/20 transition-all duration-150 active:translate-y-0.5 active:border-b-2"
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
		Sekolah App · Portal Orang Tua v1.0
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
						onclick={hapusSesi}
						class="rounded-2xl border-b-4 border-b-rose-600 bg-rose-500 py-3 text-sm font-black text-white transition-all duration-150 active:translate-y-0.5 active:border-b-2"
					>
						Ya, Keluar
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
