// js/pages/GalleryPage.js
import { GalleryItem } from "../components/GalleryItem.js";
import { setupThemeToggle } from "../utils/theme.js";
import { showNotification } from "../utils/notifications.js";
import {
  showLoading,
  hideLoading,
  showError,
  hideError,
  showContent,
  hideContent,
} from "../utils/uiHelpers.js";
import { FakerAPI } from "../api/FakerAPI.js";

export class GalleryPage {
  constructor() {
    this.userId = null;
    this.userData = null;
    this.albums = [];
    this.currentAlbum = null;
    this.currentPhotoIndex = 0;
  }

  async init() {
    try {
      this.getUserIdFromURL();
      this.setupTheme();
      this.setupEventListeners();
      await this.loadGalleryData();
    } catch (error) {
      this.showError();
    }
  }

  getUserIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    this.userId = urlParams.get("id") || "1";
  }

  setupTheme() {
    setupThemeToggle();
  }

  setupEventListeners() {
    document.getElementById("retry-button")?.addEventListener("click", () => {
      this.loadGalleryData();
    });

    document.getElementById("close-modal")?.addEventListener("click", () => {
      this.closeImageModal();
    });

    document.getElementById("prev-image")?.addEventListener("click", () => {
      this.prevImage();
    });

    document.getElementById("next-image")?.addEventListener("click", () => {
      this.nextImage();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeImageModal();
      } else if (e.key === "ArrowRight") {
        this.nextImage();
      } else if (e.key === "ArrowLeft") {
        this.prevImage();
      }
    });
  }

  async loadGalleryData() {
    showLoading();
    hideError();
    hideContent("gallery-content");

    try {
      const [userData, albums] = await Promise.all([
        FakerAPI.fetchUserById(this.userId),
        FakerAPI.fetchUserAlbums(this.userId)
      ]);
      
      this.userData = userData;
      this.albums = albums;

      this.renderGallery();

      hideLoading();
      showContent("gallery-content");

      setTimeout(() => this.setupGalleryFunctionality(), 100);
    } catch (error) {
      hideLoading();
      this.showError();
    }
  }

  renderGallery() {
    const galleryContent = document.getElementById("gallery-content");

    if (this.currentAlbum) {
      galleryContent.innerHTML = this.renderAlbumPhotos();
    } else {
      galleryContent.innerHTML = this.renderAlbumGrid();
    }
  }

  renderAlbumGrid() {
    return `
      <div class="gallery-container">
        <div class="gallery-header">
          <div class="gallery-user-info">
            <img src="${this.userData.image}" 
                 alt="${this.userData.firstname}" 
                 class="gallery-avatar">
            <div>
              <h2>${this.userData.firstname}'s Photo Albums</h2>
              <div class="gallery-stats">
                <span>📁 ${this.albums.length} Albums</span>
                <span>📷 ${this.albums.reduce((sum, album) => sum + album.photoCount, 0)} Photos</span>
              </div>
            </div>
          </div>
        </div>

        <div class="album-grid" id="album-grid">
          ${this.albums
            .map((album, index) => {
              const item = new GalleryItem(album, "album");
              return item.render();
            })
            .join("")}
        </div>
      </div>
    `;
  }

  renderAlbumPhotos() {
    return `
      <div class="gallery-container">
        <div class="back-to-albums" id="back-to-albums">
          <span>←</span>
          <h3>Back to Albums</h3>
        </div>

        <div class="gallery-header">
          <div class="gallery-user-info">
            <img src="${this.userData.image}" 
                 alt="${this.userData.firstname}" 
                 class="gallery-avatar">
            <div>
              <h2>${this.currentAlbum.name}</h2>
              <div class="gallery-stats">
                <span>📷 ${this.currentAlbum.photoCount} Photos</span>
                <span>📅 ${this.currentAlbum.date}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="photos-grid" id="photos-grid">
          ${Array.from({ length: this.currentAlbum.photoCount }, (_, index) => {
            const photo = {
              id: `${this.currentAlbum.id}-${index}`,
              url: `https://picsum.photos/400/300?random=${this.userId}${index}`,
              title: `Photo ${index + 1}`,
              likes: Math.floor(Math.random() * 100),
              comments: Math.floor(Math.random() * 20),
            };
            const item = new GalleryItem(photo, "photo");
            return item.render();
          }).join("")}
        </div>
      </div>
    `;
  }

  setupGalleryFunctionality() {
    document.querySelectorAll(".album-item").forEach((albumElement, index) => {
      albumElement.addEventListener("click", () => {
        this.openAlbum(index);
      });
    });

    document.querySelectorAll(".photo-item").forEach((photoElement, index) => {
      photoElement.addEventListener("click", () => {
        this.openImageModal(index);
      });
    });

    document.getElementById("back-to-albums")?.addEventListener("click", () => {
      this.currentAlbum = null;
      this.renderGallery();
      setTimeout(() => this.setupGalleryFunctionality(), 100);
    });
  }

  openAlbum(albumIndex) {
    this.currentAlbum = this.albums[albumIndex];
    this.renderGallery();
    setTimeout(() => this.setupGalleryFunctionality(), 100);
  }

  openImageModal(photoIndex) {
    this.currentPhotoIndex = photoIndex;
    const modal = document.getElementById("image-modal");
    const modalImage = document.getElementById("modal-image");
    const imageTitle = document.getElementById("image-title");
    const imageCounter = document.getElementById("image-counter");

    if (modal && modalImage) {
      modalImage.src = `https://picsum.photos/800/600?random=${this.userId}${photoIndex}`;

      if (imageTitle) {
        imageTitle.textContent = `Photo ${photoIndex + 1}`;
      }

      if (imageCounter) {
        imageCounter.textContent = `${photoIndex + 1} of ${this.currentAlbum.photoCount}`;
      }

      modal.style.display = "flex";
      document.body.classList.add("modal-open");
    }
  }

  closeImageModal() {
    const modal = document.getElementById("image-modal");
    if (modal) {
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    }
  }

  nextImage() {
    if (
      this.currentAlbum &&
      this.currentPhotoIndex < this.currentAlbum.photoCount - 1
    ) {
      this.currentPhotoIndex++;
      this.openImageModal(this.currentPhotoIndex);
    }
  }

  prevImage() {
    if (this.currentAlbum && this.currentPhotoIndex > 0) {
      this.currentPhotoIndex--;
      this.openImageModal(this.currentPhotoIndex);
    }
  }

  showError() {
    showError();
  }
}