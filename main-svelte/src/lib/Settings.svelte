<script>
  import { resetAllData, appData } from '../utils/store.ts';
  import { Settings, Trash2, ShieldCheck, Database, RefreshCcw, Info } from '@lucide/svelte';

  function hardReset() {
    const confirmed = confirm("WARNING: This will permanently delete your income, mortgage, car, apartment, and budget data. This cannot be undone.");
    
    if (confirmed) {
      resetAllData()
      // Give the user a tiny toast or just reload
      window.location.reload();
    }
  }

  // Calculate some stats for the "Data Health" section
  $: dataPoints = [
    { label: "Needs Items", value: $appData.budget.needs.length },
    { label: "Income Set", value: $appData.income.salary ? "Yes" : "No" },
    { label: "Storage Key", value: "app_data" }
  ];
</script>

<main class="md:ml-24 p-4 lg:p-8 max-w-[800px] mx-auto pb-32">
  <header class="mb-12 ml-2">
    <div class="flex items-center gap-4 mb-2">
      <div class="p-3 bg-slate-900 text-white rounded-2xl">
        <Settings size={24} />
      </div>
      <h1 class="text-4xl font-black text-slate-900 tracking-tight">Settings</h1>
    </div>
    <p class="text-slate-500 font-medium">Manage your data and application preferences.</p>
  </header>

  <div class="space-y-8">
    <section class="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
      <div class="flex items-center gap-3 mb-6">
        <Database class="text-blue-600" size={20} />
        <h2 class="text-xl font-bold text-slate-800">Data & Storage</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {#each dataPoints as point}
          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{point.label}</p>
            <p class="text-lg font-bold text-slate-900">{point.value}</p>
          </div>
        {/each}
      </div>

      <div class="space-y-4">
        <div class="flex items-start gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
          <Info class="text-amber-600 mt-1" size={20} />
          <div>
            <p class="text-sm font-bold text-amber-900">Local Privacy</p>
            <p class="text-xs text-amber-800/70 leading-relaxed">Your data is stored locally in your browser's <b>LocalStorage</b>. It is never sent to a server. Clearing your browser cache will delete your budget.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-rose-50 rounded-[2.5rem] p-8 border border-rose-100 shadow-sm shadow-rose-50">
      <div class="flex items-center gap-3 mb-6">
        <Trash2 class="text-rose-600" size={20} />
        <h2 class="text-xl font-bold text-rose-900">Danger Zone</h2>
      </div>

      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="max-w-md">
          <p class="font-bold text-rose-900">Factory Reset</p>
          <p class="text-sm text-rose-800/60 leading-relaxed">Instantly wipe every calculator and budget item. This action is irreversible.</p>
        </div>
        <button 
          on:click={hardReset}
          class="w-full md:w-auto px-8 py-4 bg-rose-600 text-white rounded-2xl font-black shadow-lg shadow-rose-200 hover:bg-rose-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
        >
          <RefreshCcw size={18} />
          Reset Everything
        </button>
      </div>
    </section>

    <footer class="text-center py-8">
      <div class="flex justify-center gap-2 mb-4">
        <ShieldCheck size={16} class="text-emerald-500" />
        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Privacy Verified • 2025 Edition</p>
      </div>
    </footer>
  </div>
</main>