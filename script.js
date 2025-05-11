/**
 * Login Page JavaScript
 * Enhanced with modern JS features, better validation, and improved UX
 */

// Use IIFE to avoid polluting global namespace
(() => {
  // DOM Elements using destructuring for cleaner code
  const elements = {
    form: document.getElementById('login-form'),
    username: document.getElementById('username'),
    password: document.getElementById('password'),
    usernameError: document.getElementById('username-error'),
    passwordError: document.getElementById('password-error'),
    togglePassword: document.querySelector('.toggle-password'),
    socialButtons: document.querySelectorAll('.social-btn'),
    loginBtn: document.querySelector('.login-btn'),
    rememberMe: document.getElementById('remember')
  };

  // Constants
  const VALIDATION = {
    MIN_USERNAME_LENGTH: 3,
    MIN_PASSWORD_LENGTH: 6
  };
  
  /**
   * Initialize the application when DOM is fully loaded
   */
  const init = () => {
    // Check for stored username from previous sessions
    checkRememberedUser();
    
    // Set up event listeners
    setupEventListeners();
  };

  /**
   * Check local storage for remembered username and populate field
   */
  const checkRememberedUser = () => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      elements.username.value = rememberedUser;
      elements.rememberMe.checked = true;
    }
  };

  /**
   * Set up all event listeners
   */
  const setupEventListeners = () => {
    // Toggle password visibility
    elements.togglePassword.addEventListener('click', togglePasswordVisibility);
    
    // Form inputs validation with debounce
    elements.username.addEventListener('input', debounce(event => {
      validateField(event.target, validateUsername);
    }, 300));
    
    elements.password.addEventListener('input', debounce(event => {
      validateField(event.target, validatePassword);
      updatePasswordStrength(event.target.value);
    }, 300));
    
    // Form submission
    elements.form.addEventListener('submit', handleFormSubmit);
    
    // Social login buttons
    elements.socialButtons.forEach(button => {
      button.addEventListener('click', handleSocialLogin);
    });
  };

  /**
   * Toggle password field visibility
   */
  const togglePasswordVisibility = () => {
    const type = elements.password.getAttribute('type') === 'password' ? 'text' : 'password';
    elements.password.setAttribute('type', type);
    
    // Toggle icon with animation
    const icon = elements.togglePassword.querySelector('i');
    icon.style.transform = 'scale(0)';
    
    setTimeout(() => {
      icon.classList.toggle('fa-eye');
      icon.classList.toggle('fa-eye-slash');
      icon.style.transform = 'scale(1)';
    }, 150);
  };

  /**
   * Username validation with comprehensive checks
   */
  const validateUsername = (username) => {
    if (!username) {
      return 'Username or email is required';
    }
    
    // Email validation with improved regex
    if (username.includes('@')) {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(username)) {
        return 'Please enter a valid email address';
      }
    } else {
      if (username.length < VALIDATION.MIN_USERNAME_LENGTH) {
        return `Username must be at least ${VALIDATION.MIN_USERNAME_LENGTH} characters`;
      }
      
      // Additional validation: no special characters in username
      const usernamePattern = /^[a-zA-Z0-9_]+$/;
      if (!usernamePattern.test(username)) {
        return 'Username should only contain letters, numbers and underscores';
      }
    }
    
    return '';
  };

  /**
   * Password validation with improved checks
   */
  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    
    if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`;
    }
    
    return '';
  };

  /**
   * Update input field validation status
   */
  const validateField = (input, validationFunction) => {
    const value = input.value.trim();
    const errorElement = document.getElementById(`${input.id}-error`);
    const error = validationFunction(value);
    errorElement.textContent = error;
    
    const inputGroup = input.parentElement;
    if (error) {
      inputGroup.classList.add('invalid-input');
      inputGroup.classList.remove('valid-input');
      
      // Add shake animation to invalid input
      inputGroup.classList.add('shake-animation');
      setTimeout(() => inputGroup.classList.remove('shake-animation'), 500);
    } else if (value) {
      inputGroup.classList.add('valid-input');
      inputGroup.classList.remove('invalid-input');
    } else {
      inputGroup.classList.remove('valid-input', 'invalid-input');
    }
    
    return error === '';
  };

  /**
   * Form submission handler with improved UX feedback
   */
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    const username = elements.username.value.trim();
    const password = elements.password.value;
    
    // Validate all fields
    const isUsernameValid = validateField(elements.username, validateUsername);
    const isPasswordValid = validateField(elements.password, validatePassword);
    
    // Process form if valid
    if (isUsernameValid && isPasswordValid) {
      processLogin(username, password);
    }
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    elements.form.reset();
    elements.loginBtn.innerHTML = 'Login';
    elements.loginBtn.style.backgroundColor = '';
    elements.loginBtn.disabled = false;
    elements.form.classList.remove('success-animation');
    
    document.querySelectorAll('.input-group').forEach(group => {
      group.classList.remove('valid-input', 'invalid-input');
    });
  };

  /**
   * Handle social login buttons
   */
  const handleSocialLogin = (e) => {
    const provider = e.currentTarget.classList.contains('google') ? 'Google' : 'Facebook';
    
    // Add click animation
    e.currentTarget.classList.add('button-pressed');
    setTimeout(() => e.currentTarget.classList.remove('button-pressed'), 200);
    
    // Show loading state
    const originalContent = e.currentTarget.innerHTML;
    e.currentTarget.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Connecting...`;
    
    // Simulate delay
    setTimeout(() => {
      e.currentTarget.innerHTML = originalContent;
      alert(`${provider} login would be implemented here. This would redirect to the ${provider} authentication page.`);
    }, 1000);
  };

  /**
   * Simulate API call with promise
   */
  const simulateApiCall = (credentials) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Demo only: 90% success rate for testing
        if (Math.random() < 0.9) {
          resolve({
            success: true,
            user: { 
              username: credentials.username,
              // Never log actual passwords
              // Just showing masked password for demonstration
              passwordLength: credentials.password.length
            }
          });
          console.log('Login successful!');
          console.log('Username:', credentials.username);
          console.log('Password:', '*'.repeat(credentials.password.length));
        } else {
          reject(new Error('Invalid credentials. Please try again.'));
        }
      }, 1500);
    });
  };

  /**
   * Add password strength meter
   */
  const updatePasswordStrength = (password) => {
    // Only create strength meter if it doesn't exist
    let strengthMeter = document.querySelector('.password-strength');
    if (!strengthMeter) {
      strengthMeter = document.createElement('div');
      strengthMeter.className = 'password-strength';
      
      const meterBar = document.createElement('div');
      meterBar.className = 'strength-bar';
      
      const meterText = document.createElement('span');
      meterText.className = 'strength-text';
      
      strengthMeter.appendChild(meterBar);
      strengthMeter.appendChild(meterText);
      
      // Insert after error message
      const passwordError = document.getElementById('password-error');
      passwordError.parentNode.insertBefore(strengthMeter, passwordError.nextSibling);
    }
    
    // Calculate password strength
    const strength = calculatePasswordStrength(password);
    const meterBar = strengthMeter.querySelector('.strength-bar');
    const meterText = strengthMeter.querySelector('.strength-text');
    
    // Update width and color based on strength
    meterBar.style.width = `${strength.score * 25}%`;
    meterBar.className = `strength-bar ${strength.class}`;
    meterText.textContent = strength.text;
    
    // Hide strength meter if password is empty
    strengthMeter.style.display = password ? 'block' : 'none';
  };

  /**
   * Calculate password strength
   */
  const calculatePasswordStrength = (password) => {
    if (!password) {
      return { score: 0, text: '', class: '' };
    }
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Ensure max score of 4
    score = Math.min(Math.floor(score / 2), 4);
    
    const strengthClasses = ['very-weak', 'weak', 'medium', 'strong', 'very-strong'];
    const strengthTexts = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
    
    return {
      score,
      text: strengthTexts[score],
      class: strengthClasses[score]
    };
  };

  /**
   * Debounce function to limit how often a function is called
   */
  const debounce = (func, delay) => {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  // Start the application when DOM is loaded
  document.addEventListener('DOMContentLoaded', init);
})();
