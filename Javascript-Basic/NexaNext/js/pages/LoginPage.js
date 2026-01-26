export class LoginPage {
  constructor() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    const loginForm = document.getElementById('loginForm');
    const guestBtn = document.getElementById('guest-btn');
    
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }
    
    if (guestBtn) {
      guestBtn.addEventListener('click', () => {
        this.handleGuestLogin();
      });
    }
    
    document.getElementById('signup-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Sign up feature coming soon!');
    });
    
    document.getElementById('forgot-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Forgot password feature coming soon!');
    });
  }

  handleLogin() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const submitBtn = document.getElementById('submit-btn');
    
    if (!email || !password) {
      this.showMessage('Please fill in all fields', 'error');
      return;
    }
    

    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';
    

    setTimeout(() => {
      const demoUsers = [
        { email: 'demo@nexanext.com', password: 'password123', name: 'Demo User' },
        { email: 'test@nexanext.com', password: 'test123', name: 'Test User' },
        { email: 'user@example.com', password: 'user123', name: 'Example User' }
      ];
      

      const user = demoUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUserId', 'demo_' + Date.now());
        localStorage.setItem('currentUserEmail', user.email);
        localStorage.setItem('currentUserName', user.name);
        
        this.showMessage('Login successful! Redirecting...', 'success');
        
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
        
      } else {
        if (password.length >= 6) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('currentUserId', 'user_' + Date.now());
          localStorage.setItem('currentUserEmail', email);
          localStorage.setItem('currentUserName', email.split('@')[0]);
          
          this.showMessage('Login successful! Redirecting...', 'success');
          
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1500);
          
        } else {
          this.showMessage('Invalid email or password', 'error');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Sign In';
        }
      }
    }, 1000);
  }

  handleGuestLogin() {
    const guestBtn = document.getElementById('guest-btn');
    guestBtn.disabled = true;
    guestBtn.textContent = 'Entering as Guest...';
    
    localStorage.setItem('isGuest', 'true');
    localStorage.setItem('currentUserId', 'guest_' + Date.now());
    localStorage.setItem('currentUserName', 'Guest User');
    
    this.showMessage('Welcome Guest! Enjoy browsing NexaNext', 'success');
    
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  }

  showMessage(message, type = 'info') {
    const messageEl = document.createElement('div');
    messageEl.className = 'login-message';
    messageEl.textContent = message;
    messageEl.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      background: ${type === 'success' ? '#10b981' : '#ef4444'};
      color: white;
      z-index: 1000;
      animation: slideIn 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    `;
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
      messageEl.style.animation = 'slideOut 0.3s ease forwards';
      setTimeout(() => messageEl.remove(), 300);
    }, 3000);
    

    if (!document.querySelector('#login-animations')) {
      const style = document.createElement('style');
      style.id = 'login-animations';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new LoginPage();
  });
} else {
  new LoginPage();
}