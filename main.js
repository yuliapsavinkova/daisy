document.querySelectorAll('a[data-plan]').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('plan').value = btn.dataset.plan;
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => document.getElementById('message').focus(), 600);
  });
});
