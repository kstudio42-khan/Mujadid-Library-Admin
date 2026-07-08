async function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const loginBtn = document.querySelector('.btn');
    
    if (!email || !password) {
        showNotification('Please enter both email and password.', 'error');
        return;
    }

    loginBtn.disabled = true;
    showSpinner(true);

    try {
        const response = await fetch(`${CONFIG.API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            sessionStorage.setItem('token', data.token);
            showNotification('Login successful!');
            window.location.href = 'dashboard.html';
        } else {
            showNotification(data.message || 'Login failed.', 'error');
        }
    } catch (e) {
        showNotification('Network failure. Please check your connection.', 'error');
    } finally {
        loginBtn.disabled = false;
        showSpinner(false);
    }
}

async function validateToken() {
    const token = sessionStorage.getItem('token');
    if (!token) return false;

    try {
        const response = await fetch(`${CONFIG.API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.status === 401) throw new Error('Unauthorized');
        return response.ok;
    } catch (e) {
        return false;
    }
}

async function checkAuth(requireDashboard = false) {
    const isValid = await validateToken();
    const currentPath = window.location.pathname;

    if (isValid) {
        if (currentPath === '/index.html' || currentPath === '/') {
            window.location.href = 'dashboard.html';
        }
    } else {
        sessionStorage.removeItem('token');
        if (currentPath !== '/index.html' && currentPath !== '/') {
            window.location.href = 'index.html';
        }
    }
}

function logout() {
    sessionStorage.removeItem('token');
    window.location.href = 'index.html';
}