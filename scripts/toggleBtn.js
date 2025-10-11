import { loadFromStorage, saveToStorage } from '../tasks.js';

let activeBtnContainer = null;

export function toggleTaskControls() {    
    document.querySelectorAll('.js-list-toggler').forEach((toggler) => {
        toggler.addEventListener('click', () => {
            const parent = toggler.parentElement.parentElement;
            showOrHideControls(parent.querySelector('.btn-container'))
        })
    })

    function showOrHideControls(activeContainer) {
        if (activeBtnContainer === activeContainer) {
            activeContainer.classList.add('hidden');
            activeBtnContainer = null;
        } else {
            document.querySelectorAll('.btn-container').forEach((container) => container.classList.add('hidden'));
            activeContainer.classList.remove('hidden');
            activeBtnContainer = activeContainer;
        }
    }
}

function toggleTheme() {

}