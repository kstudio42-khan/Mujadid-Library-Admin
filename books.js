async function fetchBooks() {
    const token = sessionStorage.getItem('token');
    const content = document.querySelector('.content');
    
    content.innerHTML = '<p>Loading books...</p>';

    try {
        const response = await fetch(`${CONFIG.API_URL}/book`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                sessionStorage.removeItem('token');
                window.location.href = 'index.html';
                return;
            }
            throw new Error('Failed to fetch books');
        }
        
        const books = await response.json();
        renderBooks(books);
    } catch (e) {
        console.error('Fetch books error:', e);
        content.innerHTML = '<p style="color: red;">Failed to load books. Please try again later.</p>';
    }
}

function renderBooks(books) {
    const content = document.querySelector('.content');
    
    let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h2>Books</h2>
            <button class="btn" style="width: auto;">Add Book</button>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="border-bottom: 1px solid #ccc;">
                    <th style="padding: 0.5rem; text-align: left;">Image</th>
                    <th style="padding: 0.5rem; text-align: left;">Name</th>
                    <th style="padding: 0.5rem; text-align: left;">Author</th>
                    <th style="padding: 0.5rem; text-align: left;">Category</th>
                    <th style="padding: 0.5rem; text-align: left;">Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    books.forEach(book => {
        html += `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 0.5rem;"><img src="${book.coverImage || 'placeholder.png'}" alt="Cover" style="width: 50px;"></td>
                <td style="padding: 0.5rem;">${book.title}</td>
                <td style="padding: 0.5rem;">${book.author}</td>
                <td style="padding: 0.5rem;">${book.category}</td>
                <td style="padding: 0.5rem;">
                    <button class="btn" style="width: auto; background: #28a745;">Edit</button>
                    <button class="btn" style="width: auto; background: #dc3545;">Delete</button>
                </td>
            </tr>
        `;
    });
    
    html += `</tbody></table>`;
    content.innerHTML = html;
}
