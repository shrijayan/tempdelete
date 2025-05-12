// Login Form Validation

document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.querySelector('.toggle-password');
    
    // Toggle password visibility
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Change eye icon
            const eyeIcon = this.querySelector('i');
            eyeIcon.classList.toggle('fa-eye');
            eyeIcon.classList.toggle('fa-eye-slash');
        });
    }
    
    // Form validation
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        let isValid = true;
        const errors = [];
        
        // Validate username
        if (usernameInput.value.trim() === '') {
            isValid = false;
            errors.push('Username or Email is required');
            usernameInput.classList.add('error');
        } else {
            usernameInput.classList.remove('error');
        }
        
        // Validate password
        if (passwordInput.value === '') {
            isValid = false;
            errors.push('Password is required');
            passwordInput.classList.add('error');
        } else if (passwordInput.value.length < 6) {
            isValid = false;
            errors.push('Password must be at least 6 characters');
            passwordInput.classList.add('error');
        } else {
            passwordInput.classList.remove('error');
        }
        
        // If form is valid, submit
        if (isValid) {
            // In a real application, you would submit the form to the server here
            console.log('Form submitted successfully');
            console.log({
                username: usernameInput.value,
                password: passwordInput.value,
                remember: document.getElementById('remember').checked
            });
            
            // Display success message (for demo purposes)
            alert('Login successful! (This is a demo message)');
        } else {
            // Display errors
            console.error('Form validation failed', errors);
            alert('Please correct the following errors:\n' + errors.join('\n'));
        }
    });
    
    // Social login buttons (for demonstration only)
    const socialButtons = document.querySelectorAll('.social-button');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
            alert(`${provider} login integration would happen here. This is just a demo.`);
        });
    });
});

// Add error styling
document.head.insertAdjacentHTML('beforeend', `
    <style>
    input.error {
        border-color: #ff3860 !important;
        background-color: #ffF5F7;
    }
    </style>
`);
