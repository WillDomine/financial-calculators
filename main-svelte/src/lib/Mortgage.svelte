<script lang="ts">
  import { appData } from '../utils/store';
  import { Home, Landmark, ArrowRight, ShieldAlert, Info, TrendingUp } from "@lucide/svelte";
  import { slide } from 'svelte/transition';

  // 1. State Variables
  let price = $appData.mortgage.price || 300000;
  let down = $appData.mortgage.down || 60000;
  let rate = $appData.mortgage.rate || 6.5;
  let term = $appData.mortgage.term || 30;
  let taxRate = $appData.mortgage.tax_rate || 1.2;
  let insurance = $appData.mortgage.insurance || 150;
  let hoa = 0;

  let feedback = false;

  // 2. Realistic Reactive Math
  $: principal = price - down;
  $: downPercent = (down / price) * 100;
  $: monthlyRate = (rate / 100) / 12;
  $: n = term * 12;
  
  // Principal & Interest
  $: pi = (principal > 0 && monthlyRate > 0) 
     ? (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
     : (principal > 0 ? principal / n : 0);

  // Taxes & Insurance
  $: monthlyTax = (price * (taxRate / 100)) / 12;
  $: pmi = (downPercent < 20 && principal > 0) ? (principal * 0.0058) / 12 : 0;
  $: maintenance = (price * 0.01) / 12;

  $: total = pi + monthlyTax + insurance + pmi + hoa;

  // 3. Affordability Logic (Linked to Income Store)
  $: netIncome = $appData.income.net_monthly || 0;
  $: ratio = netIncome > 0 ? (total / netIncome) * 100 : 0;

  $: status = (() => {
    if (netIncome === 0) return { text: "Set Income First", color: "bg-slate-400", border: "border-slate-100", bg: "bg-slate-50", textCol: "text-slate-400" };
    if (ratio <= 28) return { text: "Affordable", color: "bg-emerald-500", border: "border-emerald-200", bg: "bg-emerald-50", textCol: "text-emerald-600" };
    if (ratio <= 35) return { text: "Stretch", color: "bg-amber-500", border: "border-amber-200", bg: "bg-amber-50", textCol: "text-amber-600" };
    return { text: "Aggressive", color: "bg-rose-500", border: "border-rose-200", bg: "bg-rose-50", textCol: "text-rose-600" };
  })();

  function pushToBudget() {
    $appData.budget.needs = [
      ...$appData.budget.needs.filter(item => item.name !== "Mortgage"),
      { name: "Mortgage", amount: Math.round(total) }
    ];
    feedback = true;
    setTimeout(() => feedback = false, 2000)
  }
</script>

<main class="md:ml-24 p-4 lg:p-8 max-w-[1200px] mx-auto pb-32">
  <header class="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 mb-8 border border-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
    <div class="flex items-center gap-4 text-rose-600">
      <div class="p-4 bg-rose-600 text-white rounded-2xl shadow-lg shadow-rose-200">
        <Home size={32} />
      </div>
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Mortgage Hub</h1>
        <p class="text-slate-500 font-medium italic text-sm">
            <ShieldAlert size={14} class="inline mr-1" /> 
            Estimate only. Actual bank terms will vary.
        </p>
      </div>
    </div>
    <div class="text-center md:text-right">
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Your Monthly Share</p>
      <p class="text-4xl font-black text-rose-600">${Math.round(total).toLocaleString()}</p>
    </div>
  </header>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <section class="space-y-6">
      <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
        <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Landmark class="text-rose-500" size={20} /> Property & Loan
        </h2>
        
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Home Price</label>
                <input type="number" bind:value={price} class="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-rose-500 outline-none transition-all" />
            </div>
            <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Down Payment ({downPercent.toFixed(1)}%)</label>
                <input type="number" bind:value={down} class="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-rose-500 outline-none transition-all" />
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Interest Rate (%)</label>
                <input type="number" step="0.1" bind:value={rate} class="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-rose-500 outline-none transition-all" />
            </div>
            <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">HOA / Month</label>
                <input type="number" bind:value={hoa} placeholder="0" class="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-rose-500 outline-none transition-all" />
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

    <section class="space-y-6">
      <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
        <h2 class="text-xl font-bold text-slate-800 mb-6">Affordability Breakdown</h2>
        
        <div class="p-8 rounded-[2rem] border-2 transition-all duration-500 {status.bg} {status.border} mb-6">
            <div class="flex justify-between items-center mb-6">
                <span class="font-black text-xl uppercase tracking-tight {status.textCol}">{status.text}</span>
                <span class="bg-white px-3 py-1 rounded-full text-xs font-black shadow-sm">
                  {netIncome > 0 ? `${Math.round(ratio)}% of Net` : '0%'}
                </span>
            </div>
            
            <div class="space-y-4">
                <div class="flex justify-between text-sm font-bold">
                    <span class="text-slate-400">Principal & Interest</span>
                    <span class="text-slate-900">${Math.round(pi).toLocaleString()}</span>
                </div>
                <div class="flex justify-between text-sm font-bold">
                    <span class="text-slate-400">Taxes & Insurance</span>
                    <span class="text-slate-900">${Math.round(monthlyTax + insurance + pmi).toLocaleString()}</span>
                </div>
                <div class="flex justify-between text-sm font-bold border-t border-slate-200 pt-4">
                    <span class="text-slate-400">Total Monthly Payment</span>
                    <span class="text-rose-600 font-black">${Math.round(total).toLocaleString()}</span>
                </div>
            </div>

            <div class="mt-8">
                <div class="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div class="h-full transition-all duration-1000 {status.color}" style="width: {Math.min(ratio * 2.5, 100)}%"></div>
                </div>
            </div>
        </div>

        <div class="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden">
            <TrendingUp class="absolute -bottom-4 -right-4 opacity-10 text-white" size={120} />
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Repair Reserve</span>
              <span class="text-xs text-rose-400 font-bold italic">Recommended</span>
            </div>
            <div class="flex justify-between items-center">
                <span class="font-bold">Maintenance (1%)</span>
                <span class="font-black text-rose-400">${Math.round(maintenance).toLocaleString()}/mo</span>
            </div>
        </div>
      </div>
    </section>
  </div>
</main>