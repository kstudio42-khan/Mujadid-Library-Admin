async function fetchBooks() {
    const token = sessionStorage.getItem('token');
    const content = document.querySelector('.content');
    
    showSpinner(true);

    try {
        const response = await fetch(`${CONFIG.API_URL}/book`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.status === 401) {
            sessionStorage.removeItem('token');
            window.location.href = 'index.html';
            return;
        }
        
        const books = await response.json();
        renderBooks(books);
    } catch (e) {
        showNotification('Failed to load books.', 'error');
    } finally {
        showSpinner(false);
    }
}

function renderBooks(books) {
    const content = document.querySelector('.content');
    
    if (books.length === 0) {
        content.innerHTML = '<h2>Books</h2><p>No books found.</p><button class="btn" onclick="openModal()">Add Book</button>';
        return;
    }

    let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h2>Books</h2>
            <button class="btn" style="width: auto;" onclick="openModal()">Add Book</button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    books.forEach(book => {
        html += `
            <tr>
                <td><img src="${book.coverImage ? `${CONFIG.API_URL.replace('/api', '')}/${book.coverImage}` : 'placeholder.png'}" alt="Cover" style="width: 50px;"></td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.category}</td>
                <td>
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
    
    // Reset inputs
    document.getElementById('bookCover').value = '';
    document.getElementById('bookPdf').value = '';
    
    document.getElementById('bookModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('bookModal').style.display = 'none';
}

// Image preview
document.getElementById('bookCover').onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Can add preview element here if desired
        };
        reader.readAsDataURL(file);
    }
};

// Form submission
document.getElementById('bookForm').onsubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');
    const id = document.getElementById('bookId').value;
    const saveBtn = e.target.querySelector('button[type="submit"]');
    
    const formData = new FormData();
    formData.append('title', document.getElementById('bookTitle').value);
    formData.append('author', document.getElementById('bookAuthor').value);
    formData.append('category', document.getElementById('bookCategory').value);
    
    const coverFile = document.getElementById('bookCover').files[0];
    if (coverFile) formData.append('coverImage', coverFile);
    
    const pdfFile = document.getElementById('bookPdf').files[0];
    if (pdfFile) formData.append('pdfFile', pdfFile);

    saveBtn.disabled = true;
    showSpinner(true);

    try {
        const url = id ? `${CONFIG.API_URL}/book/${id}` : `${CONFIG.API_URL}/book`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        
        if (response.ok) {
            showNotification('Book saved successfully.');
            closeModal();
            fetchBooks();
        } else {
            showNotification('Failed to save book.', 'error');
        }
    } catch (e) {
        showNotification('Network error.', 'error');
    } finally {
        saveBtn.disabled = false;
        showSpinner(false);
    }
};

// Delete
async function deleteBook(id) {
    if (!confirm('Are you sure you want to delete this book?')) return;
    const token = sessionStorage.getItem('token');
    showSpinner(true);
    try {
        const response = await fetch(`${CONFIG.API_URL}/book/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            showNotification('Book deleted.');
            fetchBooks();
        } else {
            showNotification('Failed to delete.', 'error');
        }
    } catch (e) {
        showNotification('Network error.', 'error');
    } finally {
        showSpinner(false);
    }
}

// Edit handler
function editBook(id, title, author, category) {
    openModal(id, title, author, category);
}

