<script lang="ts">
  import { appData } from '../utils/store';
  import { Car, Fuel, ShieldAlert, Wrench, ArrowRight, Info, Landmark, TrendingUp, ReceiptText, Wallet } from "@lucide/svelte";
  import { slide } from 'svelte/transition';

  // 1. State Variables
  let price = $appData.car.price || 30000;
  let down = $appData.car.down || 6000;
  let rate = $appData.car.rate || 6.7;
  let term = $appData.car.term || 60;
  let salesTaxRate = 7; 
  let ins = 180;
  let gas = 150;
  let maint = 100;

  // 2. Reactive Math
  $: totalPurchasePrice = price * (1 + (salesTaxRate / 100));
  $: principal = totalPurchasePrice - down;
  $: monthlyRate = (rate / 100) / 12;
  
  $: loanPayment = (principal > 0 && monthlyRate > 0)
    ? (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1)
    : (principal > 0 ? principal / term : 0);

  $: totalMonthly = loanPayment + ins + gas + maint;

  // 3. Affordability & Minimum Income Logic
  $: netIncome = $appData.income.net_monthly || 0;
  $: ratio = netIncome > 0 ? (totalMonthly / netIncome) * 100 : 0;
  
  // The 15% Rule: Most experts recommend total car costs stay under 10-15% of net income.
  $: minNetRequired = totalMonthly / 0.15;
  $: incomeGap = Math.max(0, minNetRequired - netIncome);

  $: status = (() => {
    if (netIncome === 0) return { text: "Set Income First", color: "bg-slate-400", border: "border-slate-100", bg: "bg-slate-50", textCol: "text-slate-400" };
    if (ratio <= 10) return { text: "Healthy", color: "bg-emerald-500", border: "border-emerald-200", bg: "bg-emerald-50", textCol: "text-emerald-600" };
    if (ratio <= 15) return { text: "Moderate", color: "bg-amber-500", border: "border-amber-200", bg: "bg-amber-50", textCol: "text-amber-600" };
    return { text: "High Risk", color: "bg-rose-500", border: "border-rose-200", bg: "bg-rose-50", textCol: "text-rose-600" };
  })();

  let feedback = false;

  function pushToBudget() {
    $appData.budget.needs = [
      ...$appData.budget.needs,
      { name: "Car Payment", amount: Math.round(totalMonthly) }
    ];
    $appData.car = { price, down, rate, term, total_monthly: Math.round(totalMonthly) };
    feedback = true;
    setTimeout(() => feedback = false, 2000);
  }
</script>

<main class="md:ml-24 p-4 lg:p-8 max-w-300 mx-auto pb-32">
  
  <header class="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 mb-8 border border-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
    <div class="flex items-center gap-4 text-amber-600">
      <div class="p-4 bg-amber-500 text-white rounded-2xl shadow-lg shadow-amber-200">
        <Car size={32} />
      </div>
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Auto Hub</h1>
        <p class="text-slate-500 font-medium italic text-xs">
            <ShieldAlert size={14} class="inline mr-1" /> 
            Includes estimated loan, tax, and maintenance costs.
        </p>
      </div>
    </div>
    <div class="text-center md:text-right">
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Ownership Cost</p>
      <p class="text-4xl font-black text-amber-600">${Math.round(totalMonthly).toLocaleString()}</p>
    </div>
  </header>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    
    <div class="lg:col-span-5 space-y-6">
      <section class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
        <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <ReceiptText class="text-amber-500" size={20} /> Purchase Details
        </h2>
        
        <div class="space-y-4">
            <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Car Price</label>
                <input type="number" bind:value={price} class="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-amber-500 outline-none transition-all" />
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Down Payment</label>
                    <input type="number" bind:value={down} class="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-amber-500 outline-none" />
                </div>
                <div>
                    <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Interest Rate %</label>
                    <input type="number" step="0.1" bind:value={rate} class="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-amber-500 outline-none" />
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Loan Term (Mo)</label>
                    <select bind:value={term} class="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2 border-transparent outline-none">
                        <option value={36}>36 Months</option>
                        <option value={48}>48 Months</option>
                        <option value={60}>60 Months</option>
                        <option value={72}>72 Months</option>
                    </select>
                </div>
                <div>
                    <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Sales Tax %</label>
                    <input type="number" bind:value={salesTaxRate} class="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-amber-500 outline-none" />
                </div>
            </div>
        </div>
      </section>

      <section class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
        <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Fuel class="text-amber-500" size={20} /> Monthly Running Costs
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">Insurance</label>
            <input type="number" bind:value={ins} class="w-full bg-slate-50 p-3 rounded-xl font-bold" />
          </div>
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">Fuel/Charge</label>
            <input type="number" bind:value={gas} class="w-full bg-slate-50 p-3 rounded-xl font-bold" />
          </div>
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">Service</label>
            <input type="number" bind:value={maint} class="w-full bg-slate-50 p-3 rounded-xl font-bold" />
          </div>
        </div>
      </section>

      <button on:click={pushToBudget} class="w-full {feedback ? 'bg-emerald-600' : 'bg-slate-900'} text-white p-6 rounded-[2rem] font-black text-lg transition-all flex items-center justify-center gap-3 group shadow-xl">
        {feedback ? '✓ Pushed to Budget!' : 'Push to Budget Hub'}
        {#if !feedback} <ArrowRight class="group-hover:translate-x-2 transition-transform" /> {/if}
      </button>
    </div>

    <div class="lg:col-span-7 space-y-6">
      <section class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp class="text-amber-500" size={20} /> Affordability Analysis
              </h2>
              <span class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest {status.bg} {status.textCol} border border-current/10">
                {status.text}
              </span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="p-5 bg-slate-50 rounded-4xl border border-slate-100">
                <p class="text-[10px] font-black text-slate-400 uppercase mb-1">Min. Income Required</p>
                <p class="text-2xl font-black text-slate-900">${Math.round(minNetRequired).toLocaleString()}<span class="text-xs text-slate-400">/mo</span></p>
                <p class="text-[9px] font-bold text-slate-400 mt-1 uppercase">15% Ownership Rule</p>
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
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Total Share Breakdown</p>
              <div class="flex justify-between text-sm font-bold p-3 bg-slate-50 rounded-xl">
                  <span class="text-slate-500">Monthly Loan Payment</span>
                  <span class="text-slate-900">${Math.round(loanPayment).toLocaleString()}</span>
              </div>
              <div class="flex justify-between text-sm font-bold p-3 bg-slate-50 rounded-xl">
                  <span class="text-slate-500">Upkeep (Ins + Gas + Maint)</span>
                  <span class="text-slate-900">${Math.round(ins + gas + maint).toLocaleString()}</span>
              </div>
              <div class="flex justify-between text-sm font-bold border-t border-slate-200 pt-4 px-3">
                  <span class="text-slate-400 uppercase text-[10px] font-black">All-In Monthly Cost</span>
                  <span class="text-amber-600 font-black">${Math.round(totalMonthly).toLocaleString()}</span>
              </div>
          </div>

          <div class="space-y-4 mb-8">
            <div class="flex justify-between text-xs font-black text-slate-400 uppercase px-1">
                <span>Net Income Ratio</span>
                <span class={status.textCol}>{Math.round(ratio)}% of Monthly Net</span>
            </div>
            <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full transition-all duration-1000 bg-amber-500" style="width: {Math.min(ratio * 4, 100)}%"></div>
            </div>
          </div>

          <div class="bg-slate-900 rounded-[2.5rem] p-6 text-white relative overflow-hidden">
            <div class="relative z-10 flex items-center justify-between">
              <div>
                <h3 class="text-xs font-black text-amber-400 uppercase tracking-widest mb-1">Financial Insight</h3>
                <p class="text-xs text-slate-400 leading-relaxed max-w-[320px]">
                    Your loan principal is <b>${Math.round(principal).toLocaleString()}</b>. Experts suggest a 20% down payment and a 48-month term to avoid "underwater" loans.
                </p>
              </div>
              <Wrench size={32} class="text-amber-500 opacity-30" />
            </div>
          </div>
      </section>
    </div>
  </div>
</main>