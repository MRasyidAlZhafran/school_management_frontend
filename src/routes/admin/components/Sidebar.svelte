<script>
	import { page } from '$app/stores';

	const menuItems = [
		{ name: 'Dashboard', icon: 'dashboard', path: '/admin' },
		{ name: 'Attendance', icon: 'person_add', path: '/admin/attendance' },
		{ name: 'Classes', icon: 'class', path: '/admin/classes' },
		{ name: 'Reports', icon: 'assignment', path: '/admin/reports' },
		{ name: 'Settings', icon: 'settings', path: '/admin/settings' }
	];
</script>

<aside class="flex min-h-screen w-64 flex-col space-y-6 bg-slate-900 p-4 text-white">
	<div class="flex items-center gap-3 border-b border-slate-700 p-2">
		<div class="rounded-lg bg-emerald-500/20 p-2 text-emerald-400">
			<span class="material-icons-outlined text-3xl">school</span>
		</div>
		<div>
			<h1 class="text-xl font-bold">EduFlow</h1>
			<p class="text-xs text-slate-400">Academic Portal</p>
		</div>
	</div>

	<button
		class="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-medium text-white shadow-md transition-colors hover:bg-emerald-700"
	>
		<span class="material-icons-outlined text-lg">add_circle</span>
		New Session
	</button>

	<nav class="flex-1 space-y-2">
		{#each menuItems as item (item.path)}
			<!-- eslint-disable svelte/no-navigation-without-resolve -->
			<a
				href={item.path}
				class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors {$page
					.url.pathname === item.path
					? 'bg-emerald-600/10 text-emerald-400'
					: 'text-slate-300 hover:bg-slate-800'}"
			>
				<span class="material-icons-outlined text-xl">{item.icon}</span>
				{item.name}
			</a>
			<!-- eslint-enable svelte/no-navigation-without-resolve -->
		{/each}
	</nav>
</aside>

<style>
	/* Contoh mengimport Material Icons di Svelte */
	@import url('https://fonts.googleapis.com/icon?family=Material+Icons+Outlined');
</style>
