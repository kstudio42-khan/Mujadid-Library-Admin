async function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const loginBtn = document.querySelector('.btn');
    
    if (!email || !password) {
        alert('Please enter both email and password.');
        return;
    }

    loginBtn.disabled = true;
    loginBtn.innerText = 'Logging in...';

    try {
        const response = await fetch(`${CONFIG.API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            sessionStorage.setItem('token', data.token);
            window.location.href = 'dashboard.html';
        } else {
            alert(data.message || 'Login failed. Please check your credentials.');
        }
    } catch (e) {
        console.error('Login error:', e);
        alert('Network failure. Please check your connection.');
    } finally {
        loginBtn.disabled = false;
        loginBtn.innerText = 'Login';
    }
}

async function validateToken() {
    const token = sessionStorage.getItem('token');
    if (!token) return false;

    try {
        // Assuming /api/auth/me exists and returns user info
        const response = await fetch(`${CONFIG.API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
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