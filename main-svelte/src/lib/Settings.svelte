<script lang="ts">
  import { resetAllData, appData } from '../utils/store';
  import { Settings, Trash2, ShieldCheck, Database, RefreshCcw, Info, Lock } from '@lucide/svelte';

  function hardReset() {
    // A secondary check is standard for "Danger Zones"
    const confirmed = confirm("WARNING: This will permanently delete your income, mortgage, car, apartment, and budget data. This cannot be undone.");
    
    if (confirmed) {
      resetAllData();
      window.location.reload();
    }
  }

  // Reactive stats for user peace of mind
  $: totalItems = $appData.budget.needs.length + $appData.budget.wants.length + $appData.budget.investments.length;
  
  $: dataPoints = [
    { label: "Items Saved", value: totalItems },
    { label: "Encryption", value: "SSL/TLS" },
    { label: "Cloud Sync", value: "Disabled" }
  ];
</script>

<main class="md:ml-24 p-4 lg:p-8 max-w-200 mx-auto pb-32">
  <header class="mb-12 ml-2">
    <div class="flex items-center gap-4 mb-2">
      <div class="p-3 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200">
        <Settings size={24} />
      </div>
      <h1 class="text-4xl font-black text-slate-900 tracking-tight">Settings</h1>
    </div>
    <p class="text-slate-500 font-medium italic">Application configuration and privacy controls.</p>
  </header>

  <div class="space-y-6">
    <section class="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
      <div class="flex items-center gap-3 mb-6">
        <Lock class="text-emerald-500" size={20} />
        <h2 class="text-xl font-bold text-slate-800">Privacy & Security</h2>
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
        <div class="flex items-start gap-4 p-5 bg-blue-50 rounded-3xl border border-blue-100">
          <ShieldCheck class="text-blue-600 mt-1" size={24} />
          <div>
            <p class="text-sm font-black text-blue-900 uppercase tracking-tight">Zero-Server Architecture</p>
            <p class="text-xs text-blue-800/70 leading-relaxed mt-1">
              This application is a <b>Client-Side Only</b> tool. Your financial data never leaves your device. We do not use cookies, trackers, or external databases. Your privacy is protected by physics—there is no server to hack.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
      <div class="flex items-center gap-3 mb-4">
        <Info class="text-slate-400" size={20} />
        <h2 class="text-xl font-bold text-slate-800">Disclaimers</h2>
      </div>
      <div class="prose prose-slate prose-sm text-slate-500 text-xs leading-relaxed space-y-3">
        <p>
          <b>Accuracy:</b> While we use 2025 IRS tax brackets and standard mortgage formulas, these are <u>estimates</u>. Real-world factors like local taxes, insurance premiums, and bank fees will cause your actual numbers to vary.
        </p>
        <p>
          <b>Not Financial Advice:</b> This tool is for educational purposes. We are not CPAs, attorneys, or financial advisors. Consult a professional before making major financial decisions.
        </p>
      </div>
    </section>

    <section class="bg-rose-50 rounded-[2.5rem] p-8 border border-rose-100 shadow-sm">
      <div class="flex items-center gap-3 mb-6">
        <Trash2 class="text-rose-600" size={20} />
        <h2 class="text-xl font-bold text-rose-900">Danger Zone</h2>
      </div>

      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="max-w-md">
          <p class="font-bold text-rose-900">Factory Reset</p>
          <p class="text-sm text-rose-800/60 leading-relaxed">Instantly wipe all data. This is useful if you are on a shared computer and want to ensure your numbers aren't seen by the next user.</p>
        </div>
        <button 
          on:click={hardReset}
          class="w-full md:w-auto px-8 py-4 bg-rose-600 text-white rounded-2xl font-black shadow-lg shadow-rose-200 hover:bg-rose-700 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3"
        >
          <RefreshCcw size={18} />
          Wipe All Data
        </button>
      </div>
    </section>

    <footer class="text-center py-12">
      <p class="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Built with Svelte • Hosted on Render</p>
    </footer>
  </div>
</main>