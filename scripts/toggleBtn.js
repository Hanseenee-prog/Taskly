let activeBtnContainer = null;
const light = document.querySelector('.light');
const dark = document.querySelector('.moon');

let currentTheme = localStorage.getItem('currentTheme');

if (!currentTheme) {
    currentTheme = 'dark';
}

function enableLightTheme() {
    light.classList.add('hidden');
    dark.classList.remove('hidden');
    document.body.classList.add('light');
    currentTheme = 'light';
    localStorage.setItem('currentTheme', 'light');
}

function enableDarkTheme() {
    dark.classList.add('hidden');
    light.classList.remove('hidden');
    document.body.classList.remove('light');
    currentTheme = 'dark';
    localStorage.setItem('currentTheme', 'dark');
}

export function toggleTheme() {
    document.addEventListener('DOMContentLoaded', () => {
        (currentTheme === 'dark') ? enableDarkTheme() : enableLightTheme();
    })

    light.addEventListener('click', enableLightTheme);
    dark.addEventListener('click', enableDarkTheme);
}

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