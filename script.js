document.addEventListener('DOMContentLoaded', function() {
    // Get the form element
    const loginForm = document.getElementById('loginForm');
    
    // Add event listener for form submission
    loginForm.addEventListener('submit', function(event) {
        // Prevent the form from submitting by default
        event.preventDefault();
        
        // Get form inputs
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        // Reset any existing error messages
        clearErrors();
        
        // Validate inputs
        let isValid = true;
        
        // Validate username
        if (username === '') {
            displayError('username', 'Username cannot be empty');
            isValid = false;
        } else if (username.length < 3) {
            displayError('username', 'Username must be at least 3 characters long');
            isValid = false;
        }
        
        // Validate password
        if (password === '') {
            displayError('password', 'Password cannot be empty');
            isValid = false;
        } else if (password.length < 6) {
            displayError('password', 'Password must be at least 6 characters long');
            isValid = false;
        }
        
        // If form is valid, proceed with login
        if (isValid) {
            // Here you would typically send the data to a server
            // For this example, we'll just show a success message
            showSuccessMessage();
        }
    });
    
    // Function to display error messages
    function displayError(inputId, message) {
        const inputElement = document.getElementById(inputId);
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '14px';
        errorElement.style.marginTop = '5px';
        
        // Add error styling to the input
        inputElement.style.borderColor = '#e74c3c';
        
        // Insert error message after the input
        inputElement.parentNode.appendChild(errorElement);
    }
    
    // Function to clear all error messages
    function clearErrors() {
        // Remove all error messages
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(function(errorMessage) {
            errorMessage.remove();
        });
        
        // Reset input styling
        document.getElementById('username').style.borderColor = '';
        document.getElementById('password').style.borderColor = '';
    }
    
    // Function to show success message
    function showSuccessMessage() {
        // Hide the form
        loginForm.style.display = 'none';
        
        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <h2>Login Successful!</h2>
            <p>Welcome back, ${document.getElementById('username').value}!</p>
            <button id="backToLogin">Back to Login</button>
        `;
        successMessage.style.textAlign = 'center';
        successMessage.style.padding = '20px';
        
        // Style success elements
        const h2 = successMessage.querySelector('h2');
        h2.style.color = '#27ae60';
        h2.style.marginBottom = '15px';
        
        const button = successMessage.querySelector('button');
        button.style.backgroundColor = '#4a90e2';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '10px 15px';
        button.style.borderRadius = '5px';
        button.style.marginTop = '20px';
        button.style.cursor = 'pointer';
        
        // Add event listener to the button
        button.addEventListener('click', function() {
            // Show the form again
            loginForm.style.display = 'block';
            // Clear the form
            loginForm.reset();
            // Remove the success message
            successMessage.remove();
        });
        
        // Append success message to the login form container
        document.querySelector('.login-form').appendChild(successMessage);
    }
});
