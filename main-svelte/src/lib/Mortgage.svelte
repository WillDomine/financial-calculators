<script lang="ts">
  import { appData } from '../utils/store';
  import { Home, Landmark, ArrowRight, ShieldAlert, Info, TrendingUp, Wallet, ReceiptText } from "@lucide/svelte";
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
  
  $: pi = (principal > 0 && monthlyRate > 0) 
     ? (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
     : (principal > 0 ? principal / n : 0);

  $: monthlyTax = (price * (taxRate / 100)) / 12;
  $: pmi = (downPercent < 20 && principal > 0) ? (principal * 0.0058) / 12 : 0;
  $: maintenance = (price * 0.01) / 12;

  $: total = pi + monthlyTax + insurance + pmi + hoa;

  // 3. Affordability & Minimum Income Logic
  $: netIncome = $appData.income.net_monthly || 0;
  $: ratio = netIncome > 0 ? (total / netIncome) * 100 : 0;
  
  // The 28% Rule: Min Net Income Required for Housing
  $: minNetRequired = total / 0.28;
  $: incomeGap = Math.max(0, minNetRequired - netIncome);

  $: status = (() => {
    if (netIncome === 0) return { text: "Set Income First", color: "bg-slate-400", border: "border-slate-100", bg: "bg-slate-50", textCol: "text-slate-400" };
    if (ratio <= 28) return { text: "Healthy", color: "bg-emerald-500", border: "border-emerald-200", bg: "bg-emerald-50", textCol: "text-emerald-600" };
    if (ratio <= 35) return { text: "Moderate", color: "bg-amber-500", border: "border-amber-200", bg: "bg-amber-50", textCol: "text-amber-600" };
    return { text: "High Risk", color: "bg-rose-500", border: "border-rose-200", bg: "bg-rose-50", textCol: "text-rose-600" };
  })();

  function pushToBudget() {
    $appData.budget.needs = [
      ...$appData.budget.needs,
      { name: "Mortgage", amount: Math.round(total) }
    ];
    feedback = true;
    setTimeout(() => feedback = false, 2000)
  }
</script>

<main class="md:ml-24 p-4 lg:p-8 max-w-300 mx-auto pb-32">
  
  <header class="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 mb-8 border border-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
    <div class="flex items-center gap-4 text-rose-600">
      <div class="p-4 bg-rose-600 text-white rounded-2xl shadow-lg shadow-rose-200">
        <Home size={32} />
      </div>
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Mortgage Hub</h1>
        <p class="text-slate-500 font-medium italic text-xs">
            <ShieldAlert size={14} class="inline mr-1" /> 
            Full PITI (Principal, Interest, Taxes, Insurance) Estimate.
        </p>
      </div>
    </div>
    <div class="text-center md:text-right">
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Monthly Payment</p>
      <p class="text-4xl font-black text-rose-600">${Math.round(total).toLocaleString()}</p>
    </div>
  </header>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    
    <div class="lg:col-span-5 space-y-6">
      <section class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
        <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <ReceiptText class="text-rose-500" size={20} /> Loan Setup
        </h2>
        
        <div class="space-y-4">
            <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Home Purchase Price</label>
                <input type="number" bind:value={price} class="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-rose-500 outline-none transition-all" />
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Down Pay ({downPercent.toFixed(0)}%)</label>
                    <input type="number" bind:value={down} class="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-rose-500 outline-none" />
                </div>
                <div>
                    <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Interest Rate %</label>
                    <input type="number" step="0.1" bind:value={rate} class="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-rose-500 outline-none" />
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Property Tax %</label>
                    <input type="number" step="0.1" bind:value={taxRate} class="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-rose-500 outline-none" />
                </div>
                <div>
                    <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">HOA Fees / Mo</label>
                    <input type="number" bind:value={hoa} class="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-rose-500 outline-none" />
                </div>
            </div>
        </div>
      </section>

      <button 
        on:click={pushToBudget}
        class="w-full {feedback ? 'bg-emerald-600' : 'bg-slate-900'} text-white p-6 rounded-4xl font-black text-lg transition-all flex items-center justify-center gap-3 group shadow-xl"
      >
        {feedback ? '✓ Pushed to Budget!' : 'Push to Budget Hub'}
        {#if !feedback}
          <ArrowRight class="group-hover:translate-x-2 transition-transform" />
        {/if}
      </button>
    </div>

    <div class="lg:col-span-7 space-y-6">
      <section class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp class="text-rose-500" size={20} /> Affordability Analysis
              </h2>
              <span class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest {status.bg} {status.textCol} border border-current/10">
                {status.text}
              </span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="p-5 bg-slate-50 rounded-4xl border border-slate-100">
                <p class="text-[10px] font-black text-slate-400 uppercase mb-1">Min. Income Required</p>
                <p class="text-2xl font-black text-slate-900">${Math.round(minNetRequired).toLocaleString()}<span class="text-xs text-slate-400">/mo</span></p>
                <p class="text-[9px] font-bold text-slate-400 mt-1 uppercase">28% Housing Rule</p>
            </div>
            
            <div class="p-5 {incomeGap > 0 ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'} rounded-4xl border transition-colors">
                <p class="text-[10px] font-black text-slate-400 uppercase mb-1">{incomeGap > 0 ? 'Income Gap' : 'Income Surplus'}</p>
                <p class="text-2xl font-black {incomeGap > 0 ? 'text-rose-600' : 'text-emerald-600'}">
                    ${Math.round(Math.abs(netIncome - minNetRequired)).toLocaleString()}
                </p>
                <p class="text-[9px] font-bold opacity-60 mt-1 uppercase">VS. PROFILE NET</p>
            </div>
          </div>

          <div class="space-y-3 mb-8">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Payment Breakdown</p>
              <div class="flex justify-between text-sm font-bold p-3 bg-slate-50 rounded-xl">
                  <span class="text-slate-500">Principal & Interest</span>
                  <span class="text-slate-900">${Math.round(pi).toLocaleString()}</span>
              </div>
              <div class="flex justify-between text-sm font-bold p-3 bg-slate-50 rounded-xl">
                  <span class="text-slate-500">Property Taxes (Est. {taxRate}%)</span>
                  <span class="text-slate-900">${Math.round(monthlyTax).toLocaleString()}</span>
              </div>
              <div class="flex justify-between text-sm font-bold p-3 bg-slate-50 rounded-xl">
                  <span class="text-slate-500">Insurance, HOA, & PMI</span>
                  <span class="text-slate-900">${Math.round(insurance + hoa + pmi).toLocaleString()}</span>
              </div>
          </div>

          <div class="space-y-4 mb-8">
            <div class="flex justify-between text-xs font-black text-slate-400 uppercase px-1">
                <span>Total Net Ratio</span>
                <span class={status.textCol}>{Math.round(ratio)}% of Net Monthly</span>
            </div>
            <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full transition-all duration-1000 {status.color}" style="width: {Math.min(ratio * 2.5, 100)}%"></div>
            </div>
          </div>

          <div class="bg-slate-900 rounded-[2.5rem] p-6 text-white relative overflow-hidden">
            <div class="relative z-10 flex items-center justify-between">
              <div>
                <h3 class="text-xs font-black text-rose-400 uppercase tracking-widest mb-1">Maintenance Fund</h3>
                <p class="text-xs text-slate-400 leading-relaxed max-w-[320px]">
                    Ownership costs go beyond the mortgage. We recommend setting aside <b>${Math.round(maintenance).toLocaleString()}/mo</b> for future repairs and upkeep.
                </p>
              </div>
              <Landmark size={32} class="text-rose-500 opacity-30" />
            </div>
          </div>
      </section>
    </div>
  </div>
</main>