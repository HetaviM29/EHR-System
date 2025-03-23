// Accessing Dom elements
const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');

//Open file dialog when clicking on drop area
dropArea.addEventListener('click',()=>{
    fileInput.click();
})

//Handling drag and drop events
['dragenter','dragover','dragleave','drop'].forEach(eventname=>{
    dropArea.addEventListener(eventname,preventDefaults,false);
});

function preventDefaults(e){
    e.preventDefault();
    e.stopPropagation();
}

//visual feedback when dragging files
['dragenter','dragover'].forEach(eventname =>{
    dropArea.addEventListener(eventname,highlight,false);
})

['dragleave','drag'].forEach(eventname=>{
    dropArea.addEventListener(eventname,unhighlight,false);
})

function highlight(){
    dropArea.style.borderColor = '#3498db';
    dropArea.style.backgroundColor= '#e6f7ff';
}

function unhighlight(){
    dropArea.style.borderColor = '#ccc';
    dropArea.style.backgroundColor = '#f8f9fa';
}

//handle dropped files
dropArea.addEventListener('drop',handleDrop,false);

function handleDrop(e){
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

fileInput.addEventListener('change',function(){
    handleFiles(this.files);
})

function handleFiles(files){
    //display selected files
    const fileList = document.querySelector('.file-list');

    //clear exisiting list(for demo)
    fileList.innerHTML= ' ';

    //add new files to list
    for(let i=0; i<files.length; i++){
        const li = document.createElement('li');
        li.textContent = `• ${files[i].name}`;
        fileList.appendChild(li);
    }
}

//handle upload button click
uploadBtn.addEventListener('click',function(){
    document.querySelector('form').submit();
})

//Add click handlers for sidebar navigation
document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', function() {
        // Remove active class from current active item
        document.querySelector('.sidebar-item.active').classList.remove('active');
        // Add active class to clicked item
        this.classList.add('active');
    });
});