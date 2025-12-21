<script lang="ts">
  import { appData } from '../utils/store.js';
  import { Banknote, Wallet, ReceiptText, ArrowRight, Clock } from '@lucide/svelte';
  import { slide } from 'svelte/transition';
  
  // 1. Local State
  let mode = "salary"; // "salary" or "hourly"
  let salary = $appData.income.salary || null;
  let hourlyRate:any = null;
  let hoursPerMonth = 160; // Default 40hrs/week
  
  let frequency = 12; 
  let status = "single";

  // 2. Reactive Calculation for Annual Salary
  // If in hourly mode, we override 'salary' with the calculation
  $: displaySalary = mode === "salary" 
    ? (salary || 0) 
    : (hourlyRate || 0) * (hoursPerMonth || 0) * 12;

  // 3. Reactive Tax Logic (Uses displaySalary)
  $: fica = displaySalary * 0.0765;
  
  $: fed = (() => {
    let tax = 0;
    if (displaySalary > 11600) tax += (Math.min(displaySalary, 47150) - 11600) * 0.12;
    if (displaySalary > 47150) tax += (displaySalary - 47150) * 0.22;
    return tax;
  })();

  $: totalTax = fica + fed;
  $: netAnnual = displaySalary - totalTax;
  $: netMonthly = netAnnual / 12;
  $: effectiveRate = displaySalary > 0 ? (totalTax / displaySalary) * 100 : 0;

  // 4. Actions
  let feedback = false;

  function pushToBudget() {
    $appData.income.salary = Math.round(displaySalary);
    $appData.income.net_monthly = Math.round(netMonthly);
    
    feedback = true;
    setTimeout(() => feedback = false, 2000);
  }
</script>

<main class="md:ml-24 p-4 lg:p-8 max-w-[1200px] mx-auto pb-32">
  
  <header class="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 mb-8 border border-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
    <div class="flex items-center gap-4">
      <div class="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-200">
        <Banknote size={32} />
      </div>
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Income Estimator</h1>
        <p class="text-slate-500 font-medium">Calculate your take-home pay</p>
      </div>
    </div>
    <div class="text-center md:text-right">
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Monthly Take-Home</p>
      <p class="text-4xl font-black text-emerald-600">${Math.round(netMonthly).toLocaleString()}</p>
    </div>
  </header>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <section class="space-y-6">
      <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Wallet class="text-emerald-500" size={20} /> Earnings
            </h2>
            <div class="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button 
                    on:click={() => mode = 'salary'}
                    class="px-3 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all {mode === 'salary' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400'}">
                    Salary
                </button>
                <button 
                    on:click={() => mode = 'hourly'}
                    class="px-3 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all {mode === 'hourly' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400'}">
                    Hourly
                </button>
            </div>
        </div>
        
        <div class="space-y-4">
          {#if mode === 'salary'}
            <div transition:slide>
                <label class="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Annual Gross Salary</label>
                <div class="relative">
                <span class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input 
                    type="number" 
                    bind:value={salary}
                    placeholder="e.g. 60000"
                    class="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white p-4 pl-10 rounded-2xl outline-none transition-all font-bold text-lg"
                />
                </div>
            </div>
          {:else}
            <div transition:slide class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Hourly Rate</label>
                    <div class="relative">
                        <span class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                        <input 
                            type="number" 
                            bind:value={hourlyRate}
                            placeholder="e.g. 35"
                            class="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white p-4 pl-10 rounded-2xl outline-none transition-all font-bold text-lg"
                        />
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Avg. Hours / Mo</label>
                    <div class="relative">
                        <span class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold"><Clock size={14}/></span>
                        <input 
                            type="number" 
                            bind:value={hoursPerMonth}
                            placeholder="160"
                            class="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white p-4 pl-10 rounded-2xl outline-none transition-all font-bold text-lg"
                        />
                    </div>
                </div>
            </div>
          {/if}

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Pay Frequency</label>
              <select bind:value={frequency} class="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold text-slate-700">
                <option value={12}>Monthly</option>
                <option value={26}>Bi-Weekly</option>
                <option value={24}>Semi-Monthly</option>
                <option value={52}>Weekly</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Filing Status</label>
              <select bind:value={status} class="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold text-slate-700">
                <option value="single">Single</option>
                <option value="married">Married</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <button 
        on:click={pushToBudget}
        class="w-full {feedback ? 'bg-emerald-600' : 'bg-slate-900'} text-white p-6 rounded-[2rem] font-black text-lg transition-all flex items-center justify-center gap-3 group shadow-xl"
      >
        {feedback ? '✓ Pushed to Budget!' : 'Push to Budget Hub'}
        {#if !feedback}
          <ArrowRight class="group-hover:translate-x-2 transition-transform" />
        {/if}
      </button>
    </section>

    <section class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
      <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <ReceiptText class="text-emerald-500" size={20} /> Tax Breakdown
      </h2>
      
      <div class="space-y-6">
        <div class="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
          <span class="text-slate-500 font-bold">Estimated Federal Tax</span>
          <span class="font-black text-slate-900">-${Math.round(fed).toLocaleString()}</span>
        </div>
        <div class="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
          <span class="text-slate-500 font-bold">FICA (Social Security + Med)</span>
          <span class="font-black text-slate-900">-${Math.round(fica).toLocaleString()}</span>
        </div>
        <div class="pt-6 border-t border-slate-100">
          <div class="flex justify-between items-center mb-2">
            <span class="text-slate-400 font-bold uppercase text-xs tracking-widest">Effective Tax Rate</span>
            <span class="font-black text-emerald-600">{effectiveRate.toFixed(1)}%</span>
          </div>
          <div class="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div 
              class="bg-emerald-500 h-full transition-all duration-700" 
              style="width: {effectiveRate}%"
            ></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</main>

<style>
    /* Small bit of local style for the slide animation */
    :global(body) {
        overflow-x: hidden;
    }
</style>