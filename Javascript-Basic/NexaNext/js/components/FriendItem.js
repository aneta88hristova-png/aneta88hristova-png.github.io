export class FriendItem {
  constructor(friend) {
    this.friend = friend;
  }

  render() {
    return `
      <div class="friend-item" data-friend-id="${this.friend.id}">
        <img src="${this.friend.avatar}" 
             alt="${this.friend.name}" 
             class="friend-avatar"
             onerror="this.src='https://picsum.photos/60/60?random=${this.friend.id}'">
        <div class="friend-name">${this.friend.name}</div>
        ${
          this.friend.mutualFriends
            ? `<small>${this.friend.mutualFriends} mutual friends</small>`
            : ""
        }
        ${
          this.friend.job
            ? `<small class="friend-job">${this.friend.job}</small>`
            : ""
        }
      </div>
    `;
  }

  attachEventListeners(element) {
    element.addEventListener("click", () => {
      if (this.friend.id) {
        window.location.href = `profile.html?id=${this.friend.id}`;
      }
    });

    // Add hover effect
    element.addEventListener("mouseenter", () => {
      element.style.transform = "translateY(-2px)";
    });

    element.addEventListener("mouseleave", () => {
      element.style.transform = "translateY(0)";
    });
  }

  // Static method to render multiple friends
  static renderFriends(friends, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!friends || friends.length === 0) {
      container.innerHTML = '<p class="no-friends">No friends yet</p>';
      return;
    }

    container.innerHTML = friends
      .map((friend) => {
        const friendItem = new FriendItem(friend);
        return friendItem.render();
      })
      .join("");

    // Attach event listeners
    friends.forEach((friend, index) => {
      const element = container.children[index];
      if (element) {
        const friendItem = new FriendItem(friend);
        friendItem.attachEventListeners(element);
      }
    });
  }
}
