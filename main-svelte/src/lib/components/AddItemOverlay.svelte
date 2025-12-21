<script lang="ts">
    import { X, Plus } from '@lucide/svelte';
    import { fade, scale } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';

    export let show = false;
    export let categoryName = "";

    const dispatch = createEventDispatcher();
    
    // Internal state for the inputs
    let name = "";
    let amount: number | null = null;

    function close() {
        name = "";
        amount = null;
        dispatch('close');
    }

    function submit() {
        if (name && amount) {
            // We send the name and amount back to the parent
            dispatch('add', { name, amount });
            close();
        }
    }
</script>

{#if show}
    <div transition:fade={{duration: 200}} class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" on:click={close}>
        <div transition:scale={{duration: 300, start: 0.95}} class="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl" on:click|stopPropagation>
            <div class="flex justify-between items-center mb-8">
                <h2 class="text-2xl font-black text-slate-900 capitalize">Add {categoryName}</h2>
                <button on:click={close} class="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                    <X size={20} />
                </button>
            </div>

            <div class="space-y-6">
                <div>
                    <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 text-left">Item Name</label>
                    <input type="text" bind:value={name} placeholder="e.g. Netflix" class="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-blue-500 transition-all" />
                </div>

                <div>
                    <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 text-left">Monthly Amount</label>
                    <div class="relative">
                        <span class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                        <input type="number" bind:value={amount} placeholder="0" class="w-full bg-slate-50 p-4 pl-10 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-blue-500 transition-all" />
                    </div>
                </div>

                <button 
                    on:click={submit} 
                    disabled={!name || !amount}
                    class="w-full bg-slate-900 text-white p-5 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-600 disabled:opacity-50 transition-all"
                >
                    <Plus size={18} />
                    Add to List
                </button>
            </div>
        </div>
    </div>
{/if}