<script>
  import Sidebar from './components/Sidebar.svelte';
  import Header from './components/Header.svelte';

  let { children } = $props();
</script>

<div class="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
  <Sidebar />

  <div class="flex-1 flex flex-col pl-64"> <Header />

    <main class="flex-1 p-8 xl:p-10">
      {@render children()}
    </main>
  </div>
</div>

<style>
  /* Import Material Icons secara global di layout admin */
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons+Outlined');
</style>