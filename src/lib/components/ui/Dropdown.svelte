<script lang="ts">
	import { fade, scale } from 'svelte/transition';

	export interface DropdownOption {
		value: string;
		label: string;
		hint?: string;
	}

	let {
		options,
		value = $bindable(''),
		placeholder = 'Pilih...',
		label,
		hint,
		disabled = false,
		onselect
	}: {
		options: DropdownOption[];
		value?: string;
		placeholder?: string;
		label?: string;
		hint?: string;
		disabled?: boolean;
		onselect?: (value: string) => void;
	} = $props();

	let terbuka = $state(false);
	let sorotan = $state(-1);
	let container: HTMLDivElement | undefined = $state();

	const terpilih = $derived(options.find((o) => o.value === value));

	function toggle() {
		if (disabled) return;
		terbuka = !terbuka;
		if (terbuka) {
			sorotan = Math.max(
				options.findIndex((o) => o.value === value),
				0
			);
		}
	}

	function pilih(option: DropdownOption) {
		value = option.value;
		onselect?.(option.value);
		terbuka = false;
	}

	function keluar() {
		terbuka = false;
	}

	function onKeydown(e: KeyboardEvent) {
		if (disabled) return;
		if (!terbuka) {
			if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
				e.preventDefault();
				toggle();
			}
			return;
		}

		switch (e.key) {
			case 'Escape':
				e.preventDefault();
				keluar();
				break;
			case 'ArrowDown':
				e.preventDefault();
				sorotan = Math.min(sorotan + 1, options.length - 1);
				break;
			case 'ArrowUp':
				e.preventDefault();
				sorotan = Math.max(sorotan - 1, 0);
				break;
			case 'Enter':
			case ' ':
				e.preventDefault();
				if (options[sorotan]) pilih(options[sorotan]);
				break;
			case 'Tab':
				keluar();
				break;
		}
	}

	$effect(() => {
		if (!container) return;

		const node = container;

		function onClick(e: MouseEvent) {
			if (!node.contains(e.target as Node)) keluar();
		}

		window.addEventListener('mousedown', onClick);
		return () => window.removeEventListener('mousedown', onClick);
	});
</script>

<div class="relative" bind:this={container}>
	{#if label}
		<span class="mb-1.5 block text-sm font-bold text-slate-700">{label}</span>
	{/if}

	<button
		type="button"
		onclick={toggle}
		onkeydown={onKeydown}
		{disabled}
		aria-haspopup="listbox"
		aria-expanded={terbuka}
		class="group flex w-full cursor-pointer items-center justify-between gap-2 rounded-2xl border-2 bg-white px-3.5 py-2.5 text-left text-sm transition-all duration-150 {terbuka
			? 'border-secondary ring-2 ring-secondary/20'
			: 'border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] hover:border-secondary/70 hover:shadow-sm active:translate-y-0.5'} {disabled
			? 'cursor-not-allowed opacity-50'
			: ''}"
	>
		<span class="flex min-w-0 flex-col">
			{#if terpilih}
				<span class="truncate font-medium text-slate-800">{terpilih.label}</span>
				{#if terpilih.hint}
					<span class="truncate text-xs text-slate-400">{terpilih.hint}</span>
				{/if}
			{:else}
				<span class="truncate text-slate-400">{placeholder}</span>
			{/if}
		</span>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="h-4 w-4 shrink-0 transition-transform duration-200 {terbuka
				? 'rotate-180 text-secondary'
				: 'text-slate-400 group-hover:text-secondary'}"
		>
			<polyline points="6 9 12 15 18 9" />
		</svg>
	</button>

	{#if hint && !terpilih}
		<p class="mt-1 text-xs text-slate-400">{hint}</p>
	{/if}

	{#if terbuka}
		<div
			class="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border-2 border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white shadow-lg shadow-slate-200/70"
			role="listbox"
			in:scale|local={{ start: 0.96, duration: 120 }}
			out:fade|local={{ duration: 90 }}
		>
			<div class="max-h-60 overflow-y-auto py-1" role="list">
				{#each options as o, i (o.value)}
					<button
						type="button"
						onclick={() => pilih(o)}
						onmouseenter={() => (sorotan = i)}
						role="option"
						aria-selected={o.value === value}
						class="flex w-full cursor-pointer items-center justify-between gap-3 px-3.5 py-2.5 text-left text-sm transition-colors duration-150 {i ===
						sorotan
							? 'bg-secondary/10 text-slate-800'
							: 'text-slate-700'} {o.value === value ? 'font-semibold' : ''}"
					>
						<span class="min-w-0">
							<span class="block truncate">{o.label}</span>
							{#if o.hint}
								<span class="block truncate text-xs text-slate-400">{o.hint}</span>
							{/if}
						</span>
						{#if o.value === value}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="3"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="h-4 w-4 shrink-0 text-secondary"
							>
								<polyline points="20 6 9 17 4 12" />
							</svg>
						{/if}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
