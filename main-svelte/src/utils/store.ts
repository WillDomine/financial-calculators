import { writable } from 'svelte/store';

// 1. Define the initial structure (The "Blueprint")
const initialData = {
    income: {
        salary: null,
        tax_rate: 25,
        net_monthly: 0
    },
    mortgage: {
        price: null,
        down: null,
        rate: null,
        term: 30,
        tax_rate: 1.2,
        insurance: null,
        monthly_total: 0
    },
    car: {
        price: null,
        down: null,
        rate: null,
        term: 60,
        monthly_total: 0
    },
    apartment: {
        rent: null,
        utilities: null,
        roommates: 1,
        your_share: 0
    },
    budget: {
        needs: [], // e.g. [{name: 'Mortgage', amount: 2400}]
        wants: [],
        investments: []
    }
};

export const resetAllData = () => {
    appData.set(JSON.parse(JSON.stringify(initialData)));
};

// 2. Load from LocalStorage if it exists, otherwise use initialData
const stored = typeof localStorage !== 'undefined' 
    ? JSON.parse(localStorage.getItem('app_data')!) 
    : null;

export const appData = writable(stored || initialData);

// 3. The "Auto-Save" feature
// Every time $appData changes, this runs and saves it to the browser
appData.subscribe(value => {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('app_data', JSON.stringify(value));
    }
});

