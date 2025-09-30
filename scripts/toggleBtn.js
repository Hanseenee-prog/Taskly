let activeBtnContainer = null;

export function toggleTaskControls() {    
    document.querySelectorAll('#listToggler').forEach((toggler) => {
        toggler.addEventListener('click', () => {
            const parent = toggler.parentElement.parentElement;
            showOrHideControls(parent.querySelector('.btn-container'))
        })
    })

    function showOrHideControls(activeContainer) {
        // const {btnContainerId} = activeContainer.dataset;

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
Gm