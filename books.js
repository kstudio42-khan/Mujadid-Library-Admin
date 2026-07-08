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
            <button class="btn" style="width: auto;" onclick="openModal()">Add Book</button>
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
                <td style="padding: 0.5rem;"><img src="${book.coverImage ? `${CONFIG.API_URL.replace('/api', '')}/${book.coverImage}` : 'placeholder.png'}" alt="Cover" style="width: 50px;"></td>
                <td style="padding: 0.5rem;">${book.title}</td>
                <td style="padding: 0.5rem;">${book.author}</td>
                <td style="padding: 0.5rem;">${book.category}</td>
                <td style="padding: 0.5rem;">
                    <button class="btn" style="width: auto; background: #28a745;" onclick="editBook('${book._id}', '${book.title}', '${book.author}', '${book.category}')">Edit</button>
                    <button class="btn" style="width: auto; background: #dc3545;" onclick="deleteBook('${book._id}')">Delete</button>
                </td>
            </tr>
        `;
    });
    
    html += `</tbody></table>`;
    content.innerHTML = html;
}

// Modal management
function openModal(id = '', title = '', author = '', category = '') {
    document.getElementById('modalTitle').innerText = id ? 'Edit Book' : 'Add Book';
    document.getElementById('bookId').value = id;
    document.getElementById('bookTitle').value = title;
    document.getElementById('bookAuthor').value = author;
    document.getElementById('bookCategory').value = category;
    document.getElementById('bookModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('bookModal').style.display = 'none';
}

// Form submission
document.getElementById('bookForm').onsubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');
    const id = document.getElementById('bookId').value;
    const formData = new FormData();
    formData.append('title', document.getElementById('bookTitle').value);
    formData.append('author', document.getElementById('bookAuthor').value);
    formData.append('category', document.getElementById('bookCategory').value);
    
    const coverFile = document.getElementById('bookCover').files[0];
    if (coverFile) formData.append('coverImage', coverFile);
    
    const pdfFile = document.getElementById('bookPdf').files[0];
    if (pdfFile) formData.append('pdfFile', pdfFile);

    try {
        const url = id ? `${CONFIG.API_URL}/book/${id}` : `${CONFIG.API_URL}/book`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        
        if (response.ok) {
            closeModal();
            fetchBooks();
        } else {
            alert('Failed to save book');
        }
    } catch (e) {
        alert('Network error');
    }
};

// Delete
async function deleteBook(id) {
    if (!confirm('Are you sure?')) return;
    const token = sessionStorage.getItem('token');
    try {
        const response = await fetch(`${CONFIG.API_URL}/book/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) fetchBooks();
        else alert('Failed to delete');
    } catch (e) {
        alert('Network error');
    }
}

// Edit handler
function editBook(id, title, author, category) {
    openModal(id, title, author, category);
}
