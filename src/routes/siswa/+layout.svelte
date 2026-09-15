<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { bacaSesiSiswa, inisial } from '$lib/auth.svelte';

	let { children } = $props();

	let memuat = $state(true);
	const pathname = $derived(page.url.pathname);
	const sesiAktif = $derived(bacaSesiSiswa());

	const urutanRute = ['/siswa/dashboard', '/siswa/poin', '/siswa/profile'];
	const indeksAktif = $derived(Math.max(urutanRute.indexOf(pathname), 0));

	$effect(() => {
		if (!browser) return;
		if (!sesiAktif) {
			window.location.href = '/login-siswa';
		} else {
			memuat = false;
		}
	});

	interface TabNav {
		label: string;
		href: '/siswa/dashboard' | '/siswa/poin' | '/siswa/profile';
		icon: string;
		isAktif: (p: string) => boolean;
	}

	const tabs: TabNav[] = [
		{
			label: 'Beranda',
			href: '/siswa/dashboard',
			icon: 'M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10',
			isAktif: (p: string) => p === '/siswa/dashboard'
		},
		{
			label: 'Poin',
			href: '/siswa/poin',
			icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
			isAktif: (p: string) => p.startsWith('/siswa/poin')
		},
		{
			label: 'Profil',
			href: '/siswa/profile',
			icon: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z',
			isAktif: (p: string) => p.startsWith('/siswa/profile')
		}
	];
</script>

{#if memuat}
	<div class="flex h-screen items-center justify-center bg-slate-50">
		<div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
	</div>
{:else}
	<!--
		fixed inset-0 z-50 = layer independen di atas Root Layout.
		Root Layout tidak bisa mempengaruhi apapun di dalam sini.
		Header dan Nav menggunakan shrink-0, jadi tidak akan pernah bergerak.
		Hanya main yang bisa di-scroll.
	-->
	<div class="fixed inset-0 z-50 mx-auto flex max-w-md flex-col bg-slate-50">
		<!-- Header (shrink-0 = tidak pernah bergerak) -->
		<header class="shrink-0 border-b-4 border-primary bg-white">
			<div class="flex items-center justify-between px-4 py-2.5">
				<a href={resolve('/siswa/dashboard')} class="flex items-center gap-2.5">
					<div class="flex h-10 w-10 items-center justify-center rounded-2xl border-b-4 border-secondary bg-primary shadow-sm">
						<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
							<path d="M12 2a10 10 0 0 0-10 10 10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm0 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
						</svg>
					</div>
					<div>
						<p class="text-sm leading-tight font-black text-primary">Sekolah App</p>
						<span class="text-[10px] font-bold text-slate-400">Portal Siswa v1.0</span>
					</div>
				</a>
				<a
					href={resolve('/siswa/profile')}
					class="flex h-9 w-9 items-center justify-center rounded-2xl border-b-4 border-primary/70 bg-secondary text-xs font-black text-white shadow-sm"
				>
					{inisial(sesiAktif?.namaLengkap ?? '')}
				</a>
			</div>
		</header>

		<!-- Area konten yang bisa di-scroll (flex-1 = mengisi sisa ruang) -->
		<main class="flex-1 overflow-y-auto">
			<div class="pt-4 pb-4">
				{@render children()}
			</div>
		</main>

		<!-- Bottom Navigation (shrink-0 = tidak pernah bergerak) -->
		<nav class="shrink-0 border-t-2 border-slate-100 bg-white">
			<div class="relative grid grid-cols-3">
				<span
					class="pointer-events-none absolute top-0 left-0 h-1 w-1/3 rounded-b-full bg-secondary transition-transform duration-300 ease-out"
					style="transform: translateX({indeksAktif * 100}%)"
				></span>
				{#each tabs as tab (tab.href)}
					{@const aktif = tab.isAktif(pathname)}
					<a
						href={resolve(tab.href)}
						class="relative flex flex-col items-center gap-0.5 py-2 text-[10px] font-black {aktif
							? 'text-secondary'
							: 'text-slate-400 hover:text-slate-600'}"
					>
						<span class="relative mt-0.5">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 {aktif ? 'drop-shadow-sm' : ''}">
								<path d={tab.icon} />
							</svg>
						</span>
						<span>{tab.label}</span>
					</a>
				{/each}
			</div>
		</nav>
	</div>
{/if}
