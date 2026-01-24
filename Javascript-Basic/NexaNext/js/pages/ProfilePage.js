// js/pages/ProfilePage.js
import { appState } from "../state/appState.js";
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
import { PostCard } from "../components/PostCard.js";
import { FriendItem } from "../components/FriendItem.js";
import { FakerAPI } from "../api/FakerAPI.js";

export class ProfilePage {
  constructor() {
    this.userId = null;
    this.userData = null;
    this.friends = [];
    this.posts = [];
    this.currentPostId = null;
    this.newPostImage = null;
  }

  async init() {
    try {
      this.getUserIdFromURL();
      this.setupTheme();
      this.setupEventListeners();
      await this.loadProfileData();
    } catch (error) {
      this.showError("Failed to initialize profile page.");
    }
  }

  getUserIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    this.userId = urlParams.get("id") || "1";

    // Check if it's self profile
    if (this.userId === "self") {
      const currentUserId = localStorage.getItem("currentUserId");
      if (currentUserId) {
        this.userId = currentUserId;
        this.isSelfProfile = true;
      }
    }
  }

  // Uppdatera loadProfileData() för att hämta från localStorage:
  async loadProfileData() {
    showLoading();
    hideError();
    hideContent("profile-content");

    try {
      // First check if it's a self-registered user
      if (this.userId.startsWith("user_")) {
        const savedUsers = JSON.parse(
          localStorage.getItem("nexanext_users") || "[]",
        );
        const user = savedUsers.find((u) => u.id === this.userId);

        if (user) {
          this.userData = user;
          this.friends = await FakerAPI.fetchUserFriends("1"); // Default friends
          this.posts = await FakerAPI.fetchUserPosts("1"); // Default posts
          this.renderProfile();
          hideLoading();
          showContent("profile-content");
          return;
        }
      }

      // Otherwise fetch from API as before
      const [userData, friends, posts] = await Promise.all([
        FakerAPI.fetchUserById(this.userId),
        FakerAPI.fetchUserFriends(this.userId),
        FakerAPI.fetchUserPosts(this.userId),
      ]);

      this.userData = userData;
      this.friends = friends;
      this.posts = posts;

      this.renderProfile();
      hideLoading();
      showContent("profile-content");
    } catch (error) {
      hideLoading();
      this.showError("Could not load profile data.");
    }
  }

  setupTheme() {
    setupThemeToggle();
  }

  setupEventListeners() {
    document.getElementById("retry-button")?.addEventListener("click", () => {
      this.loadProfileData();
    });

    // Message modal
    document
      .getElementById("send-message-btn")
      ?.addEventListener("click", () => {
        this.openMessageModal();
      });

    document.getElementById("cancel-message")?.addEventListener("click", () => {
      this.closeMessageModal();
    });

    document.getElementById("send-message")?.addEventListener("click", () => {
      this.sendMessage();
    });

    // Call modal
    document.getElementById("call-btn-main")?.addEventListener("click", () => {
      this.openCallModal();
    });

    document.getElementById("cancel-call")?.addEventListener("click", () => {
      this.closeCallModal();
    });

    // DIRECT EMAIL - opens real email client
    document.getElementById("send-email-btn")?.addEventListener("click", () => {
      this.openDirectEmail();
    });

    // Keyboard shortcuts for modals
    document
      .getElementById("message-text")
      ?.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          this.sendMessage();
        }
      });

    document
      .getElementById("new-comment-input")
      ?.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          this.postComment();
        }
      });

    // Allow Shift+Enter for new lines in textareas
    document.querySelectorAll("textarea").forEach((textarea) => {
      textarea.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && e.shiftKey) {
          return;
        }
      });
    });

    // Comments modal
    document.getElementById("close-comments")?.addEventListener("click", () => {
      this.closeCommentsModal();
    });

    document
      .getElementById("post-comment-btn")
      ?.addEventListener("click", () => {
        this.postComment();
      });

    // Share modal
    document.getElementById("close-share")?.addEventListener("click", () => {
      this.closeShareModal();
    });

    // Share option buttons event listener
    document.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("share-option-btn") ||
        e.target.closest(".share-option-btn")
      ) {
        const btn = e.target.classList.contains("share-option-btn")
          ? e.target
          : e.target.closest(".share-option-btn");
        const platform = btn.dataset.platform;
        this.handleShare(platform);
      }
    });

    // Close modals on background click
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          if (modal.id === "message-modal") this.closeMessageModal();
          if (modal.id === "comments-modal") this.closeCommentsModal();
          if (modal.id === "share-modal") this.closeShareModal();
        }
      });
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeMessageModal();
        this.closeCommentsModal();
        this.closeShareModal();
      }
    });
  }

  async loadProfileData() {
    showLoading();
    hideError();
    hideContent("profile-content");

    try {
      const [userData, friends, posts] = await Promise.all([
        FakerAPI.fetchUserById(this.userId),
        FakerAPI.fetchUserFriends(this.userId),
        FakerAPI.fetchUserPosts(this.userId),
      ]);

      this.userData = userData;
      this.friends = friends;
      this.posts = posts;

      this.renderProfile();
      hideLoading();
      showContent("profile-content");

      // Setup post functionality after render
      requestAnimationFrame(() => {
        try {
          this.setupPostFunctionality();
        } catch {
          // Silent error handling for setup
        }
      });
    } catch (error) {
      hideLoading();
      this.showError("Could not load profile data.");
    }
  }

  renderProfile() {
    const profileContent = document.getElementById("profile-content");

    profileContent.innerHTML = `
    <div class="profile-container">
      <!-- Cover Photo -->
      <div class="cover-photo-container">
        <img src="https://picsum.photos/1200/300?random=${this.userId}" 
             alt="Cover" 
             class="cover-photo">
      </div>
      
      <!-- Profile Header -->
      <div class="profile-header profile-header-with-cover">
        <img src="${this.userData.image}" 
             alt="${this.userData.firstname}" 
             class="profile-image-large">
        <div class="profile-info">
          <h2>${this.userData.firstname} ${this.userData.lastname}</h2>
          <p>${this.userData.company?.title || "Professional"} at ${this.userData.company?.name || "Company"}</p>
          <div class="profile-meta">
            <div class="meta-item">
              <i>📍</i>
              <span>${this.userData.address?.city || "Unknown"}, ${this.userData.address?.country || "Sweden"}</span>
            </div>
            <div class="meta-item">
              <i>👥</i>
              <span>${this.friends.length} friends</span>
            </div>
            <div class="meta-item">
              <i>📝</i>
              <span>${this.posts.length} posts</span>
            </div>
          </div>
          <div class="profile-actions">
            <button id="send-message-btn" class="primary-button">Message</button>
            <button id="send-email-btn" class="secondary-button">Email</button>
            <button id="call-btn-main" class="secondary-button">Call</button>
            <a href="gallery.html?id=${this.userId}" class="secondary-button">Photos</a>
          </div>
        </div>
      </div>

      <!-- Create Post Card -->
      <div class="create-post-card">
        <h3>Create Post</h3>
        <div class="post-input-container">
          <textarea id="post-content" class="post-input" placeholder="What's on your mind?" rows="3"></textarea>
          <img id="post-image-preview" class="preview-image" alt="Preview">
        </div>
        <div class="post-actions">
          <div class="action-buttons">
            <label for="post-image-input" class="file-input-label">
              <span>📷</span>
              Photo
            </label>
            <input type="file" id="post-image-input" accept="image/*" style="display: none;">
            <button id="cancel-post" class="secondary-button">Cancel</button>
          </div>
          <button id="create-post-btn" class="primary-button">Post</button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="profile-sections">
        <!-- Left Column -->
        <div>
          <!-- Friends Section (MOVED TO TOP) -->
          <div class="friends-section">
            <h3>Friends (${this.friends.length})</h3>
            ${
              this.friends.length > 0
                ? `
              <div class="friends-grid" id="friends-grid">
                ${this.friends
                  .slice(0, 12)
                  .map((friend) => {
                    const friendItem = new FriendItem(friend);
                    return friendItem.render();
                  })
                  .join("")}
              </div>
              ${
                this.friends.length > 12
                  ? `
                <div class="view-all-friends">
                  <a href="#" class="clickable">View all ${this.friends.length} friends</a>
                </div>
              `
                  : ""
              }
            `
                : `
              <div class="no-friends">
                <p>No friends yet</p>
              </div>
            `
            }
          </div>

          <!-- Posts Section (MOVED BELOW FRIENDS) -->
          <div class="posts-section">
            <h3>Recent Posts</h3>
            ${
              this.posts.length > 0
                ? `
              <div id="posts-container">
                ${this.posts
                  .map((post) => {
                    const postCard = new PostCard(post, this.userData);
                    return postCard.render();
                  })
                  .join("")}
              </div>
            `
                : `
              <div class="no-posts">
                <p>No posts yet. Be the first to post something!</p>
              </div>
            `
            }
          </div>
        </div>
        <!-- END Left Column -->

        <!-- Right Column (Sidebar) -->
        <div class="profile-sidebar">
          <!-- Contact Info -->
          <div class="info-card">
            <h3>Contact Information</h3>
            <div class="contact-info">
              <div class="info-item">
                <span class="info-label">📧 Email</span>
                <span class="info-value">${this.userData.email}</span>
              </div>
              <div class="info-item">
                <span class="info-label">📱 Phone</span>
                <span class="info-value">${this.userData.phone || "Not available"}</span>
              </div>
              <div class="info-item">
                <span class="info-label">📍 Location</span>
                <span class="info-value">
                  <span class="location-pin">📍</span>
                  ${this.userData.address?.city || "Unknown"}, ${this.userData.address?.country || "Sweden"}
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">🌐 Website</span>
                <span class="info-value">
                  <a href="${this.userData.website}" target="_blank" class="clickable">
                    ${this.userData.website || "Not available"}
                  </a>
                </span>
              </div>
            </div>
            <div class="contact-actions">
              <div class="action-row">
                <button id="sidebar-message-btn" class="sidebar-button message-button">
                  <span>💬</span> Message
                </button>
                <button id="sidebar-email-btn" class="sidebar-button email-button">
                  <span>✉️</span> Email
                </button>
              </div>
              <div class="action-row">
                <button id="sidebar-call-btn" class="sidebar-button call-button">
                  <span>📞</span> Call
                </button>
              </div>
            </div>
          </div>

          <!-- Company Info -->
          <div class="info-card">
            <h3>Professional Information</h3>
            <div class="info-item">
              <span class="info-label">🏢 Company</span>
              <span class="info-value">${this.userData.company?.name || "Not specified"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">💼 Title</span>
              <span class="info-value">${this.userData.company?.title || "Not specified"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">📧 Work Email</span>
              <span class="info-value">${this.userData.company?.email || "Not available"}</span>
            </div>
          </div>

          <!-- About Me -->
          <div class="info-card">
            <h3>About Me</h3>
            <div class="info-item">
              <span class="info-label">🎓 Education</span>
              <span class="info-value">${this.userData.education || "Not specified"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">💖 Relationship</span>
              <span class="info-value">${this.userData.relationship || "Not specified"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">🎨 Hobbies</span>
              <span class="info-value">${this.userData.hobbies?.join(", ") || "Not specified"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">📅 Joined</span>
              <span class="info-value">${this.userData.joinedDate || "Not specified"}</span>
            </div>
          </div>
        </div>
        <!-- END Right Column -->
      </div>
      <!-- END profile-sections -->
    </div>
  `;

    // Setup sidebar button events
    document
      .getElementById("sidebar-message-btn")
      ?.addEventListener("click", () => {
        this.openMessageModal();
      });

    document
      .getElementById("sidebar-email-btn")
      ?.addEventListener("click", () => {
        this.openDirectEmail();
      });

    document
      .getElementById("sidebar-call-btn")
      ?.addEventListener("click", () => {
        this.openCallModal();
      });

    // Setup create post event listeners after rendering
    this.setupCreatePostListeners();
  }

  setupCreatePostListeners() {
    // Handle image upload
    document
      .getElementById("post-image-input")
      ?.addEventListener("change", (e) => {
        this.handleImageUpload(e);
      });

    // Create post button
    document
      .getElementById("create-post-btn")
      ?.addEventListener("click", () => {
        this.createPost();
      });

    // Cancel post button
    document.getElementById("cancel-post")?.addEventListener("click", () => {
      this.cancelPost();
    });
  }

  setupPostFunctionality() {
    // Attach event listeners to posts
    this.posts.forEach((post, index) => {
      const postElement = document.querySelectorAll(".post-card")[index];
      if (postElement) {
        const postCard = new PostCard(post, this.userData);

        postCard.setOnLike((postId) => {
          this.handleLike(postId, postElement);
        });

        postCard.setOnComment((postId) => {
          this.openCommentsModal(postId);
        });

        // Use the modal for sharing
        postCard.setOnShare((postId) => {
          this.openShareModal(postId);
        });

        postCard.attachEventListeners(postElement);
      }
    });

    // Attach event listeners to friends
    this.friends.slice(0, 12).forEach((friend, index) => {
      const friendElement = document.querySelectorAll(".friend-item")[index];
      if (friendElement) {
        const friendItem = new FriendItem(friend);
        friendItem.attachEventListeners(friendElement);
      }
    });
  }

  handleLike(postId, postElement) {
    const post = this.posts.find((p) => p.id === postId);
    if (post) {
      const isLiked = !post.liked;
      post.liked = isLiked;
      post.likes = isLiked ? post.likes + 1 : post.likes - 1;

      const postCard = new PostCard(post, this.userData);
      postCard.updateLikes(postElement, post.likes, isLiked);

      showNotification(`Post ${isLiked ? "liked" : "unliked"}!`);
    }
  }

  // UPLOAD IMAGE FROM COMPUTER
  handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match("image.*")) {
        showNotification("Please select an image file", "error");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification("Image must be less than 5MB", "error");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.newPostImage = e.target.result;
        const preview = document.getElementById("post-image-preview");
        if (preview) {
          preview.src = this.newPostImage;
          preview.style.display = "block";
        }
      };
      reader.onerror = () => {
        showNotification("Failed to load image", "error");
      };
      reader.readAsDataURL(file);
    }
  }

  // CREATE POST WITH IMAGE
  createPost() {
    const content = document.getElementById("post-content")?.value.trim() || "";

    if (!content && !this.newPostImage) {
      showNotification("Please add text or image", "error");
      return;
    }

    const newPost = {
      id: Date.now(),
      content: content || "Shared a photo",
      image: this.newPostImage,
      date: "Just now",
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
    };

    this.posts.unshift(newPost);

    // Update UI
    const postsContainer = document.getElementById("posts-container");
    if (postsContainer) {
      const postCard = new PostCard(newPost, this.userData);
      postsContainer.innerHTML = postCard.render() + postsContainer.innerHTML;

      // Setup event listeners for the new post
      setTimeout(() => {
        const newPostElement = postsContainer.querySelector(
          ".post-card:first-child",
        );
        if (newPostElement) {
          const postCard = new PostCard(newPost, this.userData);

          postCard.setOnLike((postId) => {
            this.handleLike(postId, newPostElement);
          });

          postCard.setOnComment((postId) => {
            this.openCommentsModal(postId);
          });

          postCard.setOnShare((postId) => {
            this.openShareModal(postId);
          });

          postCard.attachEventListeners(newPostElement);
        }
      }, 0);
    }

    // Clear form
    this.cancelPost();

    // Update posts count in profile meta
    const postsCountElement = document.querySelector(
      ".profile-meta span:nth-child(3)",
    );
    if (postsCountElement) {
      const currentCount = this.posts.length;
      postsCountElement.textContent = `${currentCount} posts`;
    }

    showNotification("Post created!");
  }

  cancelPost() {
    document.getElementById("post-content").value = "";
    const preview = document.getElementById("post-image-preview");
    if (preview) {
      preview.style.display = "none";
      preview.src = "";
    }
    this.newPostImage = null;

    // Clear file input
    const fileInput = document.getElementById("post-image-input");
    if (fileInput) {
      fileInput.value = "";
    }
  }

  openMessageModal() {
    const modal = document.getElementById("message-modal");
    if (modal) {
      modal.style.display = "flex";
      document.body.classList.add("modal-open");

      // Focus on message field
      setTimeout(() => {
        document.getElementById("message-text")?.focus();
      }, 100);
    }
  }

  closeMessageModal() {
    const modal = document.getElementById("message-modal");
    if (modal) {
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
      document.getElementById("message-text").value = "";
    }
  }

  sendMessage() {
    const message = document.getElementById("message-text").value.trim();
    if (message) {
      showNotification(`Message sent to ${this.userData.firstname}!`);

      setTimeout(() => {
        this.closeMessageModal();
      }, 500);
    } else {
      showNotification("Please enter a message", "error");
    }
  }

  // SIMPLE DIRECT EMAIL - opens real email client
  openDirectEmail() {
    const userEmail = this.userData.email || `user${this.userId}@example.com`;
    const subject = `Professional collaboration opportunity at NexaNext`;

    const body = `Hello ${this.userData.firstname},

I'm a developer at NexaNext and I'd like to invite you to collaborate on our project.

We offer professional training through Avenga Academy, led by Ivan. I believe your skills would be a great addition to our team.

Would you be interested in discussing this further?

Best regards,
Aneta Hristova
Developer at NexaNext`;

    // Create mailto link
    const mailtoLink = `mailto:${userEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open user's default email client
    window.location.href = mailtoLink;

    // Show notification
    showNotification(`Opening email client for ${this.userData.firstname}...`);
  }

  openCallModal() {
    const modal = document.getElementById("call-confirmation");
    const phoneNumber = document.getElementById("phone-number-display");
    const callLink = document.getElementById("call-link");

    if (modal && phoneNumber && callLink) {
      phoneNumber.textContent = this.userData.phone || "+1 (555) 123-4567";
      callLink.href = `tel:${this.userData.phone || "5551234567"}`;

      modal.style.display = "block";
      document.body.classList.add("modal-open");
    }
  }

  closeCallModal() {
    const modal = document.getElementById("call-confirmation");
    if (modal) {
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    }
  }

  openCommentsModal(postId) {
    this.currentPostId = postId;
    const modal = document.getElementById("comments-modal");
    const post = this.posts.find((p) => p.id === postId);

    if (modal && post) {
      // Load comments for this post
      const commentsContainer = document.getElementById("comments-container");
      commentsContainer.innerHTML = `
        <div class="comment-item">
          <div class="comment-header">
            <img src="${this.userData.image}" alt="You" class="comment-avatar">
            <div class="comment-author">
              <h4>You</h4>
              <span class="comment-date">Just now</span>
            </div>
          </div>
          <div class="comment-content">
            <p>This is a sample comment. In a real app, you would load actual comments here.</p>
          </div>
        </div>
      `;

      modal.style.display = "flex";
      document.body.classList.add("modal-open");
      document.getElementById("new-comment-input")?.focus();
    }
  }

  closeCommentsModal() {
    const modal = document.getElementById("comments-modal");
    if (modal) {
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
      document.getElementById("new-comment-input").value = "";
    }
  }

  // ADD COMMENT
  postComment() {
    const comment = document.getElementById("new-comment-input").value.trim();
    if (comment) {
      const post = this.posts.find((p) => p.id === this.currentPostId);
      if (post) {
        post.comments += 1;

        // Update post UI
        const postElement = document.querySelector(
          `[data-post-id="${this.currentPostId}"]`,
        );
        if (postElement) {
          const commentsCount = postElement.querySelector(".comments-count");
          if (commentsCount) {
            commentsCount.textContent = post.comments;
          }
        }

        showNotification("Comment posted!");
        this.closeCommentsModal();
      }
    } else {
      showNotification("Please write a comment", "error");
    }
  }

  // SHARE MODAL
  openShareModal(postId) {
    this.currentPostId = postId;
    const modal = document.getElementById("share-modal");

    if (modal) {
      modal.style.display = "flex";
      document.body.classList.add("modal-open");
    }
  }

  closeShareModal() {
    const modal = document.getElementById("share-modal");
    if (modal) {
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    }
  }

  // HANDLE SHARE WITH MODAL
  handleShare(platform) {
    const post = this.posts.find((p) => p.id === this.currentPostId);
    if (!post) return;

    const postUrl = `${window.location.origin}/post/${this.currentPostId}`;
    const message = `Check out ${this.userData.firstname}'s post!`;

    switch (platform) {
      case "facebook":
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}&quote=${encodeURIComponent(message)}`;
        window.open(facebookUrl, "_blank", "noopener,noreferrer");
        showNotification("Opening Facebook...");
        break;

      case "twitter":
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(postUrl)}`;
        window.open(twitterUrl, "_blank", "noopener,noreferrer");
        showNotification("Opening Twitter...");
        break;

      case "linkedin":
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
        window.open(linkedinUrl, "_blank", "noopener,noreferrer");
        showNotification("Opening LinkedIn...");
        break;

      case "copy":
        navigator.clipboard
          .writeText(`${message}\n\n${postUrl}`)
          .then(() => showNotification("Link copied to clipboard!"))
          .catch(() => showNotification("Failed to copy link", "error"));
        break;

      case "email":
        const emailUrl = `mailto:?subject=${encodeURIComponent(`Check out ${this.userData.firstname}'s post`)}&body=${encodeURIComponent(`${message}\n\n${postUrl}`)}`;
        window.location.href = emailUrl;
        showNotification("Opening email...");
        break;
    }

    // Update share count (not for copy)
    if (platform !== "copy") {
      const postElement = document.querySelector(
        `[data-post-id="${this.currentPostId}"]`,
      );
      if (postElement) {
        const sharesBtn = postElement.querySelector(".share-btn .shares-count");
        if (sharesBtn) {
          const currentShares =
            parseInt(sharesBtn.textContent.match(/\d+/)?.[0]) || 0;
          const newShares = currentShares + 1;
          sharesBtn.textContent = `(${newShares})`;
        }
        const postIndex = this.posts.findIndex(
          (p) => p.id === this.currentPostId,
        );
        if (postIndex !== -1) {
          this.posts[postIndex].shares += 1;
        }
      }
    }

    // Close modal
    setTimeout(() => {
      this.closeShareModal();
    }, 500);
  }

  showError(message = "An error occurred. Please try again.") {
    showError();
  }
}
