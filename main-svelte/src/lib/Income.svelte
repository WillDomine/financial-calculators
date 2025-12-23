<script lang="ts">
  import { appData } from '../utils/store.js';
  import { Banknote, Wallet, ReceiptText, ArrowRight, Clock, Percent, ShieldAlert } from '@lucide/svelte';
  import { slide } from 'svelte/transition';
  
  // 1. Local State (Restored to your store bindings)
  let mode = "salary"; 
  let salary = $appData.income.salary || 90000;
  let hourlyRate:any = 45;
  let hoursPerMonth = 160; 
  
  let status = $appData.income.status || "single";
  let stateTaxRate = $appData.income.state_tax || 0;

  // 2. Reactive Calculation for Annual Salary
  $: displaySalary = mode === "salary" 
    ? (salary || 0) 
    : (hourlyRate || 0) * (hoursPerMonth || 0) * 12;

  // 3. 2025 Tax Logic (Progressive Brackets)
  $: fica = displaySalary * 0.0765;
  
  $: fed = (() => {
    // 2025 Official Standard Deduction Estimates
    const deduction = status === "single" ? 15750 : 31500;
    const taxable = Math.max(0, displaySalary - deduction);
    let tax = 0;

    if (status === "single") {
        if (taxable > 0) tax += Math.min(taxable, 11925) * 0.10;
        if (taxable > 11925) tax += (Math.min(taxable, 48475) - 11925) * 0.12;
        if (taxable > 48475) tax += (Math.min(taxable, 103350) - 48475) * 0.22;
        if (taxable > 103350) tax += (taxable - 103350) * 0.24;
    } else {
        if (taxable > 0) tax += Math.min(taxable, 23850) * 0.10;
        if (taxable > 23850) tax += (Math.min(taxable, 96950) - 23850) * 0.12;
        if (taxable > 96950) tax += (taxable - 96950) * 0.22;
    }
    return tax;
  })();

  $: stateTax = (displaySalary * (stateTaxRate / 100));
  $: totalTax = fica + fed + stateTax;
  $: netAnnual = Math.max(0, displaySalary - totalTax);
  $: netMonthly = netAnnual / 12;
  $: effectiveRate = displaySalary > 0 ? (totalTax / displaySalary) * 100 : 0;

  // 4. Actions
  let feedback = false;

  function pushToBudget() {
    $appData.income.salary = Math.round(displaySalary);
    $appData.income.net_monthly = Math.round(netMonthly);
    $appData.income.status = status;
    $appData.income.state_tax = stateTaxRate;
    
    feedback = true;
    setTimeout(() => feedback = false, 2000);
  }
</script>

<main class="md:ml-24 p-4 lg:p-8 max-w-[1200px] mx-auto pb-32">
  
  <header class="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 mb-8 border border-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
    <div class="flex items-center gap-4 text-emerald-600">
      <div class="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-200">
        <Banknote size={32} />
      </div>
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Income Estimator</h1>
        <p class="text-slate-500 font-medium italic text-xs">
            <ShieldAlert size={12} class="inline mr-1" /> 
            Estimate based on 2025 tax brackets. Final take-home depends on insurance and 401k.
        </p>
      </div>
    </div>
    <div class="text-center md:text-right">
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Take-Home</p>
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
                    class="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white p-4 pl-10 rounded-2xl outline-none transition-all font-bold text-lg"
                />
                </div>
            </div>
          {:else}
            <div transition:slide class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Hourly Rate</label>
                    <input type="number" bind:value={hourlyRate} class="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold" />
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Hours / Mo</label>
                    <input type="number" bind:value={hoursPerMonth} class="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold" />
                </div>
            </div>
          {/if}

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Filing Status</label>
              <select bind:value={status} class="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold text-slate-700">
                <option value="single">Single</option>
                <option value="married">Married (Joint)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">State Tax (%)</label>
              <div class="relative">
                <input type="number" step="0.1" bind:value={stateTaxRate} class="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold" />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"><Percent size={14}/></span>
              </div>
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
      
      <div class="space-y-4">
        <div class="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
          <span class="text-slate-500 font-bold">Federal Income Tax</span>
          <span class="font-black text-slate-900">-${Math.round(fed).toLocaleString()}</span>
        </div>
        <div class="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
          <span class="text-slate-500 font-bold">FICA (SS + Med)</span>
          <span class="font-black text-slate-900">-${Math.round(fica).toLocaleString()}</span>
        </div>
        <div class="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
            <span class="text-slate-500 font-bold">State Income Tax</span>
            <span class="font-black text-slate-900">-${Math.round(stateTax).toLocaleString()}</span>
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