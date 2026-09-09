<script lang="ts">
	import QRCode from 'qrcode';
	import { onMount } from 'svelte';
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import {
		ambilJadwalJurnal,
		kirimJurnalSesi,
		overrideAbsensi,
		petaStatusAPI,
		petaStatusLocal,
		type SiswaJurnalLocal,
		type StatusJurnal
	} from '$lib/api/jurnal';

	const ID_JADWAL = 1;

	let kelas = $state('Kelas');
	let mataPelajaran = $state('Mata Pelajaran');
	let ruangan = $state('-');
	let tanggal = $state(new Date().toISOString().slice(0, 10));
	let jamMulai = $state('--:--');
	let jamSelesai = $state('--:--');

	let materi = $state('');
	let catatan = $state('');

	let loading = $state(true);
	let error = $state('');
	let pesanError = $state('');

	// ---- State QR Presensi ----
	let qrTerbuka = $state(false);
	let countdown = $state(30);
	let qrCodeUrl = $state('');
	let tokenAktif = $state('');
	let sesiBerjalan = $state(true);
	let otomatisScan = $state(true);

	let suksesKirim = $state(false);
	let pesanSukses = $state('');
	let menyimpan = $state(false);

	let daftarSiswa = $state<SiswaJurnalLocal[]>([]);

	const hadir = $derived(
		daftarSiswa.filter((s) => s.status === 'hadir' || s.status === 'terlambat').length
	);
	const belum = $derived(
		daftarSiswa.filter((s) => s.status !== 'hadir' && s.status !== 'terlambat').length
	);
	const persenHadir = $derived(
		daftarSiswa.length === 0 ? 0 : Math.round((hadir / daftarSiswa.length) * 100)
	);

	const hariTanggal = $derived(
		new Date(`${tanggal}T00:00:00`).toLocaleDateString('id-ID', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})
	);

	const tampilanStatus: Record<StatusJurnal, { label: string; kelas: string }> = {
		hadir: { label: 'Hadir', kelas: 'bg-emerald-100 text-emerald-700' },
		terlambat: { label: 'Terlambat', kelas: 'bg-amber-100 text-amber-700' },
		izin: { label: 'Izin', kelas: 'bg-amber-100 text-amber-700' },
		sakit: { label: 'Sakit', kelas: 'bg-blue-100 text-blue-700' },
		alpa: { label: 'Alpa', kelas: 'bg-rose-100 text-rose-700' },
		belum: { label: 'Belum', kelas: 'bg-slate-100 text-slate-500' }
	};

	const kelasTombolManual: Record<'hadir' | 'izin' | 'sakit' | 'alpa', string> = {
		hadir: 'bg-emerald-50 text-emerald-700 border-emerald-200 border-b-emerald-400',
		izin: 'bg-amber-50 text-amber-700 border-amber-200 border-b-amber-400',
		sakit: 'bg-blue-50 text-blue-700 border-blue-200 border-b-blue-400',
		alpa: 'bg-rose-50 text-rose-700 border-rose-200 border-b-rose-400'
	};

	function pesanErr(e: unknown): string {
		if (e instanceof Error && e.message) return e.message;
		return 'Terjadi kesalahan tak terduga';
	}

	async function muatJadwal() {
		loading = true;
		error = '';
		pesanError = '';
		try {
			const data = await ambilJadwalJurnal(ID_JADWAL);
			kelas = data.jadwal.nama_kelas;
			mataPelajaran = data.jadwal.nama_mapel;
			ruangan = data.jadwal.ruangan;
			const [mulai, selesai] = data.jadwal.jam.split(' - ');
			jamMulai = mulai?.trim() ?? '--:--';
			jamSelesai = selesai?.trim() ?? '--:--';
			daftarSiswa = data.siswa.map((s) => ({
				id: s.id_siswa,
				nisn: s.nisn,
				nama: s.nama_lengkap,
				status: petaStatusAPI[s.status_kehadiran] ?? 'belum',
				waktuScan: s.waktu_scan
			}));
		} catch (e) {
			error = pesanErr(e);
		} finally {
			loading = false;
		}
	}

	onMount(muatJadwal);

	// ==== QR Code / Token generation + countdown ====
	let interval: ReturnType<typeof setInterval> | undefined;

	function buatTokenBaru() {
		const ts = Math.floor(Date.now() / 30000);
		tokenAktif = `${kelas}-${mataPelajaran}-${ts}`;
		QRCode.toDataURL(tokenAktif, { width: 240, margin: 2 })
			.then((url) => (qrCodeUrl = url))
			.catch(() => (qrCodeUrl = ''));
	}

	function mulaiSesi() {
		qrTerbuka = true;
		sesiBerjalan = true;
		otomatisScan = true;
		countdown = 30;
		buatTokenBaru();

		interval = setInterval(() => {
			countdown -= 1;
			if (countdown <= 0) {
				countdown = 30;
				buatTokenBaru();
				if (otomatisScan && sesiBerjalan) simulasikanScan();
			}
		}, 1000);
	}

	function tutupSesi() {
		qrTerbuka = false;
		sesiBerjalan = false;
		if (interval) clearInterval(interval);
	}

	// Simulasi siswa scan QR secara acak (demo)
	const namaSiswaTersedia = $derived(
		daftarSiswa.filter((s) => s.status === 'belum').map((s) => s.id)
	);
	function simulasikanScan() {
		if (namaSiswaTersedia.length === 0 || !sesiBerjalan) return;
		const rnd = Math.floor(Math.random() * namaSiswaTersedia.length);
		kirimStatus(namaSiswaTersedia[rnd], 'hadir');
	}

	// Ubah status optimistik + kirim override ke API; rollback jika gagal
	async function kirimStatus(siswaId: number, status: StatusJurnal) {
		const siswa = daftarSiswa.find((s) => s.id === siswaId);
		if (!siswa) return;
		const statusSebelum = siswa.status;
		siswa.status = status;
		if (status === 'belum') return;
		try {
			await overrideAbsensi({
				id_jadwal: ID_JADWAL,
				id_siswa: siswaId,
				status_kehadiran: petaStatusLocal[status]
			});
		} catch (e) {
			siswa.status = statusSebelum;
			pesanError = `Gagal mengubah status ${siswa.nama}: ${pesanErr(e)}`;
		}
	}

	function aturStatusManual(siswaId: number, status: StatusJurnal) {
		kirimStatus(siswaId, status);
	}

	function setSisaSiswaHadir() {
		for (const siswa of daftarSiswa) if (siswa.status === 'belum') kirimStatus(siswa.id, 'hadir');
	}

	function scrollManual() {
		otomatisScan = false;
	}

	async function simpanJurnal() {
		if (menyimpan) return;
		menyimpan = true;
		pesanError = '';
		pesanSukses = '';
		suksesKirim = false;
		try {
			await kirimJurnalSesi({
				id_jadwal: ID_JADWAL,
				materi_pembelajaran: materi,
				catatan_jurnal: catatan,
				daftar_siswa: daftarSiswa.map((s) => ({
					id_siswa: s.id,
					status_kehadiran: s.status === 'belum' ? 'BELUM' : petaStatusLocal[s.status]
				}))
			});
			pesanSukses = `Jurnal ${mataPelajaran} • ${kelas} berhasil dikirim. ${hadir} siswa hadir dari ${daftarSiswa.length}.`;
			suksesKirim = true;
		} catch (e) {
			pesanError = `Gagal mengirim jurnal: ${pesanErr(e)}`;
		} finally {
			menyimpan = false;
		}
	}
</script>

<div class="space-y-4 px-4">
	{#if qrTerbuka}
		<!-- Modal Fullscreen QR Presensi -->
		<div class="fixed inset-0 z-50 flex flex-col bg-primary">
			<!-- Header modal -->
			<div class="flex items-center justify-between px-4 py-3">
				<div>
					<p class="text-[11px] font-black tracking-widest text-white/50 uppercase">
						Presensi QR • Sesi Berjalan
					</p>
					<p class="text-sm font-extrabold text-white">{kelas} — {mataPelajaran}</p>
				</div>
				<button
					type="button"
					onclick={tutupSesi}
					class="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition active:scale-95"
					aria-label="Tutup"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="h-5 w-5"
					>
						<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>
			</div>

			<div class="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-6">
				<!-- Countdown ring -->
				<div class="relative flex h-24 w-24 items-center justify-center">
					<svg viewBox="0 0 100 100" class="h-24 w-24 -rotate-90">
						<circle
							cx="50"
							cy="50"
							r="44"
							fill="none"
							stroke="rgba(255,255,255,0.15)"
							stroke-width="6"
						/>
						<circle
							cx="50"
							cy="50"
							r="44"
							fill="none"
							stroke="#2DADC2"
							stroke-width="6"
							stroke-linecap="round"
							stroke-dasharray="276.46"
							stroke-dashoffset={276.46 * (1 - countdown / 30)}
							class="transition-[stroke-dashoffset] duration-1000 ease-linear"
						/>
					</svg>
					<span class="absolute text-2xl font-black text-white">{countdown}s</span>
				</div>
				<p class="text-xs text-white/60">Token QR diperbarui setiap 30 detik</p>

				<!-- QR Code -->
				{#if qrCodeUrl}
					<div
						class="rounded-2xl border-b-4 border-b-white/30 bg-white p-4 shadow-2xl shadow-secondary/20"
					>
						<img src={qrCodeUrl} alt="QR Code presensi" class="h-56 w-56" />
					</div>
				{:else}
					<div
						class="flex h-56 w-56 items-center justify-center rounded-2xl bg-white/10 text-white"
					>
						<span class="text-sm font-bold">Memuat QR...</span>
					</div>
				{/if}

				<!-- Counter real-time -->
				<div class="text-center">
					<p class="text-3xl font-black text-secondary">
						{hadir} <span class="text-lg font-bold text-white/60">/ {daftarSiswa.length}</span>
					</p>
					<p class="text-sm text-white/70">Siswa Hadir</p>
				</div>

				<!-- Progress -->
				<div class="w-full max-w-xs">
					<div class="h-3 w-full overflow-hidden rounded-full border border-white/20 bg-white/15">
						<div
							class="h-full rounded-full border-r-2 border-b-2 border-b-[#1f8ba3] bg-secondary transition-all duration-500"
							style="width: {persenHadir}%"
						></div>
					</div>
					<div class="mt-2 flex items-center justify-between text-xs text-white/60">
						<span>Ajar siswa menunjuk QR ke kamera kelas</span>
						<span class="font-bold text-secondary">{persenHadir}%</span>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- ============ Header Jurnal ============ -->
	<div
		class="rounded-3xl border-b-4 border-b-[#12243f] bg-gradient-to-br from-primary to-primary/90 p-4 text-white shadow-lg shadow-primary/20"
	>
		<p class="text-[11px] font-black tracking-widest text-white/60 uppercase">
			Jurnal & Presensi {ruangan !== '-' ? `• Ruang ${ruangan}` : ''}
		</p>
		<h1 class="mt-0.5 text-lg font-black">{mataPelajaran}</h1>
		<div class="mt-3 grid grid-cols-3 gap-2 text-center">
			<div class="rounded-xl border-b-4 border-b-white/15 bg-white/10 p-2">
				<p class="text-[10px] font-bold text-white/60">Kelas</p>
				<p class="text-sm font-extrabold">{kelas}</p>
			</div>
			<div class="rounded-xl border-b-4 border-b-white/15 bg-white/10 p-2">
				<p class="text-[10px] font-bold text-white/60">Jam</p>
				<p class="text-sm font-extrabold">{jamMulai}–{jamSelesai}</p>
			</div>
			<div class="rounded-xl border-b-4 border-b-white/15 bg-white/10 p-2">
				<p class="text-[10px] font-bold text-white/60">Tanggal</p>
				<p class="truncate text-sm font-extrabold">{hariTanggal.split(',')[0]}</p>
			</div>
		</div>
	</div>

	{#if loading}
		<!-- ============ Loading Skeleton ============ -->
		<div class="space-y-3" aria-live="polite" aria-busy="true">
			<div class="h-32 animate-pulse rounded-2xl border-b-4 border-b-slate-200 bg-slate-200"></div>
			<div class="h-20 animate-pulse rounded-2xl border-b-4 border-b-slate-200 bg-slate-200"></div>
			{#each [1, 2, 3] as n (n)}
				<div
					class="h-20 animate-pulse rounded-2xl border-b-4 border-b-slate-200 bg-slate-100"
					style="animation-delay: {n * 120}ms"
				></div>
			{/each}
			<p class="text-center text-xs font-bold text-slate-400">Memuat data jurnal...</p>
		</div>
	{:else if error}
		<!-- ============ Error ============ -->
		<div
			class="rounded-2xl border-2 border-b-4 border-rose-300 border-b-rose-400 bg-rose-50 p-4"
			role="alert"
		>
			<p class="text-sm font-extrabold text-rose-700">Gagal memuat data jurnal</p>
			<p class="mt-0.5 text-xs font-medium text-rose-600">{error}</p>
			<button
				type="button"
				onclick={muatJadwal}
				class="mt-3 w-full rounded-xl border-2 border-b-4 border-teal-300 border-b-teal-400 bg-white py-2.5 text-sm font-extrabold text-secondary transition active:translate-y-0.5 active:border-b-2"
			>
				Muat Ulang
			</button>
		</div>
	{:else}
		<!-- ============ Mode Presensi QR (Fitur Utama) ============ -->
		<div
			class="rounded-2xl border-2 border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white p-4 shadow-sm"
		>
			<div class="mb-3 flex items-center gap-2">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/15 text-secondary"
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
						<rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
						<rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
					</svg>
				</div>
				<h2 class="font-extrabold text-primary">Presensi QR Code</h2>
			</div>
			<button
				type="button"
				onclick={mulaiSesi}
				class="flex w-full items-center justify-center gap-2 rounded-2xl border-b-4 border-b-[#1f8ba3] bg-secondary py-3.5 text-sm font-black text-white shadow-lg shadow-secondary/30 transition-all duration-150 active:translate-y-0.5 active:border-b-2"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="h-4 w-4"
				>
					<rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
					<rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
				</svg>
				Tampilkan QR Presensi Kelas
			</button>
			<p class="mt-2 text-center text-[11px] font-medium text-slate-400">
				QR diperbarui otomatis tiap 30 detik & mencerminkan siswa yang mengabsen.
			</p>
		</div>

		<!-- ============ Daftar Siswa & Override Manual ============ -->
		<div class="flex items-center justify-between">
			<h2 class="text-base font-black text-primary">Daftar Siswa</h2>
			<button
				type="button"
				onclick={setSisaSiswaHadir}
				class="rounded-xl border-2 border-b-4 border-teal-300 border-b-teal-400 bg-white px-3 py-1 text-xs font-extrabold text-secondary transition active:translate-y-0.5 active:border-b-2"
			>
				Set Sisa Siswa Hadir
			</button>
		</div>

		<p class="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
			<span
				class="rounded-lg border-b-2 border-b-emerald-300 bg-emerald-100 px-2 py-0.5 font-bold text-emerald-700"
			>
				Hadir {hadir}
			</span>
			<span
				class="rounded-lg border-b-2 border-b-slate-300 bg-slate-100 px-2 py-0.5 font-bold text-slate-600"
			>
				Belum {belum}
			</span>
			<span class="text-slate-400">· Ubah status manual jika HP siswa bermasalah.</span>
		</p>

		<div class="space-y-3">
			{#each daftarSiswa as siswa, i (siswa.id)}
				<div
					class="rounded-2xl border-2 border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white p-3.5 shadow-sm"
				>
					<div class="flex items-center gap-3">
						<Avatar nama={siswa.nama} size="md" />
						<div class="min-w-0 flex-1">
							<p class="truncate text-sm font-bold text-slate-800">{siswa.nama}</p>
							<p class="font-mono text-xs text-neutral-custom">NISN {siswa.nisn}</p>
						</div>
						<span
							class="rounded-full border-b-2 px-2.5 py-1 text-xs font-black {tampilanStatus[
								siswa.status
							].kelas}"
						>
							{tampilanStatus[siswa.status].label}
						</span>
					</div>
					{#if siswa.status !== 'hadir'}
						<p class="mt-3 mb-2 text-[11px] font-bold text-slate-400">
							Markah manual ({i + 1}):
						</p>
						<div class="grid grid-cols-4 gap-1.5">
							<button
								type="button"
								onclick={() => {
									scrollManual();
									aturStatusManual(siswa.id, 'hadir');
								}}
								class="rounded-xl border-2 border-b-4 py-1.5 text-[11px] font-black transition active:translate-y-0.5 active:border-b-2 {kelasTombolManual.hadir}"
							>
								Hadir
							</button>
							<button
								type="button"
								onclick={() => {
									scrollManual();
									aturStatusManual(siswa.id, 'izin');
								}}
								class="rounded-xl border-2 border-b-4 py-1.5 text-[11px] font-black transition active:translate-y-0.5 active:border-b-2 {kelasTombolManual.izin}"
							>
								Izin
							</button>
							<button
								type="button"
								onclick={() => {
									scrollManual();
									aturStatusManual(siswa.id, 'sakit');
								}}
								class="rounded-xl border-2 border-b-4 py-1.5 text-[11px] font-black transition active:translate-y-0.5 active:border-b-2 {kelasTombolManual.sakit}"
							>
								Sakit
							</button>
							<button
								type="button"
								onclick={() => {
									scrollManual();
									aturStatusManual(siswa.id, 'alpa');
								}}
								class="rounded-xl border-2 border-b-4 py-1.5 text-[11px] font-black transition active:translate-y-0.5 active:border-b-2 {kelasTombolManual.alpa}"
							>
								Alpa
							</button>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		{#if suksesKirim}
			<div
				class="flex items-center gap-2 rounded-2xl border-2 border-b-4 border-emerald-300 border-b-emerald-400 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700"
				role="status"
			>
				<span
					class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="3"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="h-3 w-3"
					>
						<path d="M5 13l4 4L19 7" />
					</svg>
				</span>
				{pesanSukses}
			</div>
		{/if}

		{#if pesanError}
			<div
				class="flex items-center gap-2 rounded-2xl border-2 border-b-4 border-rose-300 border-b-rose-400 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-600"
				role="alert"
			>
				<span
					class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="3"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="h-3 w-3"
					>
						<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</span>
				{pesanError}
			</div>
		{/if}

		<!-- ============ Form Catatan Jurnal ============ -->
		<div
			class="rounded-2xl border-2 border-b-4 border-[#E2E8F0] border-b-[#CBD5E1] bg-white p-4 shadow-sm"
		>
			<h3 class="mb-3 font-black text-primary">Catatan Jurnal</h3>
			<div class="space-y-4">
				<div>
					<label
						for="materi"
						class="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-slate-700"
					>
						Materi Pembelajaran
						<span class="text-xs font-medium text-slate-400">({materi.length}/500)</span>
					</label>
					<textarea
						id="materi"
						bind:value={materi}
						maxlength="500"
						rows="4"
						placeholder="Tuliskan materi yang diajarkan hari ini..."
						class="w-full rounded-xl border-2 border-[#E2E8F0] p-3 text-sm font-medium placeholder:text-slate-400 focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none"
					></textarea>
				</div>
				<div>
					<label
						for="catatan"
						class="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-slate-700"
					>
						Catatan Kondisi Kelas
						<span class="text-xs font-medium text-slate-400">({catatan.length}/500)</span>
					</label>
					<textarea
						id="catatan"
						bind:value={catatan}
						maxlength="500"
						rows="3"
						placeholder="Catatan kondisi kelas, kendala, dll..."
						class="w-full rounded-xl border-2 border-[#E2E8F0] p-3 text-sm font-medium placeholder:text-slate-400 focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none"
					></textarea>
				</div>
				<button
					type="button"
					onclick={simpanJurnal}
					disabled={menyimpan}
					class="flex w-full items-center justify-center gap-2 rounded-2xl border-b-4 border-b-[#12243f] bg-primary py-3.5 text-sm font-black text-white shadow-md shadow-primary/20 transition-all duration-150 active:translate-y-0.5 active:border-b-2 disabled:cursor-not-allowed disabled:opacity-60"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="h-4 w-4"
					>
						<line x1="22" y1="2" x2="11" y2="13" />
						<polygon points="22 2 15 22 11 13 2 9 22 2" />
					</svg>
					{menyimpan ? 'Menyimpan...' : 'Simpan & Selesaikan Sesi'}
				</button>
			</div>
		</div>
	{/if}
</div>
