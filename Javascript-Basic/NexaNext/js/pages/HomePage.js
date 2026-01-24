import { appState } from "../state/appState.js";
import { setupThemeToggle, updateThemeToggleUI } from "../utils/theme.js";
import { UserCard } from "../components/UserCard.js";
import { FakerAPI } from "../api/FakerAPI.js";

export class HomePage {
  constructor() {
    this.users = [];
    this.currentPage = 1;
    this.perPage = 12;
    this.totalUsers = 0;
    this.totalPages = 1;
    this.isLoading = false;
  }

  async init() {
    try {
      await Promise.all([this.setupTheme(), this.setupEventListeners()]);

      await Promise.all([this.loadUsers(), this.updateStats()]);
    } catch (error) {
      this.showError("Failed to load data from API.");
    }
  }

  async setupTheme() {
    document.body.setAttribute("data-theme", appState.theme);
    updateThemeToggleUI();
    setupThemeToggle();
    return Promise.resolve();
  }

  setupEventListeners() {
    // Retry button
    document.getElementById("retry-button")?.addEventListener("click", () => {
      this.loadUsers();
    });

    // Load more button
    document.getElementById("load-more-btn")?.addEventListener("click", () => {
      this.loadMoreUsers();
    });

    // Pagination
    document.getElementById("prev-page")?.addEventListener("click", () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.loadUsers();
      }
    });

    document.getElementById("next-page")?.addEventListener("click", () => {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.loadUsers();
      }
    });

    return Promise.resolve();
  }

  async loadUsers() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.showLoading();
    this.hideError();
    this.hideUsers();

    try {
      const allUsers = await FakerAPI.fetchUsers(50);
      this.totalUsers = allUsers.length;
      this.totalPages = Math.ceil(this.totalUsers / this.perPage);

      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      this.users = allUsers.slice(startIndex, endIndex);

      await Promise.all([this.renderUsers(), this.updatePagination()]);

      this.hideLoading();
      this.showUsers();
    } catch (error) {
      this.hideLoading();
      this.showError("Failed to load users. Please try again.");

      try {
        const mockUsers = FakerAPI.generateMockUsers(50);
        this.users = mockUsers.slice(0, this.perPage);
        await this.renderUsers();
        this.showUsers();
      } catch (mockError) {}
    } finally {
      this.isLoading = false;
    }
  }

  async loadMoreUsers() {
    if (this.isLoading) return;

    this.isLoading = true;
    const loadMoreBtn = document.getElementById("load-more-btn");
    if (loadMoreBtn) {
      loadMoreBtn.innerHTML =
        '<span class="loading-spinner"></span> Loading...';
      loadMoreBtn.disabled = true;
    }

    try {
      const newUsers = await FakerAPI.fetchUsers(12);
      this.users = [...this.users, ...newUsers];
      await this.renderUsers();

      // Update total count
      this.totalUsers = this.users.length;

      // Hide load more button if we have enough users
      if (this.users.length >= 50 && loadMoreBtn) {
        loadMoreBtn.style.display = "none";
      }
    } catch (error) {
      this.showError("Failed to load more users.");
    } finally {
      this.isLoading = false;
      if (loadMoreBtn) {
        loadMoreBtn.innerHTML = "Load More Users";
        loadMoreBtn.disabled = false;
      }
    }
  }

  async renderUsers() {
    const usersGrid = document.getElementById("users-grid");
    if (!usersGrid) return;

    const userCards = this.users.map((user) => {
      const userCard = new UserCard(user);
      return { html: userCard.render(), userCard };
    });

    usersGrid.innerHTML = userCards.map((item) => item.html).join("");

    userCards.forEach((item, index) => {
      const cardElement = usersGrid.children[index];
      if (cardElement) {
        item.userCard.attachEventListeners(cardElement);
      }
    });
  }

  showLoading() {
    const loadingElement = document.getElementById("loading");
    const usersGrid = document.getElementById("users-grid");

    if (loadingElement) {
      loadingElement.style.display = "flex";
    }
    if (usersGrid) {
      usersGrid.style.display = "none";
    }
  }

  hideLoading() {
    const loadingElement = document.getElementById("loading");
    if (loadingElement) {
      loadingElement.style.display = "none";
    }
  }

  showUsers() {
    const usersGrid = document.getElementById("users-grid");
    if (usersGrid) {
      usersGrid.style.display = "grid";
    }
  }

  hideUsers() {
    const usersGrid = document.getElementById("users-grid");
    if (usersGrid) {
      usersGrid.style.display = "none";
    }
  }

  showError(message = "An error occurred. Please try again.") {
    const errorElement = document.getElementById("error-message");
    const retryButton = document.getElementById("retry-button");

    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = "block";
    }
    if (retryButton) {
      retryButton.style.display = "block";
    }
  }

  hideError() {
    const errorElement = document.getElementById("error-message");
    const retryButton = document.getElementById("retry-button");

    if (errorElement) {
      errorElement.style.display = "none";
    }
    if (retryButton) {
      retryButton.style.display = "none";
    }
  }

  async updatePagination() {
    const prevBtn = document.getElementById("prev-page");
    const nextBtn = document.getElementById("next-page");
    const pageInfo = document.getElementById("page-info");

    if (prevBtn) {
      prevBtn.disabled = this.currentPage <= 1;
    }

    if (nextBtn) {
      nextBtn.disabled = this.currentPage >= this.totalPages;
    }

    if (pageInfo) {
      pageInfo.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
    }
  }

  async updateStats() {
    try {
      const stats = await FakerAPI.getStats();
      await this.updateStatsUI(stats);
    } catch (error) {
      const fallbackStats = {
        totalUsers: 50,
        totalCountries: 35, 
        totalPosts: 1280   
      };
      await this.updateStatsUI(fallbackStats);
    }
  }

  async updateStatsUI(stats) {
    const totalUsersElement = document.getElementById("total-users");
    const totalCountriesElement = document.getElementById("total-countries");
    const totalPostsElement = document.getElementById("total-posts");

    if (totalUsersElement) {
      totalUsersElement.textContent = stats.totalUsers || 50;
    }
    if (totalCountriesElement) {
      totalCountriesElement.textContent = stats.totalCountries || 35;
    }
    if (totalPostsElement) {
      totalPostsElement.textContent = stats.totalPosts || 1280;
    }
  }
}