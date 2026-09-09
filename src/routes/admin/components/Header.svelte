<script>
  // Ini adalah data dummy, Anda akan mengambilnya dari session/store
  let adminName = "Bambang Pratama";
  let semesterInfo = "Semester Ganjil 2024/2025";
</script>

<header class="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-50">
  <div class="flex items-center gap-2">
    <span class="text-sm text-slate-500">Portal Admin</span>
    <span class="material-icons-outlined text-lg text-slate-400">chevron_right</span>
    <span class="text-sm font-medium text-slate-900">Dashboard Pusat Sistem</span>
  </div>

  <div class="flex items-center gap-6">
    <div class="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-sm">
      <div class="w-3 h-3 bg-emerald-500 rounded-full border-2 border-white ring-1 ring-emerald-200"></div>
      <span class="font-medium text-emerald-800">All Systems Operational</span>
      <span class="text-slate-500 mx-1">|</span>
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
        <span class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
      </div>
      <button class="hover:text-emerald-600">
        <span class="material-icons-outlined">help_outline</span>
      </button>
    </div>

    <div class="flex items-center gap-3 pl-6 border-l border-slate-200">
      <div class="w-10 h-10 rounded-full bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-lg border-2 border-slate-200">
        BP
      </div>
      <div class="text-sm">
        <p class="font-semibold text-slate-900">{adminName}</p>
        <p class="text-xs text-emerald-700 font-medium">{semesterInfo}</p>
      </div>
    </div>
  </div>
</header>