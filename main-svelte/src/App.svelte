<script lang="ts">
  import Navbar from './lib/Navbar.svelte';
  import Home from './lib/Home.svelte';
  import Mortgage from './lib/Mortgage.svelte';
  import Income from './lib/Income.svelte';
  import Car from './lib/Car.svelte';
  import Apartment from './lib/Apartment.svelte';
  import Budget from './lib/Budget.svelte';
  import Settings from './lib/Settings.svelte';

  let activePage = 'connector';

  const titles:any = {
    'connector': 'Financial Hub | Home',
    'mortgage': 'Mortgage Calculator',
    'income': 'Income Estimator',
    'car': 'Auto Hub',
    'apartment': 'Rent Hub',
    'budget': 'Budget Hub',
    'settings': 'Settings'
  };

  $: currentTitle = titles[activePage] || 'Financial Planner';
</script>

<svelte:head>
  <title>{currentTitle}</title>
</svelte:head>

<div class="flex min-h-screen bg-slate-50">
  {#if activePage !== 'connector'}
  <Navbar {activePage} on:navigate={(e) => activePage = e.detail} />
  {/if}
  <div class="flex-1 overflow-x-hidden">
    {#if activePage === 'connector'}
      <Home on:navigate={(e) => activePage = e.detail} />
    {:else if activePage === 'mortgage'}
      <Mortgage />
    {:else if activePage === 'income'}
      <Income />
    {:else if activePage === 'car'}
      <Car />
    {:else if activePage === 'apartment'}
      <Apartment />
    {:else if activePage === 'budget'}
      <Budget />
    {:else if activePage === 'settings'}
      <Settings />
    {/if}
  </div>
</div>

