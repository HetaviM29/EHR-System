// Get DOM elements
const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');

// Open file dialog when clicking on drop area
dropArea.addEventListener('click', () => {
    fileInput.click();
});

// Handle drag and drop events
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight() {
    dropArea.style.borderColor = '#3498db';
    dropArea.style.backgroundColor = '#e6f7ff';
}

function unhighlight() {
    dropArea.style.borderColor = '#ccc';
    dropArea.style.backgroundColor = '#f8f9fa';
}

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

fileInput.addEventListener('change', function() {
    handleFiles(this.files);
});

function handleFiles(files) {
    // Display selected files (in a real app, you would upload these)
    const fileList = document.querySelector('.file-list');
    
    // Clear existing list only in this demo (you'd likely append in real app)
    fileList.innerHTML = '';
    
    for (let i = 0; i < files.length; i++) {
        const li = document.createElement('li');
        li.textContent = `• ${files[i].name}`;
        fileList.appendChild(li);
    }
    
    // Add upload success message (just for demo)
    uploadBtn.addEventListener('click', function() {
        alert('Files ready to upload!'); 
        // In a real application, you would use fetch() or XMLHttpRequest to upload files
    });
}

// Add click handlers for sidebar navigation
document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelector('.sidebar-item.active').classList.remove('active');
        this.classList.add('active');
    });
});
