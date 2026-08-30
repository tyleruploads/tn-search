const inputSearch = document.getElementById('input-search');
const buttonSearch = document.getElementById('button-search');

function search() {
    const search = encodeURIComponent(inputSearch.value);
    
    const url = `https://www.google.com/search?q=${search}`;

    window.location.href = url;
 
}

document.addEventListener('DOMContentLoaded', () => {
    inputSearch.focus(); // Automatically focus onto input on page load
});

window.addEventListener('keydown', e => {
    // Refocus onto input box on Ctrl + /
    if (e.ctrlKey && e.key === '/') {
        // Prevent default behavior
        e.preventDefault();

        inputSearch.focus();
    }
});

inputSearch.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        search();
    }
});

buttonSearch.addEventListener('click', search);
