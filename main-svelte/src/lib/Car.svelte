<script lang="ts">
  import { appData } from '../utils/store';
  import { Car, Fuel, ShieldAlert, Wrench, ArrowRight, Info, Landmark } from "@lucide/svelte";

  // 1. Local state bound to inputs (Restored exactly to your store links)
  let price = $appData.car.price;
  let down = $appData.car.down;
  let rate = $appData.car.rate;
  let term = $appData.car.term;
  
  // Sales Tax (New for accuracy)
  let salesTaxRate = 7; 
  
  let ins = 180;
  let gas = 150;
  let maint = 100;

  // 2. Reactive Loan Math (Updated to include Sales Tax for realism)
  $: totalPurchasePrice = price * (1 + (salesTaxRate / 100));
  $: principal = totalPurchasePrice - down;
  $: monthlyRate = (rate / 100) / 12;
  
  $: loanPayment = (principal > 0 && monthlyRate > 0)
    ? (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1)
    : (principal > 0 ? principal / term : 0);

  $: totalMonthly = loanPayment + ins + gas + maint;

  // 3. Affordability Logic
  $: netIncome = $appData.income.net_monthly || 0;
  $: ratio = netIncome > 0 ? (totalMonthly / netIncome) * 100 : 0;

  $: status = (() => {
    if (netIncome === 0) return { text: "Set Income First", color: "bg-slate-400", style: "border-slate-100" };
    if (ratio <= 10) return { text: "Perfect Fit", color: "bg-emerald-500", style: "border-emerald-100 bg-emerald-50/30" };
    if (ratio <= 15) return { text: "Moderate", color: "bg-amber-500", style: "border-amber-100 bg-amber-50/30" };
    return { text: "Too High", color: "bg-rose-500", style: "border-rose-100 bg-rose-50/30" };
  })();

  // 4. Actions (Kept exactly as your original "Push to Budget" logic)
  let feedback = false;

  function pushToBudget() {
    $appData.budget.needs = [
      ...$appData.budget.needs.filter(item => item.name !== "Car Payment"),
      { name: "Car Payment", amount: Math.round(totalMonthly) }
    ];
    
    // Save current car details back to your store
    $appData.car = { price, down, rate, term, total_monthly: Math.round(totalMonthly) };
    
    feedback = true;
    setTimeout(() => feedback = false, 2000);
  }
</script>

<main class="md:ml-24 p-4 lg:p-8 max-w-[1200px] mx-auto pb-32">
  <header class="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 mb-8 border border-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
    <div class="flex items-center gap-4 text-amber-600">
      <div class="p-4 bg-amber-500 text-white rounded-2xl shadow-lg shadow-amber-200">
        <Car size={32} />
      </div>
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Auto Hub</h1>
        <p class="text-slate-500 font-medium italic text-xs">
            <ShieldAlert size={12} class="inline" /> 
            Estimate only. Actual bank terms and taxes vary.
        </p>
      </div>
    </div>
    <div class="text-center md:text-right">
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Monthly Loan</p>
      <p class="text-4xl font-black text-amber-600">${Math.round(loanPayment).toLocaleString()}</p>
    </div>
  </header>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <section class="space-y-6">
      <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
        <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Landmark class="text-amber-500" size={20} /> Loan Details
        </h2>
        
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Car Price</label>
              <input type="number" placeholder="30000" bind:value={price} class="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold text-lg border-2 border-transparent focus:border-amber-500 focus:bg-white transition-all" />
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Down Payment</label>
              <input type="number" placeholder="6000" bind:value={down} class="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold text-lg border-2 border-transparent focus:border-amber-500 focus:bg-white transition-all" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Interest Rate (%)</label>
              <input type="number" placeholder="6.7" step="0.1" bind:value={rate} class="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-amber-500 focus:bg-white transition-all" />
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Term (Months)</label>
              <select bind:value={term} class="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold text-slate-700">
                <option value={36}>36 Months (3yr)</option>
                <option value={48}>48 Months (4yr)</option>
                <option value={60}>60 Months (5yr)</option>
                <option value={72}>72 Months (6yr)</option>
              </select>
            </div>
          </div>
          
          <div class="pt-2">
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Est. Sales Tax %</label>
            <input type="number" bind:value={salesTaxRate} class="w-full bg-slate-50 p-3 rounded-xl outline-none font-bold text-sm border-2 border-transparent focus:border-amber-500 focus:bg-white transition-all" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
        <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Fuel class="text-amber-500" size={20} /> Monthly Upkeep
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">Insurance</label>
            <input type="number" bind:value={ins} class="w-full bg-slate-50 p-3 rounded-xl outline-none font-bold text-sm" />
          </div>
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">Gas/Electric</label>
            <input type="number" bind:value={gas} class="w-full bg-slate-50 p-3 rounded-xl outline-none font-bold text-sm" />
          </div>
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">Maint.</label>
            <input type="number" bind:value={maint} class="w-full bg-slate-50 p-3 rounded-xl outline-none font-bold text-sm" />
          </div>
        </div>
      </div>

      <button on:click={pushToBudget} class="w-full {feedback ? 'bg-amber-600' : 'bg-slate-900'} text-white p-6 rounded-[2rem] font-black text-lg transition-all flex items-center justify-center gap-3 group shadow-xl">
        {feedback ? '✓ Added to Budget Hub' : 'Push to Budget Needs'}
        {#if !feedback} <ArrowRight class="group-hover:translate-x-2 transition-transform" /> {/if}
      </button>
    </section>

    <section class="space-y-6">
      <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border flex flex-col justify-center items-center text-center min-h-[300px] transition-all duration-500 {status.style}">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Monthly Ownership</p>
          <h2 class="text-6xl font-black text-slate-900 mb-4">${Math.round(totalMonthly).toLocaleString()}</h2>
          
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full mb-8">
              <div class="w-2 h-2 rounded-full {status.color}"></div>
              <span class="text-xs font-black uppercase text-slate-500 tracking-wider">{status.text}</span>
          </div>

          <div class="w-full max-w-sm space-y-2">
              <div class="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                  <span>Affordability Meter</span>
                  <span>{Math.round(ratio)}% of Net Income</span>
              </div>
              <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full bg-amber-500 transition-all duration-1000" style="width: {Math.min(ratio * 4, 100)}%"></div>
              </div>
          </div>
      </div>

      <div class="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
          <h3 class="text-lg font-black mb-4 flex items-center gap-2">
              <Info size={18} class="text-amber-400" /> Ownership Insight
          </h3>
          <p class="text-slate-300 text-sm leading-relaxed relative z-10">
              Your estimated loan amount is <b>${Math.round(principal).toLocaleString()}</b> including taxes. 
              Always check for dealer-specific fees (doc fees, prep fees) which can add another $500–$1,000 to the price.
          </p>
      </div>
    </section>
  </div>
</main>