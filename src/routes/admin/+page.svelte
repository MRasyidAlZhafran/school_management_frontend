<script>
  import StatCard from './components/StatCard.svelte';
</script>

<div class="space-y-10">
  <div class="flex items-start justify-between gap-6">
    <div>
      <h2 class="text-3xl font-extrabold text-slate-950 tracking-tight">EduFlow System Administration</h2>
      <p class="text-sm text-slate-600 mt-2 max-w-2xl">
        Infrastruktur Jaringan Presensi QR Dinamis AES-256 & Manajemen Pengguna Terpusat.
        Pantau performa dan keamanan sesi presensi real-time di seluruh area sekolah.
      </p>
    </div>
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-100 shadow-sm">
        <span class="material-icons-outlined text-lg text-slate-400">sync</span>
        <span class="text-sm text-slate-700 font-medium">Engine Status: <strong class="text-emerald-700">ROTATING</strong></span>
      </div>
      <button class="flex items-center gap-2.5 bg-slate-900 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-slate-800 transition shadow-lg active:scale-95">
        <span class="material-icons-outlined text-xl">cloud_sync</span>
        Sinkronisasi Dapodik
      </button>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
    <StatCard
      title="Total Pengguna Aktif Hari Ini"
      value="3,800"
      label="Total Siswa, Guru, Wali, Ortu terdaftar"
      icon="people_outline"
    />

    <StatCard
      title="Sesi QR Aktif Berjalan"
      value="48"
      label="Dari total 52 ruang kelas terkonfigurasi"
      badge="Rotasi 10s Aktif"
      icon="qr_code_scanner"
    />

    <StatCard
      title="Status Gateway & Wi-Fi Beacons"
      value="58/58"
      label="SSID EduFlow-Secure Terisolasi"
      badge="100% Online"
      icon="router"
    />

    <StatCard
      title="Percobaan Fraud / Anomali Hari Ini"
      value="3"
      badge="Diproteksi"
      icon="security"
      iconColor="text-red-600"
      valueColor="text-red-600"
    >
      {#snippet subInfo()}
        <div class="flex items-center gap-4 text-xs text-red-700 font-semibold mt-2.5 bg-red-50 p-2 rounded-lg border border-red-100">
          <p>Device ID Mismatch: <strong>2x</strong></p>
          <p>Geofence Out of Bounds: <strong>1x</strong></p>
        </div>
      {/snippet}
    </StatCard>
  </div>

  <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
    <div class="xl:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-slate-950">Beban Throughput Request Presensi Real-Time</h3>
        <span class="text-sm font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">Puncak: 480 Req/Detik</span>
      </div>
      <div class="h-80 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-400">
        [ Area Chart.js / Svelte-Chartjs ]
      </div>
    </div>

    <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
      <h3 class="text-xl font-bold text-slate-950">Log Aktivitas Sistem & Security Audit Trail</h3>
      <div class="space-y-4 text-sm text-slate-600">
        <div class="p-4 bg-red-50 text-red-800 rounded-lg border border-red-100">
          <strong>07:18:42 Wib</strong> Device ID Spoofing Terdeteksi (Xiaomi 12T) - <strong>BLOCKED</strong>
        </div>
        <div class="p-4 bg-amber-50 text-amber-800 rounded-lg border border-amber-100">
          <strong>07:12:05 Wib</strong> Geofence Radius Out of Bounds (Siswa NISN: ...) - <strong>WARNING</strong>
        </div>
        <div class="p-4 bg-slate-50 rounded-lg border border-slate-100 text-slate-700">
          <strong>07:10:00 Wib</strong> Dynamic QR Key Rolled (Cluster-Wide) - <strong>SUKSES</strong>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mt-10">
    <h3 class="text-xl font-bold text-slate-950 mb-6">Aksi Cepat Konfigurasi</h3>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      {#each ['Tambah Pengguna Massal', 'Sinkronisasi Jadwal', 'Konfigurasi Geofencing', 'Unduh Log Audit'] as action}
        <button class="flex flex-col items-center gap-3 p-6 text-center bg-slate-50 border border-slate-100 rounded-2xl hover:bg-emerald-50 hover:border-emerald-100 hover:text-emerald-800 transition">
          <span class="material-icons-outlined text-4xl text-emerald-600">settings_applications</span>
          <span class="text-sm font-semibold text-slate-800 group-hover:text-emerald-900">{action}</span>
        </button>
      {/each}
    </div>
  </div>

</div>