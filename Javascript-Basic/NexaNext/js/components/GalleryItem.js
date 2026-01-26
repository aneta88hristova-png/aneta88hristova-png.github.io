export class GalleryItem {
  constructor(item, type = 'album') {
    this.item = item;
    this.type = type; 
  }

  render() {
    if (this.type === 'album') {
      return this.renderAlbum();
    } else {
      return this.renderPhoto();
    }
  }

  renderAlbum() {
    return `
      <div class="album-item" data-album-id="${this.item.id}">
        <div class="album-cover">
          <img src="${this.item.coverPhoto}" 
               alt="${this.item.name}" 
               class="album-cover-image"
               onerror="this.src='https://picsum.photos/400/300?random=${this.item.id}'">
          <div class="album-overlay">
            <div class="album-photo-count">
              ${this.item.photoCount} photos
            </div>
          </div>
        </div>
        <div class="album-info">
          <h3 class="album-name">${this.item.name}</h3>
          <p class="album-description">${this.item.description}</p>
          <div class="album-date">${this.item.date}</div>
        </div>
      </div>
    `;
  }

  renderPhoto() {
    return `
      <div class="photo-item" data-photo-id="${this.item.id}">
        <img src="${this.item.url}" 
             alt="${this.item.title}" 
             class="photo-image"
             onerror="this.src='https://picsum.photos/300/200?random=${this.item.id}'">
        <div class="photo-overlay">
          <div>${this.item.title}</div>
          <div class="photo-stats">
            <span>❤️ ${this.item.likes || 0}</span>
            <span>💬 ${this.item.comments || 0}</span>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners(element, onClick) {
    element.addEventListener('click', () => {
      if (onClick) {
        onClick(this.item);
      }
    });
  }
}