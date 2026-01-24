// js/components/PostCard.js
export class PostCard {
  constructor(post, user) {
    this.post = post;
    this.user = user;
    this.onLike = null;
    this.onComment = null;
    this.onShare = null;
  }

  render() {
    return `
      <div class="post-card" data-post-id="${this.post.id}">
        <div class="post-header">
          <img src="${this.user.image}" 
               alt="${this.user.firstname}" 
               class="post-avatar"
               onerror="this.src='https://picsum.photos/40/40?random=${this.user.id}'">
          <div class="post-author">
            <h4>${this.user.firstname} ${this.user.lastname}</h4>
            <span class="post-date">${this.post.date}</span>
          </div>
        </div>
        <div class="post-content">
          ${this.post.content}
        </div>
        ${this.post.image ? `
          <img src="${this.post.image}" alt="Post image" class="post-image">
        ` : ''}
        <div class="post-stats">
          <span class="stat-item">❤️ ${this.post.likes} likes</span>
          <span class="stat-item">💬 ${this.post.comments} comments</span>
          <span class="stat-item">↗️ ${this.post.shares} shares</span>
        </div>
        <div class="post-actions">
          <button class="action-btn like-btn" data-post-id="${this.post.id}">
            <span class="action-icon">🤍</span>
            <span class="action-text">Like</span>
          </button>
          <button class="action-btn comment-btn" data-post-id="${this.post.id}">
            <span class="action-icon">💬</span>
            <span class="action-text">Comment</span>
          </button>
          <button class="action-btn share-btn" data-post-id="${this.post.id}">
            <span class="action-icon">↗️</span>
            <span class="action-text">Share</span>
          </button>
        </div>
      </div>
    `;
  }

  attachEventListeners(element) {
    const likeBtn = element.querySelector('.like-btn');
    const commentBtn = element.querySelector('.comment-btn');
    const shareBtn = element.querySelector('.share-btn');

    if (likeBtn && this.onLike) {
      likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.onLike(this.post.id);
      });
    }

    if (commentBtn && this.onComment) {
      commentBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.onComment(this.post.id);
      });
    }

    if (shareBtn && this.onShare) {
      shareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.onShare(this.post.id);
      });
    }
  }

  // Setters for event handlers
  setOnLike(handler) {
    this.onLike = handler;
    return this;
  }

  setOnComment(handler) {
    this.onComment = handler;
    return this;
  }

  setOnShare(handler) {
    this.onShare = handler;
    return this;
  }

  updateLikes(element, newCount, isLiked) {
    const likeBtn = element.querySelector('.like-btn');
    const likeIcon = likeBtn.querySelector('.action-icon');
    const stats = element.querySelector('.post-stats');
    
    if (stats) {
      stats.querySelector('.stat-item:nth-child(1)').textContent = 
        `❤️ ${newCount} likes`;
    }
    
    if (likeIcon) {
      likeIcon.textContent = isLiked ? '💙' : '🤍';
    }
  }
}