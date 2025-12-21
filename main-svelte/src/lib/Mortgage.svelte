<script lang="ts">
  import { appData } from '../utils/store';
  import { Home, Landmark, ArrowRight } from "@lucide/svelte";

  // 1. Local variables bound to inputs
  // We initialize them from the store so your data persists
  let price = $appData.mortgage.price;
  let down = $appData.mortgage.down;
  let rate = $appData.mortgage.rate;
  let term = $appData.mortgage.term || 30;
  let taxRate = $appData.mortgage.tax_rate || 1.2;
  let insurance = $appData.mortgage.insurance || 150;

  // 2. Reactive Math (The $: means "run this whenever any variable inside it changes")
  $: principal = price - down;
  $: monthlyRate = (rate / 100) / 12;
  $: n = term * 12;
  
  $: pi = (principal > 0 && monthlyRate > 0) 
     ? (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
     : (principal > 0 ? principal / n : 0);

  $: monthlyTax = (price * (taxRate / 100)) / 12;
  $: total = pi + monthlyTax + insurance;

  // 3. Actions
  function pushToBudget() {
    $appData.budget.needs = [
      ...$appData.budget.needs.filter(item => item.name !== "Mortgage"),
      { name: "Mortgage", amount: Math.round(total) }
    ];
    
    // Also save the current mortgage inputs for next time
    $appData.mortgage = { price, down, rate, term, tax_rate: taxRate, insurance, monthly_total: Math.round(total) };
    
    alert("Mortgage added to Budget Needs!");
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
        <p class="text-slate-500 font-medium">Full Monthly PITI Estimate</p>
      </div>
    </div>
    <div class="text-center md:text-right">
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Monthly Payment</p>
      <p class="text-4xl font-black text-rose-600">${Math.round(total).toLocaleString()}</p>
    </div>
  </header>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <section class="space-y-6">
      <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
        <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Landmark class="text-rose-500" size={20} /> Loan & Escrow
        </h2>
        
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Home Price</label>
              <input type="number" placeholder="450000" bind:value={price} class="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold text-lg border-2 border-transparent focus:border-rose-500 focus:bg-white transition-all" />
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Down Payment</label>
              <input type="number" bind:value={down} placeholder="90000" class="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold text-lg border-2 border-transparent focus:border-rose-500 focus:bg-white transition-all" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Interest Rate (%)</label>
              <input type="number" step="0.1" placeholder="6.5" bind:value={rate} class="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold text-lg border-2 border-transparent focus:border-rose-500 focus:bg-white transition-all" />
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Loan Term</label>
              <select bind:value={term} class="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold text-slate-700">
                <option value={30}>30 Years</option>
                <option value={15}>15 Years</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Property Tax (Annual %)</label>
                <input type="number" step="0.1" bind:value={taxRate} class="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-rose-500 focus:bg-white transition-all" />
              </div>
              <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Monthly Insurance</label>
                <input type="number" bind:value={insurance} class="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-rose-500 focus:bg-white transition-all" />
              </div>
            </div>
        </div>
      </div>

      <button on:click={pushToBudget} class="w-full bg-slate-900 text-white p-6 rounded-[2rem] font-black text-lg hover:bg-rose-600 transition-all flex items-center justify-center gap-3 group shadow-xl">
        Push to Budget Needs <ArrowRight class="group-hover:translate-x-2 transition-transform" />
      </button>
    </section>

    <section class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
      <h2 class="text-xl font-bold text-slate-800 mb-6">Payment Breakdown</h2>
      <div class="space-y-4">
          <div class="flex justify-between p-4 bg-slate-50 rounded-2xl">
              <span class="text-slate-500 font-bold">Principal & Interest</span>
              <span class="font-black text-slate-900">${Math.round(pi).toLocaleString()}</span>
          </div>
          <div class="flex justify-between p-4 bg-slate-50 rounded-2xl">
              <span class="text-slate-500 font-bold">Property Taxes</span>
              <span class="font-black text-slate-900">${Math.round(monthlyTax).toLocaleString()}</span>
          </div>
          <div class="flex justify-between p-4 bg-slate-50 rounded-2xl">
              <span class="text-slate-500 font-bold">Home Insurance</span>
              <span class="font-black text-slate-900">${Math.round(insurance).toLocaleString()}</span>
          </div>
      </div>
      
      <div class="mt-8 p-6 bg-rose-50 rounded-3xl border border-rose-100">
          <p class="text-xs font-black text-rose-400 uppercase tracking-widest mb-2">Pro Tip</p>
          <p class="text-rose-900 text-sm font-medium leading-relaxed">This calculation includes <b>PITI</b>. Most banks require this total to be less than 28% of your gross income.</p>
      </div>
    </section>
  </div>
</main>