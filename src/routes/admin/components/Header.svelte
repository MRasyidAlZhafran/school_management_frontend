<script>
	// Ini adalah data dummy, Anda akan mengambilnya dari session/store
	let adminName = 'Bambang Pratama';
	let semesterInfo = 'Semester Ganjil 2024/2025';
</script>

<header
	class="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6"
>
	<div class="flex items-center gap-2">
		<span class="text-sm text-slate-500">Portal Admin</span>
		<span class="material-icons-outlined text-lg text-slate-400">chevron_right</span>
		<span class="text-sm font-medium text-slate-900">Dashboard Pusat Sistem</span>
	</div>

	<div class="flex items-center gap-6">
		<div class="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm">
			<div
				class="h-3 w-3 rounded-full border-2 border-white bg-emerald-500 ring-1 ring-emerald-200"
			></div>
			<span class="font-medium text-emerald-800">All Systems Operational</span>
			<span class="mx-1 text-slate-500">|</span>
			<span class="text-slate-600">Latency: <strong>18ms</strong></span>
		</div>

		<div class="flex items-center gap-4 text-slate-500">
			<button class="hover:text-emerald-600">
				<span class="material-icons-outlined">calendar_today</span>
			</button>
			<div class="relative">
				<button class="hover:text-emerald-600">
					<span class="material-icons-outlined">notifications</span>
				</button>
				<span
					class="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500"
				></span>
			</div>
			<button class="hover:text-emerald-600">
				<span class="material-icons-outlined">help_outline</span>
			</button>
		</div>

		<div class="flex items-center gap-3 border-l border-slate-200 pl-6">
			<div
				class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-200 bg-slate-900 text-lg font-bold text-emerald-400"
			>
				BP
			</div>
			<div class="text-sm">
				<p class="font-semibold text-slate-900">{adminName}</p>
				<p class="text-xs font-medium text-emerald-700">{semesterInfo}</p>
			</div>
		</div>
	</div>
</header>
