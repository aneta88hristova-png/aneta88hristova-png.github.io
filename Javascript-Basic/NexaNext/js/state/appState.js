export const appState = {
  currentUser: null,
  theme: localStorage.getItem('theme') || 'light',
  likedPosts: JSON.parse(localStorage.getItem('likedPosts') || '{}'),
  
  setTheme(newTheme) {
    this.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
  },
  
  toggleTheme() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    return newTheme;
  },
  
  isPostLiked(postId) {
    return this.likedPosts[postId] === true;
  },
  
  togglePostLike(postId) {
    this.likedPosts[postId] = !this.likedPosts[postId];
    localStorage.setItem('likedPosts', JSON.stringify(this.likedPosts));
    return this.likedPosts[postId];
  }
};