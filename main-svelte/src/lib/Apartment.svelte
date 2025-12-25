<script lang="ts">
  import { appData } from '../utils/store';
  import { Building2, Users, ArrowRight, ShieldCheck, Info, Dog, Wallet, TrendingUp, ReceiptText } from '@lucide/svelte';
  import { slide } from 'svelte/transition';

  // 1. State Variables
  let rent = $appData.apartment.rent || 2000; 
  let utils = $appData.apartment.utilities || 100; 
  let insurance = $appData.apartment.insurance || 30; 
  let roommates = $appData.apartment.roommates || 1;
  let otherFees = 0; 

  // 2. Reactive Calculations
  $: totalBuilding = (rent || 0) + (utils || 0) + (otherFees || 0);
  $: yourShare = (totalBuilding / roommates) + (insurance || 0);

  $: netIncome = $appData.income.net_monthly || 0;
  $: ratio = netIncome > 0 ? (yourShare / netIncome) * 100 : 0;

  // 3. Minimum Income Logic (The 30% Rule)
  $: minNetRequired = yourShare / 0.30;
  $: incomeGap = Math.max(0, minNetRequired - netIncome);

  $: status = (() => {
    if (!rent) return { text: "Enter Details", bg: "bg-slate-50", border: "border-slate-100", color: "bg-slate-400", textCol: "text-slate-400" };
    if (ratio <= 30) return { text: "Healthy", bg: "bg-emerald-50", border: "border-emerald-200", color: "bg-emerald-500", textCol: "text-emerald-600" };
    if (ratio <= 45) return { text: "Moderate", bg: "bg-amber-50", border: "border-amber-200", color: "bg-amber-500", textCol: "text-amber-600" };
    return { text: "High Risk", bg: "bg-rose-50", border: "border-rose-200", color: "bg-rose-500", textCol: "text-rose-600" };
  })();

  let feedback = false;

  function pushToBudget() {
    $appData.budget.needs = [
      ...$appData.budget.needs,
      { name: "Rent", amount: Math.round(yourShare) }
    ];
    $appData.apartment = { rent, utilities: utils, insurance, roommates, your_share: Math.round(yourShare) };
    feedback = true;
    setTimeout(() => feedback = false, 2000);
  }
</script>

<main class="md:ml-24 p-4 lg:p-8 max-w-300 mx-auto pb-32">
  
  <header class="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 mb-8 border border-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
    <div class="flex items-center gap-4 text-indigo-600">
      <div class="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
        <Building2 size={32} />
      </div>
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Rent Hub</h1>
        <p class="text-slate-500 font-medium italic text-xs">
          <ShieldCheck size={12} class="inline mr-1" />
          Estimate only. Does not include deposits.
        </p>
      </div>
    </div>
    <div class="text-center md:text-right">
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Your Total Share</p>
      <p class="text-4xl font-black text-indigo-600">
        ${Math.round(yourShare).toLocaleString()}
      </p>
    </div>
  </header>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    
    <div class="lg:col-span-5 space-y-6">
      <section class="bg-indigo-600 rounded-[2.5rem] p-6 text-white shadow-xl shadow-indigo-100">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <Users size={24} />
                <h2 class="font-black text-lg">Roommates</h2>
            </div>
            <div class="flex items-center bg-white/20 p-1 rounded-xl border border-white/20">
                <button on:click={() => roommates > 1 && roommates--} class="w-10 h-10 flex items-center justify-center font-bold hover:bg-white/20 rounded-lg transition-all">-</button>
                <span class="w-10 text-center font-black text-xl">{roommates}</span>
                <button on:click={() => roommates++} class="w-10 h-10 flex items-center justify-center font-bold hover:bg-white/20 rounded-lg transition-all">+</button>
            </div>
        </div>
      </section>

      <section class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
        <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <ReceiptText class="text-indigo-500" size={20} /> Building Costs
        </h2>
        <div class="space-y-4">
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Monthly Rent</label>
            <input type="number" bind:value={rent} class="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold text-lg border-2 border-transparent focus:border-indigo-500 transition-all" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Utilities</label>
              <input type="number" bind:value={utils} class="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-indigo-500 transition-all" />
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 flex items-center gap-1">
                <Dog size={10}/> Pet Rent/Fees
              </label>
              <input type="number" bind:value={otherFees} class="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-indigo-500 transition-all" />
            </div>
          </div>
          
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Personal Insurance</label>
            <input type="number" bind:value={insurance} class="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-indigo-500 transition-all" />
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
                <TrendingUp class="text-indigo-500" size={20} /> Affordability Analysis
              </h2>
              <span class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest {status.bg} {status.textCol} border border-current/10">
                {status.text}
              </span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                <p class="text-[10px] font-black text-slate-400 uppercase mb-1">Min. Income Required</p>
                <p class="text-2xl font-black text-slate-900">${Math.round(minNetRequired).toLocaleString()}<span class="text-xs text-slate-400">/mo</span></p>
            </div>
            
            <div class="p-5 {incomeGap > 0 ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'} rounded-[2rem] border transition-colors">
                <p class="text-[10px] font-black text-slate-400 uppercase mb-1">{incomeGap > 0 ? 'Income Gap' : 'Income Surplus'}</p>
                <p class="text-2xl font-black {incomeGap > 0 ? 'text-rose-600' : 'text-emerald-600'}">
                    ${Math.round(Math.abs(netIncome - minNetRequired)).toLocaleString()}
                </p>
            </div>
          </div>

          <div class="space-y-3 mb-8">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Your Share Breakdown</p>
              <div class="flex justify-between text-sm font-bold p-3 bg-slate-50 rounded-xl">
                  <span class="text-slate-500">Base Rent ({roommates > 1 ? `1/${roommates}` : 'Full'})</span>
                  <span class="text-slate-900">${Math.round(rent / roommates).toLocaleString()}</span>
              </div>
              <div class="flex justify-between text-sm font-bold p-3 bg-slate-50 rounded-xl">
                  <span class="text-slate-500">Utilities & Fees</span>
                  <span class="text-slate-900">${Math.round((utils + otherFees) / roommates).toLocaleString()}</span>
              </div>
              <div class="flex justify-between text-sm font-bold p-3 bg-slate-50 rounded-xl">
                  <span class="text-slate-500">Personal Insurance</span>
                  <span class="text-slate-900">${Math.round(insurance).toLocaleString()}</span>
              </div>
          </div>

          <div class="space-y-4">
            <div class="flex justify-between text-xs font-black text-slate-400 uppercase px-1">
                <span>Net Income Ratio</span>
                <span class={status.textCol}>{Math.round(ratio)}% of Monthly Net</span>
            </div>
            <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-8">
                <div class="h-full transition-all duration-1000 {status.color}" style="width: {Math.min(ratio * 2.5, 100)}%"></div>
            </div>
          </div>

          <div class="bg-slate-900 rounded-[2.5rem] p-6 text-white relative overflow-hidden">
            <div class="relative z-10 flex items-center justify-between">
              <div>
                <h3 class="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Rental Tip</h3>
                <p class="text-xs text-slate-400 leading-relaxed max-w-[320px]">
                    While landlords look for 3x Gross Income, staying under 30% of your <b>Net Income</b> ensures you have enough for savings and life.
                </p>
              </div>
              <Info size={32} class="text-indigo-500 opacity-50" />
            </div>
          </div>
      </section>
    </div>
  </div>
</main>