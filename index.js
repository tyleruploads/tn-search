const inputSearch = document.getElementById('input-search');
const buttonSearch = document.getElementById('button-search');

buttonSearch.addEventListener('click', () => {
    const search = encodeURIComponent(inputSearch.value);
    
    const url = `https://www.google.com/search?q=${search}`;

    window.location.href = url;
});
