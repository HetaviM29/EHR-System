document.addEventListener('DOMContentLoaded', function() {
  // Tab switching
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and contents
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      tab.classList.add('active');
      tabContents[index].classList.add('active');
    });
  });
  
  // Toggle prescription form
  const newPrescriptionBtn = document.querySelector('.card-header .btn');
  const prescriptionForm = document.getElementById('prescription-form');
  
  if (newPrescriptionBtn && prescriptionForm) {
    newPrescriptionBtn.addEventListener('click', () => {
      prescriptionForm.style.display = prescriptionForm.style.display === 'none' ? 'block' : 'none';
    });
  }
});
