<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Html5Qrcode } from 'html5-qrcode';

	let { onScanSuccess, onScanError } = $props<{
		onScanSuccess: (decodedText: string) => void;
		onScanError?: (errorMessage: string) => void;
	}>();

	let scannerId = 'qr-reader-' + Math.random().toString(36).substring(2, 9);
	let html5QrCode: Html5Qrcode | null = null;
	let isScanning = $state(false);

	onMount(() => {
		html5QrCode = new Html5Qrcode(scannerId);
		startScanner();
	});

	onDestroy(() => {
		stopScanner();
	});

	async function startScanner() {
		if (!html5QrCode) return;
		try {
			await html5QrCode.start(
				{ facingMode: 'environment' },
				{
					fps: 10,
					qrbox: { width: 250, height: 250 }
				},
				(decodedText) => {
					onScanSuccess(decodedText);
				},
				(errorMessage) => {
					if (onScanError) onScanError(errorMessage);
				}
			);
			isScanning = true;
		} catch (err) {
			console.error('Error starting scanner', err);
			if (onScanError) onScanError(String(err));
		}
	}

	async function stopScanner() {
		if (html5QrCode && isScanning) {
			try {
				await html5QrCode.stop();
				isScanning = false;
			} catch (err) {
				console.error('Error stopping scanner', err);
			}
		}
	}
</script>

<div class="relative overflow-hidden rounded-2xl bg-black shadow-inner">
	<div id={scannerId} class="w-full"></div>
	{#if !isScanning}
		<div class="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
			<div class="text-center text-white">
				<div class="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
				<p class="text-xs font-bold">Menyiapkan Kamera...</p>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Mengatur styling bawaan html5-qrcode agar lebih rapi */
	:global(#qr-reader-*) {
		border: none !important;
	}
	:global(#qr-reader-* video) {
		object-fit: cover !important;
	}
</style>
