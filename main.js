import './carousel.js';

// --- 1. PLAN SELECTION & FORM FOCUS ---
document.querySelectorAll('a[data-plan]').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const planInput = document.getElementById('plan');
    if (planInput) {
      planInput.value = btn.dataset.plan;
      // Keep floating label up by triggering the change event
      planInput.dispatchEvent(new Event('change'));
    }
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    // Focus the message field after the scroll finishes
    setTimeout(() => document.getElementById('message').focus(), 600);
  });
});

// --- 2. FORM UI HELPERS ---
// Handle the 'has-value' class for CSS floating labels
const planSelect = document.getElementById('plan');
if (planSelect) {
  planSelect.addEventListener('change', () => {
    if (planSelect.value) {
      planSelect.classList.add('has-value');
    } else {
      planSelect.classList.remove('has-value');
    }
  });
}
