export class RegisterPage {
  constructor() {
    this.userImage = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupTheme();
  }

  setupTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
  }

  setupEventListeners() {
    const form = document.getElementById('registerForm');
    const profileInput = document.getElementById('profile-image-input');
    const profilePreview = document.getElementById('profile-preview');

    // Profile image upload
    profileInput.addEventListener('change', (e) => {
      this.handleImageUpload(e);
    });

    // Realtime validation
    const inputs = [
      'firstname', 'lastname', 'email', 'username', 
      'password', 'confirm-password'
    ];
    
    inputs.forEach(inputId => {
      const input = document.getElementById(inputId);
      if (input) {
        input.addEventListener('input', () => this.validateField(inputId));
      }
    });

    // Form submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleRegistration();
    });

    // Enter key to submit
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        const focused = document.activeElement;
        if (focused.tagName === 'INPUT' || focused.tagName === 'TEXTAREA') {
          e.preventDefault();
          this.handleRegistration();
        }
      }
    });
  }

  handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      // Validate file
      if (!file.type.match('image.*')) {
        this.showNotification('Please select an image file', 'error');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.showNotification('Image must be less than 5MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.userImage = e.target.result;
        document.getElementById('profile-preview').src = this.userImage;
        this.showNotification('Profile image uploaded successfully', 'success');
      };
      reader.readAsDataURL(file);
    }
  }

  validateField(fieldId) {
    const input = document.getElementById(fieldId);
    const value = input.value.trim();
    const errorElement = document.getElementById(`${fieldId}-error`);

    switch(fieldId) {
      case 'firstname':
      case 'lastname':
        if (!value) {
          this.showError(input, errorElement, `${this.capitalize(fieldId)} is required`);
          return false;
        }
        break;

      case 'email':
        if (!value) {
          this.showError(input, errorElement, 'Email is required');
          return false;
        }
        if (!this.isValidEmail(value)) {
          this.showError(input, errorElement, 'Please enter a valid email');
          return false;
        }
        break;

      case 'username':
        if (!value) {
          this.showError(input, errorElement, 'Username is required');
          return false;
        }
        if (value.length < 3) {
          this.showError(input, errorElement, 'Username must be at least 3 characters');
          return false;
        }
        break;

      case 'password':
        if (!value) {
          this.showError(input, errorElement, 'Password is required');
          return false;
        }
        if (value.length < 6) {
          this.showError(input, errorElement, 'Password must be at least 6 characters');
          return false;
        }
        break;

      case 'confirm-password':
        const password = document.getElementById('password').value;
        if (value !== password) {
          this.showError(input, errorElement, 'Passwords do not match');
          return false;
        }
        break;
    }

    this.clearError(input, errorElement);
    return true;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  showError(input, errorElement, message) {
    input.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
  }

  clearError(input, errorElement) {
    input.classList.remove('error');
    errorElement.classList.remove('show');
  }

  async handleRegistration() {
    // Validate all fields
    const fields = [
      'firstname', 'lastname', 'email', 'username', 
      'password', 'confirm-password'
    ];
    
    let isValid = true;
    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      this.showNotification('Please fix the errors in the form', 'error');
      return;
    }

    // Collect form data
    const userData = {
      firstname: document.getElementById('firstname').value.trim(),
      lastname: document.getElementById('lastname').value.trim(),
      email: document.getElementById('email').value.trim(),
      username: document.getElementById('username').value.trim(),
      password: document.getElementById('password').value,
      bio: document.getElementById('bio').value.trim(),
      location: document.getElementById('location').value.trim(),
      image: this.userImage || this.generateDefaultAvatar(),
      joinedDate: new Date().toISOString().split('T')[0],
      isActive: true
    };

    // Show loading
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating Account...';

    try {
      // Save user to localStorage
      await this.saveUser(userData);
      
      // Auto-login the user
      this.autoLogin(userData);
      
      this.showNotification('Account created successfully! Welcome to NexaNext!', 'success');
      
      // Redirect to profile
      setTimeout(() => {
        window.location.href = `profile.html?id=self`;
      }, 2000);
      
    } catch (error) {
      this.showNotification(error.message, 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Account';
    }
  }

  generateDefaultAvatar() {
    const username = document.getElementById('username').value.trim();
    // Use DiceBear API for a nice default avatar
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}&backgroundColor=65c9ff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
  }

  async saveUser(userData) {
    // Get existing users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem('nexanext_users') || '[]');
    
    // Check if email already exists
    const emailExists = existingUsers.some(user => user.email === userData.email);
    if (emailExists) {
      throw new Error('An account with this email already exists');
    }
    
    // Check if username already exists
    const usernameExists = existingUsers.some(user => user.username === userData.username);
    if (usernameExists) {
      throw new Error('Username is already taken');
    }
    
    // Generate a unique ID
    userData.id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Don't store password in plain text (in a real app, this would be hashed)
    const userToSave = { ...userData };
    delete userToSave.password; // Remove password from saved data
    
    // Add to users list
    existingUsers.push(userToSave);
    localStorage.setItem('nexanext_users', JSON.stringify(existingUsers));
    
    return userData;
  }

  autoLogin(userData) {
    // Set login session
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUserId', userData.id);
    localStorage.setItem('currentUserEmail', userData.email);
    localStorage.setItem('currentUserName', `${userData.firstname} ${userData.lastname}`);
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 24px;
      border-radius: 8px;
      background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      z-index: 10000;
      animation: slideInRight 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease forwards';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    if (!document.querySelector('#notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// Start registration page
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new RegisterPage();
  });
} else {
  new RegisterPage();
}