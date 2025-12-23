<script lang="ts">
  import { appData } from '../utils/store';
  import { Home, Landmark, ArrowRight, ShieldAlert, Info } from "@lucide/svelte";
  import { slide } from 'svelte/transition';

  // 1. State Variables
  let price = $appData.mortgage.price || 450000;
  let down = $appData.mortgage.down || 90000;
  let rate = $appData.mortgage.rate || 6.5;
  let term = $appData.mortgage.term || 30;
  let taxRate = $appData.mortgage.tax_rate || 1.2;
  let insurance = $appData.mortgage.insurance || 150;
  let hoa = 0;

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
  
  // PMI Logic: Only applies if down payment < 20%
  // Average PMI is roughly 0.58% of the loan amount annually
  $: pmi = (downPercent < 20 && principal > 0) 
     ? (principal * 0.0058) / 12 
     : 0;

  // Maintenance reserve (Standard rule of thumb: 1% of home value per year)
  $: maintenance = (price * 0.01) / 12;

  $: total = pi + monthlyTax + insurance + pmi + hoa;

  function pushToBudget() {
    $appData.budget.needs = [
      ...$appData.budget.needs.filter(item => item.name !== "Mortgage"),
      { name: "Mortgage", amount: Math.round(total) }
    ];
    alert("Mortgage estimate pushed to budget!");
  }
</script>

<main class="md:ml-24 p-4 lg:p-8 max-w-[1200px] mx-auto pb-32">
  <header class="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 mb-8 border border-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
    <div class="flex items-center gap-4 text-rose-600">
      <div class="p-4 bg-rose-600 text-white rounded-2xl shadow-lg shadow-rose-200">
        <Home size={32} />
      </div>
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Mortgage Calc</h1>
        <p class="text-slate-500 font-medium italic text-sm">
            <ShieldAlert size={14} class="inline mr-1" /> 
            Estimate only. Actual bank terms will vary.
        </p>
      </div>
    </div>
    <div class="text-center md:text-right">
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Monthly Payment (PITI + HOA)</p>
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
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-2">Home Price</label>
                <input type="number" bind:value={price} class="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-rose-500 outline-none transition-all" />
            </div>
            <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-2">Down Payment ({downPercent.toFixed(1)}%)</label>
                <input type="number" bind:value={down} class="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-rose-500 outline-none transition-all" />
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-2">Interest Rate (%)</label>
                <input type="number" step="0.1" bind:value={rate} class="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-rose-500 outline-none transition-all" />
            </div>
            <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-2">HOA / Month</label>
                <input type="number" bind:value={hoa} placeholder="0" class="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-rose-500 outline-none transition-all" />
            </div>
        </div>
      </div>

      <button on:click={pushToBudget} class="w-full bg-slate-900 text-white p-6 rounded-[2rem] font-black text-lg hover:bg-rose-600 transition-all flex items-center justify-center gap-3 group shadow-xl">
        Push to Budget Needs <ArrowRight class="group-hover:translate-x-2 transition-transform" />
      </button>
    </section>

    <section class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
      <h2 class="text-xl font-bold text-slate-800 mb-6">Payment Breakdown</h2>
      
      <div class="space-y-3">
          <div class="flex justify-between p-4 bg-slate-50 rounded-2xl">
              <span class="text-slate-500 font-bold">Principal & Interest</span>
              <span class="font-black text-slate-900">${Math.round(pi).toLocaleString()}</span>
          </div>
          <div class="flex justify-between p-4 bg-slate-50 rounded-2xl">
              <span class="text-slate-500 font-bold">Property Taxes</span>
              <span class="font-black text-slate-900">${Math.round(monthlyTax).toLocaleString()}</span>
          </div>
          {#if pmi > 0}
            <div class="flex justify-between p-4 bg-rose-50 rounded-2xl border border-rose-100" transition:slide>
                <span class="text-rose-600 font-bold flex items-center gap-1">
                    PMI <Info size={12}/>
                </span>
                <span class="font-black text-rose-700">${Math.round(pmi).toLocaleString()}</span>
            </div>
          {/if}
          <div class="flex justify-between p-4 bg-slate-50 rounded-2xl">
              <span class="text-slate-500 font-bold">Insurance & HOA</span>
              <span class="font-black text-slate-900">${Math.round(insurance + hoa).toLocaleString()}</span>
          </div>
      </div>

      <div class="mt-8 p-6 bg-slate-900 rounded-3xl text-white">
          <div class="flex justify-between items-center mb-2">
            <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Hidden Monthly Cost</span>
            <span class="text-xs text-slate-400 italic">Not in PITI</span>
          </div>
          <div class="flex justify-between items-center">
              <span class="font-bold">Maintenance Fund (1%)</span>
              <span class="font-black text-rose-400">${Math.round(maintenance).toLocaleString()}</span>
          </div>
          <p class="text-[10px] text-slate-500 mt-4 leading-tight">
            Note: Banks don't collect maintenance funds, but your budget should. Total "True Cost" of ownership: <b>${Math.round(total + maintenance).toLocaleString()}/mo</b>.
          </p>
      </div>
    </section>
  </div>
</main>