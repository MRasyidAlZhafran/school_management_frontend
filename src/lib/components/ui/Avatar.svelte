<script lang="ts">
	import { warnaAvatar } from '$lib/data/mock-jurnal';

	let { nama, size = 'md' }: { nama: string; size?: 'sm' | 'md' | 'lg' } = $props();

	const inisial = $derived(
		nama
			.split(' ')
			.filter((kata) => kata.length > 0)
			.slice(0, 2)
			.map((kata) => kata[0])
			.join('')
			.toUpperCase()
	);

	const warna = $derived(warnaAvatar[stringToIdx(nama) % warnaAvatar.length]);

	function stringToIdx(str: string): number {
		let total = 0;
		for (let i = 0; i < str.length; i++) total += str.charCodeAt(i);
		return total;
	}

	const ukuran = $derived(
		size === 'sm' ? 'h-8 w-8 text-xs' : size === 'lg' ? 'h-12 w-12 text-base' : 'h-10 w-10 text-sm'
	);
</script>

<div
	class="flex shrink-0 items-center justify-center rounded-full font-semibold {warna} {ukuran}"
	aria-hidden="true"
>
	{inisial}
</div>
