document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.querySelector('.toggle-password');
    const loginBtn = document.querySelector('.login-btn');

    // Toggle password visibility
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            // Toggle password visibility
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle icon
            togglePassword.classList.toggle('fa-eye');
            togglePassword.classList.toggle('fa-eye-slash');
        });
    }

    // Form validation
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            
            // Remove any existing error messages
            document.querySelectorAll('.error-message').forEach(el => el.remove());
            
            // Validate username
            if (username === '') {
                showError(usernameInput, 'Username or email is required');
                isValid = false;
            }
            
            // Validate password
            if (password === '') {
                showError(passwordInput, 'Password is required');
                isValid = false;
            } else if (password.length < 6) {
                showError(passwordInput, 'Password must be at least 6 characters');
                isValid = false;
            }
            
            if (isValid) {
                // Show loading state
                loginBtn.disabled = true;
                loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
                
                // Simulate API call with timeout
                setTimeout(() => {
                    // In a real app, you would make an API call here
                    // For demo purposes, we'll just show a success message
                    showSuccess();
                    
                    // Reset form
                    loginForm.reset();
                    loginBtn.disabled = false;
                    loginBtn.textContent = 'Login';
                }, 1500);
            }
        });
    }

    // Helper function to show error message
    function showError(inputElement, message) {
        const parentElement = inputElement.parentElement;
        const errorMessage = document.createElement('p');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        errorMessage.style.color = 'var(--error-color)';
        errorMessage.style.fontSize = '12px';
        errorMessage.style.marginTop = '5px';
        parentElement.appendChild(errorMessage);
        
        // Add error styling to input
        inputElement.style.borderColor = 'var(--error-color)';
        
        // Remove error styling on input change
        inputElement.addEventListener('input', () => {
            inputElement.style.borderColor = '';
            const errorMsg = parentElement.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        }, { once: true });
    }
    
    // Helper function to show success message
    function showSuccess() {
        // Create success message element
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Login successful!';
        successMessage.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
        successMessage.style.color = 'var(--success-color)';
        successMessage.style.padding = '10px';
        successMessage.style.borderRadius = '8px';
        successMessage.style.textAlign = 'center';
        successMessage.style.marginBottom = '20px';
        successMessage.style.display = 'flex';
        successMessage.style.alignItems = 'center';
        successMessage.style.justifyContent = 'center';
        successMessage.style.gap = '10px';
        
        // Add success message to the DOM
        const formElement = document.getElementById('login-form');
        formElement.prepend(successMessage);
        
        // Remove success message after a delay
        setTimeout(() => {
            successMessage.style.opacity = '0';
            successMessage.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                successMessage.remove();
            }, 500);
        }, 3000);
    }
});

// Add smooth animation for the login card
window.addEventListener('load', () => {
    const loginCard = document.querySelector('.login-card');
    if (loginCard) {
        loginCard.style.opacity = '0';
        loginCard.style.transform = 'translateY(20px)';
        loginCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            loginCard.style.opacity = '1';
            loginCard.style.transform = 'translateY(0)';
        }, 100);
    }
});

// Handle social media login buttons
document.addEventListener('DOMContentLoaded', () => {
    // Get all social buttons
    const socialButtons = document.querySelectorAll('.social-btn');
    
    // Add click event to each social button
    socialButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the class name to identify which social media was clicked
            const socialType = Array.from(button.classList)
                .find(className => ['google', 'facebook', 'apple', 'twitter'].includes(className));
            
            // Show loading state on the button
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            button.style.pointerEvents = 'none';
            
            // Display which social login was selected (for demonstration)
            console.log(`Logging in with ${socialType}...`);
            
            // Simulate API call with timeout
            setTimeout(() => {
                // Reset button
                button.innerHTML = originalHTML;
                button.style.pointerEvents = 'auto';
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `<i class="fas fa-check-circle"></i> ${socialType.charAt(0).toUpperCase() + socialType.slice(1)} login successful!`;
                successMessage.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
                successMessage.style.color = 'var(--success-color)';
                successMessage.style.padding = '10px';
                successMessage.style.borderRadius = '8px';
                successMessage.style.textAlign = 'center';
                successMessage.style.marginBottom = '20px';
                successMessage.style.display = 'flex';
                successMessage.style.alignItems = 'center';
                successMessage.style.justifyContent = 'center';