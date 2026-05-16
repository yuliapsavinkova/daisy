const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

async function handleSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.target);
  const button = document.getElementById('submit-btn');

  button.disabled = true;
  button.innerText = 'Sending...';

  fetch(event.target.action, {
    method: form.method,
    body: data,
    headers: { Accept: 'application/json' },
  })
    .then((response) => {
      if (response.ok) {
        form.style.display = 'none';
        status.style.display = 'block';
      } else {
        response.json().then((data) => {
          if (Object.hasOwn(data, 'errors')) {
            alert(data['errors'].map((error) => error['message']).join(', '));
          } else {
            alert('Oops! There was a problem submitting your form');
          }
          button.disabled = false;
          button.innerText = 'Send message';
        });
      }
    })
    .catch((error) => {
      alert('Oops! There was a problem submitting your form');
      button.disabled = false;
      button.innerText = 'Send message';
    });
}
form.addEventListener('submit', handleSubmit);
