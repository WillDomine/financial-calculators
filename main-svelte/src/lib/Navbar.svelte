<script lang="ts">
    import { Home, PieChart, Car, Building2, Unplug, Banknote, Settings, ChartLine } from '@lucide/svelte';

    // This prop receives the current page from App.svelte
    export let activePage = "/";

    const navItems = [
        { id: "connector", name: "Connector", icon: Unplug, color: 'bg-slate-600' },
        { id: "budget", name: "Budget", icon: PieChart, color: 'bg-blue-600' },
        { id: "income", name: "Income", icon: Banknote, color: 'bg-emerald-600' },
        { id: "mortgage", name: "Mortgage", icon: Home, color: 'bg-rose-600' },
        { id: "apartment", name: "Apartment", icon: Building2, color: 'bg-purple-600' },
        { id: "car", name: "Car", icon: Car, color: 'bg-amber-600' },
        { id: "settings", name: "Settings", icon:Settings, color: 'bg-slate-600'}
    ];

    // Helper to handle clicks if you aren't using a router
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    function navigate(item:any, event:any) {
        // If you are NOT using SvelteKit, prevent the link reload and swap components
        event.preventDefault();
        dispatch('navigate', item.id);
    }
</script>

<aside class="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3 p-3 bg-white border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-4xl">
    {#each navItems as item}
        {@const Icon = item.icon}
        {@const active = activePage === item.id}
        
        <a
            href={item.id}
            on:click={(e) => navigate(item, e)}
            class="relative group p-4 rounded-2xl transition-all duration-500 {active 
                ? `text-slate-50 ${item.color} shadow-inner` 
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"}"
        >
            <svelte:component this={Icon} size={24} strokeWidth={active ? 2.5 : 2} />
            
            <div class="absolute left-16 top-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 transition-all origin-left pointer-events-none">
                <span class="bg-white border border-slate-100 text-slate-900 text-xs font-bold px-4 py-2 rounded-xl shadow-xl whitespace-nowrap">
                    {item.name}
                </span>
            </div>
        </a>
    {/each}
</aside>

<nav class="fixed bottom-6 left-4 right-4 z-50 md:hidden bg-white/90 backdrop-blur-xl border border-white rounded-4xl p-2 shadow-2xl">
    <div class="flex justify-around items-center">
        {#each navItems as item}
            {@const Icon = item.icon}
            {@const active = activePage === item.id}
            
            <a 
                href={item.id} 
                on:click={(e) => navigate(item, e)}
                class="p-3 rounded-2xl transition-colors {active ? `${item.color} text-white` : "text-slate-400"}"
            >
                <svelte:component this={Icon} size={22} />
            </a>
        {/each}
    </div>
</nav>