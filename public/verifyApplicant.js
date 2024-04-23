document.querySelectorAll('.cards .card').forEach(card => {
    const emailElement = card.querySelector('#email');
    const addButton = card.querySelector('#add');
    const removeButton = card.querySelector('#remove');
  
    addButton.addEventListener('click', () => {
      const email = emailElement.textContent.trim().split(':')[1];
      // Perform operations with the email address
      console.log('email:', email);
      // Example: Send email to the server
      fetch('/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email})
      })
      .then(response => {
        // Handle response from server
      })
      .catch(error => {
        console.error('Error sending email:', error);
      });
    });
  
    removeButton.addEventListener('click', () => {
      const email = emailElement.textContent.trim().split(':')[1];
      // Perform operations with the email address
      console.log('Email:', email);
      // Example: Remove email from the server
      fetch('/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })
      .then(response => {
        // Handle response from server
      })
      .catch(error => {
        console.error('Error removing email:', error);
      });
    });
  });