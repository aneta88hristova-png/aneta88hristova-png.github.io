// js/components/UserCard.js
export class UserCard {
  constructor(user) {
    this.user = user;
  }
  
  render() {
    const city = this.user.address?.city || "Unknown";
    const country = this.user.address?.country || "Unknown";
    const location = `${city}, ${country}`;
    
    return `
      <div class="user-card" data-user-id="${this.user.id}">
        <div class="card-header">
          <img src="${this.user.image}" 
               alt="${this.user.firstname || ''} ${this.user.lastname || ''}" 
               class="profile-image"
               onerror="this.src='https://picsum.photos/200/200?random=${this.user.id + 5000}'">
          <div class="user-info">
            <h4>${this.user.firstname || ''} ${this.user.lastname || ''}</h4>
            <p class="user-email">${this.user.email || 'No email'}</p>
            <p class="user-job">${this.user.company?.name || this.user.company?.title || 'Professional'}</p>
          </div>
        </div>
        <div class="card-footer">
          <span class="user-location">${location}</span>
          <button class="view-profile" data-user-id="${this.user.id}">View Profile</button>
        </div>
      </div>
    `;
  }
  
  attachEventListeners(cardElement) {
    // Click on card
    cardElement.addEventListener('click', (e) => {
      if (!e.target.classList.contains('view-profile')) {
        window.location.href = `profile.html?id=${this.user.id}`;
      }
    });
    
    // Click on view profile button
    const viewProfileBtn = cardElement.querySelector('.view-profile');
    if (viewProfileBtn) {
      viewProfileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.location.href = `profile.html?id=${this.user.id}`;
      });
    }
  }
}