import { saveToStorage, tasks } from "../tasks.js";
import { displayTasks } from "./displayTasks.js";

export function setupSortButton() {
    const sortBtn = document.querySelector('.sort');
    const sortDropdown = document.querySelector('.sort-dropdown');
    let activeSortOption = null;
    
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
    
    document.querySelectorAll('.sort-option').forEach(option => {
        option.addEventListener('click', (e) => {
            if (activeSortOption) {
                option.classList.remove('active');
            }

            if (activeSortOption === option) {
                activeSortOption = null;
            } else {
                option.classList.add('active');
                activeSortOption = option;
            }

            const inputOption = e.target.closest('input[name="sort"]');
            if(!inputOption) return;

            const sortValue = inputOption.value;
            applySort(sortValue);
            closeDropdown();
        }) 
    })
}

function applySort(value) {
    switch (value) {
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

    saveToStorage();
    displayTasks();
}