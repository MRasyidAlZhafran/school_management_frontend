<script lang="ts">
	import '../app.css';
	import { beforeNavigate, goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { bacaSesi, inisial, inisialisasiSesi } from '$lib/auth.svelte';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	let { children } = $props();

	const pathname = $derived(page.url.pathname);
	const diLogin = $derived(pathname === '/login');
	const sesiAktif = $derived(bacaSesi());

	const urutanRute = ['/', '/guru/jurnal', '/guru/poin', '/guru/profile'];
	const indeksAktif = $derived(Math.max(urutanRute.indexOf(pathname), 0));

	let arahMasuk = $state(1);

	beforeNavigate(({ from, to }) => {
		const asal = from?.url.pathname ?? '';
		const tujuan = to?.url.pathname ?? '';
		if (asal === tujuan) return;
		const indeksTujuan = urutanRute.indexOf(tujuan);
		if (indeksTujuan === -1) return;
		if (asal === '/login') {
			arahMasuk = 1;
		} else {
			arahMasuk = indeksTujuan > urutanRute.indexOf(asal) ? -1 : 0;
		}
	});

	inisialisasiSesi();

	interface TabNav {
		label: string;
		href: '/' | '/guru/jurnal' | '/guru/poin' | '/guru/profile';
		icon: string;
		isAktif: (p: string) => boolean;
	}

	const tabs: TabNav[] = [
		{
			label: 'Home',
			href: '/',
			icon: 'M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10',
			isAktif: (p: string) => p === '/'
		},
		{
			label: 'Absensi',
			href: '/guru/jurnal',
			icon: 'M9 12h6m-6 4h6m2 6H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
			isAktif: (p: string) => p.startsWith('/guru/jurnal')
		},
		{
			label: 'Poin',
			href: '/guru/poin',
			icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
			isAktif: (p: string) => p.startsWith('/guru/poin')
		},
		{
			label: 'Profile',
			href: '/guru/profile',
			icon: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z',
			isAktif: (p: string) => p.startsWith('/guru/profile')
		}
	];

	$effect(() => {
		if (pathname === '/login') {
			if (sesiAktif) void goto(resolve('/'));
			return;
		}
		if (!sesiAktif) void goto(resolve('/login'));
	});
</script>

<!-- Background luar untuk layar lebar -->
<div class="min-h-screen bg-[#0B1F3A]">
	<!-- Kontainer utama gaya HP -->
	<div
		class="relative mx-auto flex min-h-screen max-w-md flex-col border-x border-[#E2E8F0] bg-slate-50"
	>
		{#if !diLogin}
			<!-- Header Mobile -->
			<header class="sticky top-0 z-30 border-b-4 border-primary bg-white">
				<div class="flex items-center justify-between px-4 py-2.5">
					<a href={resolve('/')} class="flex items-center gap-2.5">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-2xl border-b-4 border-secondary bg-primary shadow-sm transition-all active:translate-y-0.5 active:border-b-2"
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="#fff"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="h-5 w-5"
							>
								<path d="M22 10L12 5 2 10l10 5 10-5z" />
								<path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
								<path d="M22 10v6" />
							</svg>
						</div>
						<div>
							<p class="text-sm leading-tight font-black text-primary">Sekolah App</p>
							<span class="text-[10px] font-bold text-slate-400">Portal Guru v1.0</span>
						</div>
					</a>
					<a
						href={resolve('/guru/profile')}
						class="flex h-9 w-9 items-center justify-center rounded-2xl border-b-4 border-primary/70 bg-secondary text-xs font-black text-white shadow-sm transition-all active:translate-y-0.5 active:border-b-2"
					>
						{inisial(sesiAktif?.namaLengkap ?? '')}
					</a>
				</div>
			</header>
		{/if}

		<!-- Konten Utama -->
		<main class="flex-1 pt-4 pb-24">
			{#key pathname}
				<div
					transition:fly={{
						x: arahMasuk === 1 ? 0 : arahMasuk === -1 ? -24 : 24,
						y: arahMasuk === 1 ? 24 : 0,
						duration: arahMasuk === 1 ? 280 : 220,
						easing: cubicOut
					}}
				>
					{@render children()}
				</div>
			{/key}
		</main>

		{#if !diLogin}
			<!-- Bottom Navigation -->
			<nav
				class="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t-2 border-slate-100 bg-white shadow-[0_-4px_12px_rgba(15,23,42,0.06)]"
				aria-label="Navigasi bawah"
			>
				<div class="relative grid grid-cols-4">
					<span
						class="pointer-events-none absolute top-0 left-0 h-1 w-1/4 rounded-b-full bg-secondary transition-transform duration-300 ease-out"
						style="transform: translateX({indeksAktif * 100}%)"
					></span>
					{#each tabs as tab (tab.href)}
						{@const aktif = tab.isAktif(pathname)}
						<a
							href={resolve(tab.href)}
							class="relative flex flex-col items-center gap-0.5 py-2 text-[10px] font-black transition-colors duration-200 {aktif
								? 'text-secondary'
								: 'text-slate-400 hover:text-slate-600'}"
							aria-current={aktif ? 'page' : undefined}
						>
							<span class="relative mt-0.5">
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="h-6 w-6 {aktif ? 'drop-shadow-sm' : ''}"
								>
									<path d={tab.icon} />
								</svg>
							</span>
							<span>{tab.label}</span>
						</a>
					{/each}
				</div>
			</nav>
		{/if}
	</div>
</div>
