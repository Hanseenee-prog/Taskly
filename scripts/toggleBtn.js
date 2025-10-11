let activeBtnContainer = null;
let currentTheme = 'dark';

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

export function toggleTheme() {
    const light = document.querySelector('.light');
    const dark = document.querySelector('.moon');

    document.querySelector('.theme-toggle-btn').addEventListener('click', (e) => {
        if (e.target.id === 'light') {
            light.classList.add('hidden');
        } else {
            dark.classList.remove('hidden');
        }
    })
}