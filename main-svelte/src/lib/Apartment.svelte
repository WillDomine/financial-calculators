<script>
  import { appData } from '../utils/store.ts';
  import { Building2, Users, ArrowRight, Droplets, ShieldCheck } from '@lucide/svelte';

  // 1. Bind to store (starting as null or 0)
  let rent = $appData.apartment.rent; // null
  let utils = $appData.apartment.utilities; // null
  let insurance = $appData.apartment.insurance; // null
  let roommates = $appData.apartment.roommates || 1;

  // 2. Reactive Calculations
  $: totalBuilding = (rent || 0) + (utils || 0);
  $: yourShare = (totalBuilding / roommates) + (insurance || 0);

  $: netIncome = $appData.income.net_monthly || 0;
  $: ratio = netIncome > 0 ? (yourShare / netIncome) * 100 : 0;

  // Reactive Status for the Card
  $: status = (() => {
    if (!rent) return { text: "Enter Details", bg: "bg-slate-50", border: "border-slate-100", textCol: "text-slate-400" };
    if (ratio <= 30) return { text: "Affordable", bg: "bg-emerald-50", border: "border-emerald-200", textCol: "text-emerald-600" };
    if (ratio <= 45) return { text: "Stretch", bg: "bg-amber-50", border: "border-amber-200", textCol: "text-amber-600" };
    return { text: "Aggressive", bg: "bg-rose-50", border: "border-rose-200", textCol: "text-rose-600" };
  })();

  // 3. Actions
  let feedback = false;

  function pushToBudget() {
    $appData.budget.needs = [
      ...$appData.budget.needs.filter(item => item.name !== "Rent" && item.name !== "Apartment"),
      { name: "Rent", amount: Math.round(yourShare) }
    ];

    // Save inputs back to store
    $appData.apartment = { rent, utilities: utils, insurance, roommates, your_share: Math.round(yourShare) };

    feedback = true;
    setTimeout(() => feedback = false, 2000);
  }
</script>

<main class="md:ml-24 p-4 lg:p-8 max-w-[1200px] mx-auto pb-32">
  
  <header class="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 mb-8 border border-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
    <div class="flex items-center gap-4 text-indigo-600">
      <div class="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
        <Building2 size={32} />
      </div>
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Rent Hub</h1>
        <p class="text-slate-500 font-medium">Split bills & check affordability</p>
      </div>
    </div>
    <div class="text-center md:text-right">
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Your Monthly Share</p>
      <p class="text-4xl font-black text-indigo-600">
        {yourShare > 0 ? `$${Math.round(yourShare).toLocaleString()}` : '$---'}
      </p>
    </div>
  </header>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <section class="space-y-6">
      <div class="bg-indigo-600 rounded-[2.5rem] p-6 text-white shadow-xl shadow-indigo-100">
          <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                  <Users size={24} />
                  <h2 class="font-black text-lg">Split with Roommates?</h2>
              </div>
              <div class="flex items-center bg-white/20 p-1 rounded-xl border border-white/20">
                  <button on:click={() => roommates > 1 && roommates--} class="w-10 h-10 flex items-center justify-center font-bold hover:bg-white/20 rounded-lg transition-all">-</button>
                  <span class="w-10 text-center font-black text-xl">{roommates}</span>
                  <button on:click={() => roommates++} class="w-10 h-10 flex items-center justify-center font-bold hover:bg-white/20 rounded-lg transition-all">+</button>
              </div>
          </div>
          <p class="text-indigo-100 text-xs mt-3 font-medium">
            Total costs divided between {roommates} {roommates === 1 ? 'person' : 'people'}.
          </p>
      </div>

      <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
        <div class="space-y-4">
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Total Monthly Rent</label>
            <input type="number" bind:value={rent} placeholder="2400" class="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold text-lg border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Total Utilities</label>
              <input type="number" bind:value={utils} placeholder="200" class="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all" />
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Your Insurance</label>
              <input type="number" bind:value={insurance} placeholder="20" class="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all" />
            </div>
          </div>
        </div>
      </div>

      <button on:click={pushToBudget} class="w-full {feedback ? 'bg-indigo-600' : 'bg-slate-900'} text-white p-6 rounded-[2rem] font-black text-lg transition-all flex items-center justify-center gap-3 group shadow-xl">
        {feedback ? '✓ Added to Budget' : 'Push to Budget Needs'}
        {#if !feedback} <ArrowRight class="group-hover:translate-x-2 transition-transform" /> {/if}
      </button>
    </section>

    <section class="space-y-6">
      <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">Affordability Breakdown</h2>
          
          <div class="p-8 rounded-[2rem] border-2 transition-all duration-500 {status.bg} {status.border}">
              <div class="flex justify-between items-center mb-6">
                  <span class="font-black text-xl uppercase tracking-tight {status.textCol}">{status.text}</span>
                  <span class="bg-white px-3 py-1 rounded-full text-xs font-black shadow-sm">
                    {rent ? `${Math.round(ratio)}% of Net` : '0%'}
                  </span>
              </div>
              
              <div class="space-y-4">
                  <div class="flex justify-between text-sm font-bold">
                      <span class="text-slate-400">Total Building Cost</span>
                      <span class="text-slate-900">${Math.round(totalBuilding).toLocaleString()}</span>
                  </div>
                  <div class="flex justify-between text-sm font-bold border-t border-slate-200 pt-4">
                      <span class="text-slate-400">Your Share</span>
                      <span class="text-indigo-600">${Math.round(yourShare).toLocaleString()}</span>
                  </div>
              </div>

              <div class="mt-8">
                  <div class="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                      <div class="bg-indigo-500 h-full transition-all duration-1000" style="width: {Math.min(ratio, 100)}%"></div>
                  </div>
              </div>
          </div>
      </div>
    </section>
  </div>
</main>