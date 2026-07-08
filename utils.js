// Utilities
function showNotification(message, type = 'success') {
    const div = document.createElement('div');
    div.className = `notification ${type}`;
    div.style.background = type === 'success' ? '#28a745' : '#dc3545';
    div.innerText = message;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

function showSpinner(show) {
    let spinner = document.getElementById('spinner');
    if (show) {
        if (!spinner) {
            spinner = document.createElement('div');
            spinner.id = 'spinner';
            spinner.className = 'spinner';
            spinner.innerText = 'Loading...';
            document.body.appendChild(spinner);
        }
    } else if (spinner) {
        spinner.remove();
    }
}
