<script>
  import { page } from '$app/stores';

  const menuItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/admin' },
    { name: 'Attendance', icon: 'person_add', path: '/admin/attendance' },
    { name: 'Classes', icon: 'class', path: '/admin/classes' },
    { name: 'Reports', icon: 'assignment', path: '/admin/reports' },
    { name: 'Settings', icon: 'settings', path: '/admin/settings' },
  ];
</script>

<aside class="w-64 bg-slate-900 text-white flex flex-col p-4 space-y-6 min-h-screen">
  <div class="flex items-center gap-3 p-2 border-b border-slate-700">
    <div class="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
      <span class="material-icons-outlined text-3xl">school</span>
    </div>
    <div>
      <h1 class="text-xl font-bold">EduFlow</h1>
      <p class="text-xs text-slate-400">Academic Portal</p>
    </div>
  </div>

  <button class="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl shadow-md transition-colors">
    <span class="material-icons-outlined text-lg">add_circle</span>
    New Session
  </button>

  <nav class="flex-1 space-y-2">
    {#each menuItems as item}
      <a href={item.path} class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors {$page.url.pathname === item.path ? 'bg-emerald-600/10 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'}" >
        <span class="material-icons-outlined text-xl">{item.icon}</span>
        {item.name}
      </a>
    {/each}
  </nav>
</aside>

<style>
  /* Contoh mengimport Material Icons di Svelte */
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons+Outlined');
</style>