<script lang="ts">
	import { resolve } from '$app/paths';
	import { bacaSesiSiswa } from '$lib/auth.svelte';
	import QrScanner from '$lib/components/ui/QrScanner.svelte';
	import { scanKelasAbsensi } from '$lib/api/absensi';
	import { onMount } from 'svelte';

	let status = $state<'standby' | 'loading' | 'success' | 'error'>('standby');
	let message = $state('');
	
	const sesi = $derived(bacaSesiSiswa());

	function handleScanSuccess(decodedText: string) {
		if (status === 'loading' || status === 'success') return; // Prevent double scan
		
		status = 'loading';
		message = 'Memproses kehadiran...';
		
		const s = sesi;
		if (!s) {
			status = 'error';
			message = 'Sesi tidak valid, harap login ulang.';
			return;
		}

		scanKelasAbsensi({ tokenJadwal: decodedText, siswaId: s.siswaId })
			.then(() => {
				status = 'success';
				message = 'Berhasil! Kehadiran kelas tercatat.';
			})
			.catch((err) => {
				status = 'error';
				message = err instanceof Error ? err.message : 'Gagal mencatat kehadiran. Pastikan QR Code valid.';
				// Auto retry standby after 3 seconds
				setTimeout(() => {
					if (status === 'error') {
						status = 'standby';
						message = '';
					}
				}, 3000);
			});
	}
</script>

<div class="px-4 py-4 max-w-md mx-auto space-y-4">
	<div class="flex items-center gap-3">
		<a
			href={resolve('/siswa/dashboard')}
			class="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white text-slate-500 shadow-sm transition-all active:translate-y-0.5 active:border-b-2"
		>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
				<path d="M15 18l-6-6 6-6" />
			</svg>
		</a>
		<h1 class="text-xl font-black text-primary">Scan Kelas</h1>
	</div>

	<div class="rounded-3xl border-b-4 border-b-[#12243f] bg-gradient-to-br from-primary to-primary/90 p-5 text-white shadow-lg shadow-primary/20">
		<p class="text-[11px] font-black tracking-widest text-white/60 uppercase">Absensi Kelas</p>
		<p class="text-sm font-bold mt-1">Arahkan kamera ke layar guru untuk mencatat kehadiranmu di kelas ini.</p>
	</div>

	{#if status === 'success'}
		<div class="rounded-3xl border-2 border-b-4 border-emerald-200 border-b-emerald-400 bg-emerald-50 p-8 text-center text-emerald-700">
			<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8">
					<polyline points="20 6 9 17 4 12" />
				</svg>
			</div>
			<h2 class="mt-4 text-lg font-black">Hadir Terkonfirmasi!</h2>
			<p class="mt-2 text-xs font-bold text-emerald-600/80">{message}</p>
			
			<a
				href={resolve('/siswa/dashboard')}
				class="mt-6 inline-block w-full rounded-2xl border-b-4 border-b-emerald-600 bg-emerald-500 py-3 text-sm font-black text-white shadow-sm shadow-emerald-500/20 transition-all hover:bg-emerald-600 active:translate-y-0.5 active:border-b-2"
			>
				Kembali ke Beranda
			</a>
		</div>
	{:else}
		<div class="rounded-2xl border-2 border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white p-2 shadow-sm relative">
			<QrScanner onScanSuccess={handleScanSuccess} />
			
			{#if status === 'loading'}
				<div class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl">
					<div class="h-10 w-10 animate-spin rounded-full border-4 border-secondary border-t-transparent"></div>
					<p class="mt-4 text-sm font-black text-slate-700">{message}</p>
				</div>
			{/if}
			
			{#if status === 'error'}
				<div class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-rose-50/95 backdrop-blur-sm rounded-2xl p-6 text-center">
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-500">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
							<circle cx="12" cy="12" r="10" />
							<line x1="12" y1="8" x2="12" y2="12" />
							<line x1="12" y1="16" x2="12.01" y2="16" />
						</svg>
					</div>
					<p class="mt-4 text-sm font-black text-rose-700">Ups, Terjadi Kesalahan</p>
					<p class="mt-1 text-xs font-bold text-rose-600/80">{message}</p>
				</div>
			{/if}
		</div>
	{/if}
</div>
