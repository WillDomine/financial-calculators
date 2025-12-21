<script lang="ts">
    import { appData } from '../utils/store.ts';
    import { Plus, Zap, Heart, TrendingUp, Landmark, Trash2, X, RefreshCcw } from '@lucide/svelte';
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

    $: getPercent = (spent:number, limit:number) => (limit > 0 ? Math.min((spent / limit) * 100, 100) : 0);

    // 4. Functions
    function openModal(category: 'needs' | 'wants' | 'investments') {
        activeCategory = category;
        showModal = true;
    }

    // THIS IS THE FIX: Handle the data from the event detail
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

<main class="md:ml-24 p-4 lg:p-8 max-w-[1600px] mx-auto pb-32">
    
    <section class="bg-white/80 backdrop-blur-md rounded-[2rem] p-5 mb-6 border border-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
            <div class="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200">
                <Landmark size={20} />
            </div>
            <div>
                <h1 class="text-xl font-black text-slate-900 tracking-tight">Budget Hub</h1>
                <p class="flex items-center gap-1 text-[9px] font-bold text-emerald-400 uppercase tracking-widest transition-colors">
                    Real Time
                </p>
            </div>
        </div>

        <div class="flex flex-row items-center gap-3 w-full sm:w-auto">
            <div class="bg-white border border-slate-100 p-2.5 rounded-xl shadow-sm flex-1 sm:min-w-[180px]">
                <label class="block text-[9px] font-black text-slate-400 uppercase mb-0.5">Net Monthly Income</label>
                <div class="flex font-bold">
                    <span class="text-slate-400 pr-0.5">$</span>
                    <input type="number" bind:value={$appData.income.net_monthly} placeholder="0" class="bg-transparent font-bold outline-none w-full text-slate-900" />
                </div>
            </div>
            <div class="bg-white border border-slate-100 p-2.5 rounded-xl shadow-sm flex-1 sm:min-w-[180px]">
                <label class="block text-[9px] font-black text-slate-400 uppercase mb-0.5">Budget Strategy</label>
                <select bind:value={$appData.budget.selected_strategy} class="bg-transparent font-bold outline-none w-full text-slate-700 text-sm cursor-pointer">
                    <option value="503020">50/30/20 (Standard)</option>
                    <option value="702010">70/20/10 (Aggressive)</option>
                    <option value="602020">60/20/20 (Balanced)</option>
                </select>
            </div>
        </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="flex flex-col gap-4">
            <div class="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                <div class="absolute -top-2 -right-2 p-6 opacity-5 text-blue-600"><Zap size={80} /></div>
                <h2 class="text-xl font-black text-slate-900 mb-1">Needs</h2>
                <p class="text-[10px] font-bold text-blue-600 uppercase mb-3">{currentStrat.needs * 100}% Allocation</p>
                <div class="flex justify-between text-xs font-bold mb-1.5">
                    <span class="text-slate-400">Used: ${Math.round(totals.needs)}</span>
                    <span class="text-blue-600">Limit: ${Math.round(limits.needs)}</span>
                </div>
                <div class="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div class="bg-blue-600 h-full transition-all duration-700" style="width: {getPercent(totals.needs, limits.needs)}%"></div>
                </div>
            </div>

            <div class="space-y-3">
                {#each $appData.budget.needs as item, i}
                    <div class="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center group">
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
            <div class="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                <div class="absolute -top-2 -right-2 p-6 opacity-5 text-purple-600"><Heart size={80} /></div>
                <h2 class="text-xl font-black text-slate-900 mb-1">Wants</h2>
                <p class="text-[10px] font-bold text-purple-600 uppercase mb-3">{currentStrat.wants * 100}% Allocation</p>
                <div class="flex justify-between text-xs font-bold mb-1.5">
                    <span class="text-slate-400">Used: ${Math.round(totals.wants)}</span>
                    <span class="text-purple-600">Limit: ${Math.round(limits.wants)}</span>
                </div>
                <div class="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div class="bg-purple-600 h-full transition-all duration-700" style="width: {getPercent(totals.wants, limits.wants)}%"></div>
                </div>
            </div>
            
            <div class="space-y-3">
                {#each $appData.budget.wants as item, i}
                    <div class="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center group">
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
            <div class="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                <div class="absolute -top-2 -right-2 p-6 opacity-5 text-emerald-600"><TrendingUp size={80} /></div>
                <h2 class="text-xl font-black text-slate-900 mb-1">Savings</h2>
                <p class="text-[10px] font-bold text-emerald-600 uppercase mb-3">{currentStrat.inv * 100}% Allocation</p>
                <div class="flex justify-between text-xs font-bold mb-1.5">
                    <span class="text-slate-400">Used: ${Math.round(totals.inv)}</span>
                    <span class="text-emerald-600">Limit: ${Math.round(limits.inv)}</span>
                </div>
                <div class="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div class="bg-emerald-500 h-full transition-all duration-700" style="width: {getPercent(totals.inv, limits.inv)}%"></div>
                </div>
            </div>
            
            <div class="space-y-3">
                {#each $appData.budget.investments as item, i}
                    <div class="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center group">
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
                    <Plus size={14} class="inline mr-1" /> Add Investment
                </button>
            </div>
        </div>
    </div>
</main>
