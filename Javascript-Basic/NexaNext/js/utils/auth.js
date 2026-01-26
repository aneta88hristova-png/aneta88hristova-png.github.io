export class Auth {

  static checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const isGuest = localStorage.getItem('isGuest') === 'true';
    const currentPage = window.location.pathname.split('/').pop();
    
    const publicPages = ['login.html', 'register.html', ''];
    
    if (!isLoggedIn && !isGuest && !publicPages.includes(currentPage)) {
      window.location.href = 'login.html';
      return false;
    }
    
    return true;
  }
  
  static getCurrentUser() {
    const userId = localStorage.getItem('currentUserId');
    
    if (!userId) {
      return null;
    }

    if (userId.startsWith('user_')) {
      const savedUsers = JSON.parse(localStorage.getItem('nexanext_users') || '[]');
      const user = savedUsers.find(u => u.id === userId);
      
      if (user) {
        return {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
          image: user.image,
          bio: user.bio,
          location: user.location,
          isSelfRegistered: true
        };
      }
    }
    

    return {
      id: userId,
      email: localStorage.getItem('currentUserEmail'),
      name: localStorage.getItem('currentUserName'),
      isSelfRegistered: false
    };
  }
  
  // Logga in
  static login(email, password, rememberMe = false) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const savedUsers = JSON.parse(localStorage.getItem('nexanext_users') || '[]');
        const user = savedUsers.find(u => u.email === email);
        
        if (user) {

          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('currentUserId', user.id);
          localStorage.setItem('currentUserEmail', user.email);
          localStorage.setItem('currentUserName', `${user.firstname} ${user.lastname}`);
          
          if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
          }
          
          resolve({
            success: true,
            user: user
          });
          return;
        }
        
        const demoUsers = [
          { email: 'demo@nexanext.com', password: 'password123', id: 'demo_1', firstname: 'Demo', lastname: 'User' },
          { email: 'test@nexanext.com', password: 'test123', id: 'demo_2', firstname: 'Test', lastname: 'User' },
          { email: 'admin@nexanext.com', password: 'admin123', id: 'demo_3', firstname: 'Admin', lastname: 'User' }
        ];
        
        const demoUser = demoUsers.find(u => u.email === email && u.password === password);
        
        if (demoUser) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('currentUserId', demoUser.id);
          localStorage.setItem('currentUserEmail', demoUser.email);
          localStorage.setItem('currentUserName', `${demoUser.firstname} ${demoUser.lastname}`);
          
          if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
          }
          
          resolve({
            success: true,
            user: demoUser,
            isDemo: true
          });
          return;
        }
        
        reject(new Error('Invalid email or password'));
      }, 1000); 
    });
  }
  
  static loginAsGuest() {
    localStorage.setItem('isGuest', 'true');
    localStorage.setItem('currentUserId', 'guest_' + Date.now());
    localStorage.setItem('currentUserName', 'Guest User');
    
    return {
      success: true,
      isGuest: true
    };
  }
  
  static register(userData) {
    return new Promise((resolve, reject) => {
   
      const existingUsers = JSON.parse(localStorage.getItem('nexanext_users') || '[]');
      const emailExists = existingUsers.some(user => user.email === userData.email);
      
      if (emailExists) {
        reject(new Error('An account with this email already exists'));
        return;
      }
      
      const usernameExists = existingUsers.some(user => user.username === userData.username);
      
      if (usernameExists) {
        reject(new Error('Username is already taken'));
        return;
      }
      

      const newUser = {
        id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        username: userData.username,
        image: userData.image || this.generateDefaultAvatar(userData.username),
        bio: userData.bio || '',
        location: userData.location || '',
        joinedDate: new Date().toISOString().split('T')[0],
        isActive: true,
        createdAt: new Date().toISOString()
      };
      
      existingUsers.push(newUser);
      localStorage.setItem('nexanext_users', JSON.stringify(existingUsers));
      
  
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUserId', newUser.id);
      localStorage.setItem('currentUserEmail', newUser.email);
      localStorage.setItem('currentUserName', `${newUser.firstname} ${newUser.lastname}`);
      
      resolve({
        success: true,
        user: newUser
      });
    });
  }
  
  static generateDefaultAvatar(username) {
    const colors = ['65c9ff', 'b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}&backgroundColor=${randomColor}`;
  }
  

  static logout() {
    const theme = localStorage.getItem('theme');
    const rememberMe = localStorage.getItem('rememberMe');
    
    localStorage.clear();
    
    if (theme) {
      localStorage.setItem('theme', theme);
    }
    
    if (rememberMe === 'true') {
      localStorage.setItem('rememberMe', 'true');
    }
    
    window.location.href = 'login.html';
  }
  
  static isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
  
  static isGuest() {
    return localStorage.getItem('isGuest') === 'true';
  }
  
  static getUserById(userId) {
    if (userId.startsWith('user_')) {
      const savedUsers = JSON.parse(localStorage.getItem('nexanext_users') || '[]');
      return savedUsers.find(u => u.id === userId) || null;
    }
    return null;
  }
  
  static updateUserProfile(userId, updates) {
    const savedUsers = JSON.parse(localStorage.getItem('nexanext_users') || '[]');
    const userIndex = savedUsers.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return false;
    }
    
    savedUsers[userIndex] = {
      ...savedUsers[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('nexanext_users', JSON.stringify(savedUsers));
    
    const currentUserId = localStorage.getItem('currentUserId');
    if (currentUserId === userId) {
      localStorage.setItem('currentUserName', 
        `${savedUsers[userIndex].firstname} ${savedUsers[userIndex].lastname}`);
    }
    
    return true;
  }
  
  static getAllUsers() {
    const savedUsers = JSON.parse(localStorage.getItem('nexanext_users') || '[]');
    const demoUsers = [
      {
        id: 'demo_1',
        firstname: 'Demo',
        lastname: 'User',
        email: 'demo@nexanext.com',
        username: 'demouser',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo&backgroundColor=65c9ff',
        bio: 'Demo user account for testing',
        location: 'Stockholm, Sweden',
        joinedDate: '2024-01-15',
        isActive: true,
        isDemo: true
      },
      {
        id: 'demo_2',
        firstname: 'Test',
        lastname: 'User',
        email: 'test@nexanext.com',
        username: 'testuser',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test&backgroundColor=b6e3f4',
        bio: 'Test user account',
        location: 'Gothenburg, Sweden',
        joinedDate: '2024-02-01',
        isActive: true,
        isDemo: true
      }
    ];
    
    return [...demoUsers, ...savedUsers];
  }
}