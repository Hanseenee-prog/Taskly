const toggleBtn = document.querySelector('#listToggler');

toggleBtn.addEventListener('click', () => {
    document.querySelectorAll('.btn-container').forEach(btn => btn.classList.toggle('hidden'));
})