document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const usernameError = document.getElementById('username-error');
    const passwordError = document.getElementById('password-error');
    const togglePassword = document.querySelector('.toggle-password');
    const socialButtons = document.querySelectorAll('.social-btn');
    
    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle icon
        const icon = togglePassword.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });
    
    // Form validation
    function validateUsername(username) {
        if (!username) {
            return 'Username or email is required';
        }
        
        // Simple email validation
        if (username.includes('@')) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(username)) {
                return 'Please enter a valid email address';
            }
        } else {
            if (username.length < 3) {
                return 'Username must be at least 3 characters';
            }
        }
        
        return '';
    }
    
    function validatePassword(password) {
        if (!password) {
            return 'Password is required';
        }
        
        if (password.length < 6) {
            return 'Password must be at least 6 characters';
        }
        
        return '';
    }
    
    // Real-time validation for username
    usernameInput.addEventListener('input', () => {
        const error = validateUsername(usernameInput.value.trim());
        usernameError.textContent = error;
        
        const inputGroup = usernameInput.parentElement;
        if (error) {
            inputGroup.classList.add('invalid-input');
            inputGroup.classList.remove('valid-input');
        } else if (usernameInput.value.trim()) {
            inputGroup.classList.add('valid-input');
            inputGroup.classList.remove('invalid-input');
        } else {
            inputGroup.classList.remove('valid-input', 'invalid-input');
        }
    });
    
    // Real-time validation for password
    passwordInput.addEventListener('input', () => {
        const error = validatePassword(passwordInput.value);
        passwordError.textContent = error;
        
        const inputGroup = passwordInput.parentElement;
        if (error) {
            inputGroup.classList.add('invalid-input');
            inputGroup.classList.remove('valid-input');
        } else if (passwordInput.value) {
            inputGroup.classList.add('valid-input');
            inputGroup.classList.remove('invalid-input');
        } else {
            inputGroup.classList.remove('valid-input', 'invalid-input');
        }
    });
    
    // Form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        
        // Validate inputs
        const usernameError = validateUsername(username);
        const passwordError = validatePassword(password);
        
        // Show validation errors
        document.getElementById('username-error').textContent = usernameError;
        document.getElementById('password-error').textContent = passwordError;
        
        // Update input styles
        const usernameGroup = usernameInput.parentElement;
        const passwordGroup = passwordInput.parentElement;
        
        if (usernameError) {
            usernameGroup.classList.add('invalid-input');
            usernameGroup.classList.remove('valid-input');
        } else {
            usernameGroup.classList.add('valid-input');
            usernameGroup.classList.remove('invalid-input');
        }
        
        if (passwordError) {
            passwordGroup.classList.add('invalid-input');
            passwordGroup.classList.remove('valid-input');
        } else {
            passwordGroup.classList.add('valid-input');
            passwordGroup.classList.remove('invalid-input');
        }
        
        // If no errors, proceed with login
        if (!usernameError && !passwordError) {
            // Here you would normally send the data to your server
            // For demonstration, we'll show a success message in the console
            console.log('Login successful!');
            console.log('Username:', username);
            console.log('Password:', '*'.repeat(password.length));
            console.log('Remember me:', document.getElementById('remember').checked);
            
            // Simulate successful login with animation
            const loginBtn = document.querySelector('.login-btn');
            loginBtn.textContent = 'Logging in...';
            
            // Simulate API call
            setTimeout(() => {
                // Reset form
                loginBtn.textContent = 'Login Successful!';
                loginBtn.style.backgroundColor = 'var(--success-color)';
                
                // Redirect after successful login (demo)
                setTimeout(() => {
                    alert('Login Successful! In a real application, you would be redirected to the dashboard.');
                    loginForm.reset();
                    loginBtn.textContent = 'Login';
                    loginBtn.style.backgroundColor = '';
                    document.querySelectorAll('.input-group').forEach(group => {
                        group.classList.remove('valid-input', 'invalid-input');
                    });
                }, 1500);
            }, 1500);
        }
    });
    
    // Social login buttons
    socialButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const provider = button.classList.contains('google') ? 'Google' : 'Facebook';
            alert(`${provider} login would be implemented here. This would redirect to the ${provider} authentication page.`);
        });
    });
});
