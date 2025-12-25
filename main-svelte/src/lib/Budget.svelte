<script lang="ts">
    import { appData } from '../utils/store';
    import { Plus, Zap, Heart, TrendingUp, Landmark, Trash2, Wallet, AlertCircle } from '@lucide/svelte';
    import AddItemOverlay from './components/AddItemOverlay.svelte';

    // 1. Strategies Definition
    const strategies: Record<string, {needs: number, wants: number, inv: number}> = {
        "503020": { needs: 0.50, wants: 0.30, inv: 0.20 },
        "702010": { needs: 0.70, wants: 0.20, inv: 0.10 },
        "602020": { needs: 0.60, wants: 0.20, inv: 0.20 }
    };

    // 2. State for Modal
    let showModal = false;
    let activeCategory: 'needs' | 'wants' | 'investments' = 'needs';

    // 3. Reactive Calculations
    $: income = $appData.income.net_monthly || 0;
    $: currentStrat = strategies[$appData.budget.selected_strategy || "503020"];

    $: limits = {
        needs: income * currentStrat.needs,
        wants: income * currentStrat.wants,
        inv: income * currentStrat.inv
    };

    $: totals = {
        needs: $appData.budget.needs.reduce((sum:number, item:any) => sum + item.amount, 0),
        wants: $appData.budget.wants.reduce((sum:number, item:any) => sum + item.amount, 0),
        inv: $appData.budget.investments.reduce((sum:number, item:any) => sum + item.amount, 0)
    };

    // The "Bottom Line" Logic
    $: totalSpent = totals.needs + totals.wants + totals.inv;
    $: remaining = income - totalSpent;

    // 4. Functions
    function openModal(category: 'needs' | 'wants' | 'investments') {
        activeCategory = category;
        showModal = true;
    }

    function handleAddItem(event: any) {
        const { name, amount } = event.detail;
        if (name && amount) {
            $appData.budget[activeCategory] = [
                ...$appData.budget[activeCategory], 
                { name, amount }
            ];
            showModal = false;
        }
    }

    function removeItem(category:string, index:number) {
        $appData.budget[category] = $appData.budget[category].filter((_:any, i:number) => i !== index);
    }
</script>

<AddItemOverlay 
    show={showModal} 
    categoryName={activeCategory} 
    on:close={() => showModal = false} 
    on:add={handleAddItem} 
/>

<main class="md:ml-24 p-4 lg:p-8 max-w-400 mx-auto pb-32">
    
    <section class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm flex items-center justify-between col-span-1 md:col-span-1">
            <div class="flex items-center gap-3">
                <div class="p-2.5 bg-blue-600 text-white rounded-xl">
                    <Landmark size={20} />
                </div>
                <div>
                    <h1 class="text-xl font-black text-slate-900">Budget Hub</h1>
                    <select bind:value={$appData.budget.selected_strategy} class="text-[10px] font-bold text-slate-400 uppercase outline-none bg-transparent cursor-pointer">
                        <option value="503020">50/30/20 Plan</option>
                        <option value="702010">70/20/10 Plan</option>
                        <option value="602020">60/20/20 Plan</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Income</p>
                <p class="text-2xl font-black text-slate-900">${income.toLocaleString()}</p>
            </div>
            <Wallet class="text-slate-300" size={24} />
        </div>

        <div class="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Expenses</p>
                <p class="text-2xl font-black text-slate-900">${totalSpent.toLocaleString()}</p>
            </div>
            <Zap class="text-slate-300" size={24} />
        </div>

        <div class="p-6 rounded-4xl border border-slate-100 shadow-sm flex items-center justify-between {remaining >= 0 ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-rose-500 text-white shadow-rose-100'} transition-all">
            <div>
                <p class="text-[10px] font-black opacity-80 uppercase tracking-widest">Remaining</p>
                <p class="text-2xl font-black">${Math.round(remaining).toLocaleString()}</p>
            </div>
            {#if remaining < 0}
                <AlertCircle size={28} />
            {:else}
                <TrendingUp size={28} />
            {/if}
        </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="flex flex-col gap-4">
            <div class="bg-white rounded-4xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                <h2 class="text-xl font-black text-slate-900 mb-1">Needs</h2>
                <p class="text-[10px] font-bold text-blue-600 uppercase mb-4">{currentStrat.needs * 100}% Target</p>
                <div class="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div class="h-full transition-all duration-700 {totals.needs > limits.needs ? 'bg-rose-500' : 'bg-blue-600'}" 
                         style="width: {Math.min((totals.needs / (limits.needs || 1)) * 100, 100)}%"></div>
                </div>
                <div class="flex justify-between text-xs font-black">
                    <span class={totals.needs > limits.needs ? 'text-rose-500' : 'text-slate-500'}>${Math.round(totals.needs).toLocaleString()}</span>
                    <span class="text-slate-300">limit ${Math.round(limits.needs).toLocaleString()}</span>
                </div>
            </div>

            <div class="space-y-3">
                {#each $appData.budget.needs as item, i}
                    <div class="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center group hover:border-blue-200 transition-all">
                        <div>
                            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.name}</p>
                            <p class="font-bold text-slate-900">${item.amount.toLocaleString()}</p>
                        </div>
                        <button on:click={() => removeItem('needs', i)} class="text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                            <Trash2 size={16} />
                        </button>
                    </div>
                {/each}
                <button on:click={() => openModal('needs')} class="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-xs hover:border-blue-400 hover:text-blue-600 transition-all bg-white/50">
                    <Plus size={14} class="inline mr-1" /> Add Need
                </button>
            </div>
        </div>

        <div class="flex flex-col gap-4">
            <div class="bg-white rounded-4xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                <h2 class="text-xl font-black text-slate-900 mb-1">Wants</h2>
                <p class="text-[10px] font-bold text-purple-600 uppercase mb-4">{currentStrat.wants * 100}% Target</p>
                <div class="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div class="h-full transition-all duration-700 {totals.wants > limits.wants ? 'bg-rose-500' : 'bg-purple-600'}" 
                         style="width: {Math.min((totals.wants / (limits.wants || 1)) * 100, 100)}%"></div>
                </div>
                <div class="flex justify-between text-xs font-black">
                    <span class={totals.wants > limits.wants ? 'text-rose-500' : 'text-slate-500'}>${Math.round(totals.wants).toLocaleString()}</span>
                    <span class="text-slate-300">limit ${Math.round(limits.wants).toLocaleString()}</span>
                </div>
            </div>

            <div class="space-y-3">
                {#each $appData.budget.wants as item, i}
                    <div class="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center group hover:border-purple-200 transition-all">
                        <div>
                            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.name}</p>
                            <p class="font-bold text-slate-900">${item.amount.toLocaleString()}</p>
                        </div>
                        <button on:click={() => removeItem('wants', i)} class="text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                            <Trash2 size={16} />
                        </button>
                    </div>
                {/each}
                <button on:click={() => openModal('wants')} class="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-xs hover:border-purple-400 hover:text-purple-600 transition-all bg-white/50">
                    <Plus size={14} class="inline mr-1" /> Add Want
                </button>
            </div>
        </div>

        <div class="flex flex-col gap-4">
            <div class="bg-white rounded-4xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                <h2 class="text-xl font-black text-slate-900 mb-1">Savings</h2>
                <p class="text-[10px] font-bold text-emerald-600 uppercase mb-4">{currentStrat.inv * 100}% Target</p>
                <div class="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div class="h-full transition-all duration-700 {totals.inv > limits.inv ? 'bg-rose-500' : 'bg-emerald-500'}" 
                         style="width: {Math.min((totals.inv / (limits.inv || 1)) * 100, 100)}%"></div>
                </div>
                <div class="flex justify-between text-xs font-black">
                    <span class={totals.inv > limits.inv ? 'text-rose-500' : 'text-slate-500'}>${Math.round(totals.inv).toLocaleString()}</span>
                    <span class="text-slate-300">limit ${Math.round(limits.inv).toLocaleString()}</span>
                </div>
            </div>

            <div class="space-y-3">
                {#each $appData.budget.investments as item, i}
                    <div class="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center group hover:border-emerald-200 transition-all">
                        <div>
                            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.name}</p>
                            <p class="font-bold text-slate-900">${item.amount.toLocaleString()}</p>
                        </div>
                        <button on:click={() => removeItem('investments', i)} class="text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                            <Trash2 size={16} />
                        </button>
                    </div>
                {/each}
                <button on:click={() => openModal('investments')} class="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-xs hover:border-emerald-400 hover:text-emerald-600 transition-all bg-white/50">
                    <Plus size={14} class="inline mr-1" /> Add Savings
                </button>
            </div>
        </div>
    </div>
</main>