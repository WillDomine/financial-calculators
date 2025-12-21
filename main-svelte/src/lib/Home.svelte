<script lang="ts">
  import { PieChart, Home, Building2, Car, ArrowRight, Banknote } from '@lucide/svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const calculators = [
    {
      id: "budget",
      title: "Budget Planner",
      description: "Track your monthly income and expenses to reach your savings goals.",
      icon: PieChart,
      color: "bg-blue-500",
    },
    {
      id: "income",
      title: "Income Tax Calc",
      description: "Calculate your monthly net income based on salary.",
      icon: Banknote,
      color: "bg-emerald-500",
    },
    {
      id: "mortgage",
      title: "Mortgage Calc",
      description: "Estimate your monthly payments and see how much home you can afford.",
      icon: Home,
      color: "bg-rose-500",
    },
    {
      id: "apartment",
      title: "Apartment Finder",
      description: "Calculate rent-to-income ratios and move-in costs.",
      icon: Building2,
      color: "bg-purple-500",
    },
    {
      id: "car",
      title: "Car Loan",
      description: "Analyze interest rates and terms to find your ideal monthly car payment.",
      icon: Car,
      color: "bg-orange-500",
    }
  ];

  function navigate(id:any) {
    dispatch('navigate', id);
  }
</script>

<main class="min-h-screen bg-slate-50 pb-32">
  <section class="max-w-4xl mx-auto px-6 pb-5 p-5 text-center">
    <h1 class="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
      Take control of your <span class="text-blue-600">financial future.</span>
    </h1>
  </section>

  <section class="max-w-7xl mx-auto px-6">
    <div class="flex flex-wrap justify-center gap-6">
      {#each calculators as calc}
        <button 
          on:click={() => navigate(calc.id)}
          class="group relative text-left overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 transition-all hover:shadow-2xl hover:shadow-blue-100 hover:-translate-y-1 w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.33%-1.5rem)] min-w-[320px]"
        >
          <div class="flex items-start justify-between">
            <div class={`p-4 rounded-2xl ${calc.color} text-white shadow-lg shadow-inner`}>
              <svelte:component this={calc.icon} size={28} />
            </div>
            <div class="text-slate-200 group-hover:text-slate-400 transition-colors">
              <ArrowRight size={24} />
            </div>
          </div>
          
          <div class="mt-8 relative z-10">
            <h2 class="text-2xl font-black text-slate-900 tracking-tight">
              {calc.title}
            </h2>
            <p class="mt-2 text-sm text-slate-500 font-medium leading-relaxed">
              {calc.description}
            </p>
          </div>

          <div class="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity text-slate-900">
             <svelte:component this={calc.icon} size={160} />
          </div>
        </button>
      {/each}
    </div>
  </section>

  <section class="mt-24 text-center">
    <p class="text-sm text-slate-400 font-medium">
      Free to use • No account required • Privacy focused • 
      <span><a href="https://buymeacoffee.com/willdomine5" class="hover:text-blue-600 underline">Buy me a coffee</a></span>
    </p>
  </section>
</main>