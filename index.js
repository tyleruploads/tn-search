const timeEl = document.getElementById('time');
const engineSelectInput = document.getElementById('engineSelectInput');
const engineDatalist = document.getElementById('engineDatalist');
const inputSearch = document.getElementById('input-search');
const buttonSearch = document.getElementById('button-search');

let engineChoice = document.getElementById('default-engine');

function saveEngineChoice(engineChoice) {
    localStorage.setItem("engineChoice", engineChoice);
}

function startTimeLoop() {
    // Set time once at start, so it is not blank for an ENTIRE second!
    const date = new Date;
    timeEl.setAttribute("datetime", date);
    timeEl.textContent = date.toLocaleTimeString('en-US', { hour12: true });

    setInterval(() => {
        const date = new Date;
        timeEl.setAttribute("datetime", date);
        timeEl.textContent = date.toLocaleTimeString('en-US', { hour12: true });
    }, 1000);
}

function looksLikeURL(input) {
    // If it contains :// but is not HTTPS or HTTP, treat it like a URL
    // This is because there are so many protocals
    // Not using lowercase version because certain protocals may require specific casing, like data://
    if (input.includes('://') && !input.startsWith('https://') && !input.startsWith('http://') && input.indexOf('://') < 10) {
        return input.trim();
    }

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
 
    // If there is a / but no ., return false. This is to fix the past issue of math equations like '34/8' getting turned into an IP Addresses using HTTPS
    if (trimmed.includes('/') && !trimmed.includes('.')) {
        return false;
    }

    // Add the https protocol to check structure
    const inputWithScheme = trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : 'https://' + trimmed;


    if (URL.canParse(inputWithScheme) && new URL(inputWithScheme).hostname.includes('.')) {
        return inputWithScheme
    } else {
        return false;
    }
}

function checkIfTool() {
    const currentInputValue = engineSelectInput.value;
    const matchedOption = Array.from(engineDatalist.options).find(
        option => option.value === currentInputValue
    );

    return matchedOption ? matchedOption.getAttribute('data-category') === 'tool' : false;
}

function getSearchURL(query) {
    const currentInputValue = engineSelectInput.value;
    const matchedOption = Array.from(engineDatalist.options).find(
        option => option.value === currentInputValue
    );

    const urlPattern = matchedOption ? matchedOption.getAttribute('data-url') : null;
    
    return urlPattern.replace('{query}', query);
}

function search() {
    const userInput = inputSearch.value;
    let url; 

    // If it is to a specific URL, simply go to the URL, if they did not select a tool
    const isUrl = looksLikeURL(userInput);
    if (checkIfTool() === true) {
        const safeSearch = encodeURIComponent(userInput);
        url = getSearchURL(safeSearch);
    } else if (isUrl) {
        url = isUrl;
    } else {
        const safeSearch = encodeURIComponent(userInput);
        url = getSearchURL(safeSearch);
    }

    window.location.href = url;
}

document.addEventListener('DOMContentLoaded', () => {
    // Start the set time loop
    startTimeLoop();

    // Check if engineChoice saved to localStorage 

    const savedEngineChoice = localStorage.getItem('engineChoice');
    if (savedEngineChoice !== null) {
        const matchedOption = Array.from(engineDatalist.options).find(
        option => option.value === savedEngineChoice
        );
        engineChoice = matchedOption || savedEngineChoice;
        engineSelectInput.value = savedEngineChoice;
    }

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

engineSelectInput.addEventListener('blur', () => {
    const currentInputValue = engineSelectInput.value;

    if (!currentInputValue) { 
        engineSelectInput.value = typeof engineChoice === 'string' ? engineChoice : (engineChoice?.value || engineChoice?.textContent?.trim() || '');
    } else {
        engineChoice = engineSelectInput.value;
        saveEngineChoice(engineChoice);
    }
});

engineSelectInput.addEventListener('click', () => {
    engineSelectInput.select();
    try {
        engineSelectInput.showPicker();
    } catch (err) {
        console.warn(`Automatic showing of engine select picker not supported: ${err}`);
    }
});

engineSelectInput.addEventListener('input', (e) => {
    const currentInputValue = e.target.value;

    const matchedOption = Array.from(engineDatalist.options).find(
        option => option.value === currentInputValue
    );

    if (matchedOption && matchedOption.classList.contains('select-header')) {
        alert("Sorry, this option can not be selected because it is a header");
        e.target.value = '';
    }
});

buttonSearch.addEventListener('click', search);
