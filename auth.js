async function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    try {
        const response = await fetch(`${CONFIG.API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            sessionStorage.setItem('token', data.token);
            alert('Login successful!');
            // Redirect to dashboard (will implement next)
        } else {
            alert(data.message || 'Login failed.');
        }
    } catch (e) {
        console.error('Login error:', e);
        alert('Connection error.');
    }
}