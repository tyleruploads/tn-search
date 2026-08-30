const inputSearch = document.getElementById('input-search');
const buttonSearch = document.getElementById('button-search');


function looksLikeURL(input) {
    const trimmed = input.trim().toLowerCase();

    // Reject if it contains spaces
    if (trimmed.includes(' ')) {
        return false;
    }

    // Check for localhost
    if (trimmed === 'localhost' || trimmed.startsWith('localhost/')) {
        return 'http://' + trimmed;
    }

    // Test directly if it starts with http:// or https://
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        if (URL.canParse(trimmed) && new URL(trimmed).hostname.includes('.')) {
            return trimmed;
        }
        // Go through with other checks if failed
    }

    // Add the https protocol to check structure
    const inputWithScheme = trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : 'https://' + trimmed;


    if (URL.canParse(inputWithScheme) && new URL(inputWithScheme).hostname.includes('.')) {
        return inputWithScheme
    } else {
        return false;
    }
}

function search() {
    const userInput = inputSearch.value;
    let url;

    // If it is to a specific URL, simply go to the URL
    const isUrl = looksLikeURL(userInput);
    if (isUrl) {
        url = isUrl;
    } else {
        const search = encodeURIComponent(userInput);
        url = `https://www.google.com/search?q=${search}`;
    }

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
