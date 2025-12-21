// The master object that holds everything
export let app_data = {
    income: { user_salary: 0 },
    mortgage: { monthly_total: 0 },
    budget: {
        net_income: 0,
        selected_budget: "503020",
        needs: [], // JavaScript knows this is an array
        wants: [],
        investments: []
    }
};

export const save_all = () => {
    localStorage.setItem("fin_app_data", JSON.stringify(app_data));
};

export const init_data = () => {
    const saved = localStorage.getItem("fin_app_data");
    if (saved) {
        app_data = JSON.parse(saved);
    } else {
        save_all();
    }
};

export function sync_app(path, value) {
    const keys = path.split('.');
    let current = app_data;
    keys.forEach((key, i) => {
        if (i === keys.length - 1) {
            current[key] = value;
        } else {
            if (!current[key]) current[key] = {};
            current = current[key];
        }
    });
    save_all();
    window.dispatchEvent(new Event('app-updated'));
}