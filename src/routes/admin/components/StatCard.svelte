<script>
	let {
		title,
		value,
		label = '',
		badge = '',
		subValue = null,
		icon,
		iconColor = 'text-emerald-600',
		textColor = 'text-slate-900',
		valueColor = textColor,
		subInfo = undefined
	} = $props();
</script>

<div class="flex flex-col gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
	<div class="flex items-start justify-between gap-4">
		<div class="flex items-center gap-3">
			<div class="rounded-xl bg-emerald-50 p-3 {iconColor}">
				<span class="material-icons-outlined text-2xl">{icon}</span>
			</div>
			<p class="text-sm leading-snug font-medium text-slate-600">{title}</p>
		</div>
		{#if badge}
			<span
				class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold whitespace-nowrap text-emerald-800"
			>
				{badge}
			</span>
		{/if}
	</div>

	<div class="flex flex-1 flex-col justify-end">
		<p class="{valueColor} text-4xl font-extrabold tracking-tight">
			{value}
		</p>
		{#if label}
			<p class="mt-1 text-sm text-slate-500">{label}</p>
		{/if}
		{#if subValue}
			<p class="mt-1 text-xs text-slate-400">{subValue}</p>
		{/if}
	</div>

	{@render subInfo?.()}
</div>
