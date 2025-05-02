document.getElementById('login-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('error-message');
  errorMessage.textContent = '';

  if (!email || !password) {
    errorMessage.textContent = 'Please enter both email and password.';
    return;
  }

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (email === 'bansh@6809' && password === 'password') {
      window.location.href = 'searchpage.html';
    }
    
    else {
      errorMessage.textContent = data.message || 'Login failed.';
    }
  } catch (error) {
    errorMessage.textContent = 'An error occurred. Please try again later.';
  }
});
