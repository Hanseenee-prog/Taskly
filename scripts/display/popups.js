import { saveToStorage, tasks } from "../tasks.js";
import { displayTasks } from "./displayTasks.js";

export function setupSortButton() {
    const sortBtn = document.querySelector('.sort');
    const sortDropdown = document.querySelector('.sort-dropdown');
    const sortOptions = document.querySelectorAll('.sort-option');

    const checkedSortOptionValue = localStorage.getItem('checkedSortOption') || 'date-newest';
    if (checkedSortOptionValue) {
        const loadedSortOption = document.querySelector(`input[value = ${checkedSortOptionValue}]`);
        loadedSortOption.checked = true;
        loadedSortOption.closest('.sort-option').classList.add('active-sort');
    } else {
        document.querySelector(`input[value = 'date-newest']`).checked = true;
        document.querySelector(`input[value = 'date-newest']`).classList.add('active-sort');
    }
    
    sortBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        if (sortDropdown.classList.contains('hidden')) {
            sortDropdown.classList.remove('hidden');
        } else {
            closeDropdown();
        }
    });

    document.addEventListener('click', (e) => {
        if (!sortDropdown.contains(e.target) && !sortBtn.contains(e.target)) closeDropdown();
    });

    function closeDropdown() {
        sortDropdown.classList.add('roll-up');
        setTimeout(() => {
            sortDropdown.classList.add('hidden');
            sortDropdown.classList.remove('roll-up');
        }, 300);
    };
    
    sortOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            const inputOption = e.target.closest('input[name="sort"]');
            if(!inputOption) return;

            if (e.target.contains(option) || e.target.contains(inputOption)) {
                sortOptions.forEach(option => option.classList.remove('active-sort'))
                option.classList.add('active-sort');
            }

            const sortValue = inputOption.value;
            localStorage.setItem('checkedSortOption', `${sortValue}`)
            applySort();
            closeDropdown();
            saveToStorage();
            displayTasks();
        }) 
    })
}

export function applySort() {
    const savedSort = localStorage.getItem('checkedSortOption') || 'date-newest';
    
    switch (savedSort) {
        case 'date-oldest':
            tasks.sort((a, b) => dayjs(`${a.date} ${a.time}`) - dayjs(`${b.date} ${b.time}`));
            break;
        case 'name-asc':
            tasks.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            tasks.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default:
            tasks.sort((a, b) => dayjs(`${b.date} ${b.time}`) - dayjs(`${a.date} ${a.time}`));
    }
}