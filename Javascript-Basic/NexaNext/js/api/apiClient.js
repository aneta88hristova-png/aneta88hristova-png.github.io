// js/api/apiClient.js
const API_BASE = "https://fakerapi.it/api/v2";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minuter

class ApiClient {
  constructor() {
    this.cache = new Map();
    this.requests = new Map();
  }

  async request(endpoint, params = {}) {
    const cacheKey = `${endpoint}?${new URLSearchParams(params).toString()}`;

    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    // Check if same request is already in progress
    if (this.requests.has(cacheKey)) {
      return await this.requests.get(cacheKey);
    }

    try {
      const url = `${API_BASE}/${endpoint}?_quantity=${params._quantity || 10}&${new URLSearchParams(params).toString()}`;

      // Create promise for this request
      const requestPromise = fetch(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        const data = await response.json();
        return data.data || [];
      });

      // Store promise to prevent duplicate requests
      this.requests.set(cacheKey, requestPromise);

      const data = await requestPromise;

      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      // Clean up
      this.requests.delete(cacheKey);

      return data;
    } catch (error) {
      this.requests.delete(cacheKey);
      throw error;
    }
  }

  // Specific API methods
  async fetchUsers(quantity = 50) {
    const persons = await this.request("persons", {
      _quantity: quantity,
      _gender: "male,female",
      _birthday_start: "1980-01-01",
    });

    const companies = await this.request("companies", {
      _quantity: Math.ceil(quantity / 3),
    });

    return persons.map((person, index) => ({
      id: person.id || index + 1,
      firstname: person.firstname || `User${index + 1}`,
      lastname: person.lastname || `Last${index + 1}`,
      email: person.email || `user${index + 1}@example.com`,
      phone: person.phone || "",
      image: this.getValidImageUrl(person.image, person.id || index),
      company: {
        name: companies[index % companies.length]?.name || "Unknown",
        title: companies[index % companies.length]?.type || "Professional",
      },
      address: {
        street: person.address?.street || "",
        city: person.address?.city || "Unknown",
        country: person.address?.country || "Unknown",
        zipcode: person.address?.zipcode || "",
      },
    }));
  }

  async fetchUserById(id) {
    const users = await this.fetchUsers(50);
    return users.find((u) => u.id === parseInt(id)) || users[0];
  }

  async fetchUserFriends(userId, limit = 6) {
    const persons = await this.request("persons", { _quantity: limit });
    const companies = await this.request("companies", { _quantity: 2 });

    return persons.map((person, index) => ({
      id: person.id || index + 1000,
      name: `${person.firstname} ${person.lastname}`,
      avatar: this.getValidImageUrl(person.image, index),
      mutualFriends: Math.floor(Math.random() * 20),
    }));
  }

  async fetchUserPosts(userId, limit = 5) {
    const texts = await this.request("texts", {
      _quantity: limit,
      _characters: 200,
    });

    return texts.map((text, index) => ({
      id: `post-${userId}-${index}`,
      content: text.content || text.title || `Post ${index + 1}`,
      date: this.getRecentDate(),
      likes: Math.floor(Math.random() * 500),
      comments: Math.floor(Math.random() * 50),
      shares: Math.floor(Math.random() * 20),
      image:
        index % 2 === 0
          ? `https://picsum.photos/600/400?random=${userId}${index}`
          : null,
    }));
  }

  async fetchUserAlbums(userId, limit = 6) {
    // FakerAPI har inga albums, så vi simulerar
    const albums = [];
    for (let i = 0; i < limit; i++) {
      const photoCount = Math.floor(Math.random() * 15) + 5;
      albums.push({
        id: i + 1,
        name: `Album ${i + 1}`,
        description: "Collection of memories",
        coverPhoto: `https://picsum.photos/400/300?random=${userId}${i}`,
        photoCount,
        date: this.getRecentDate(),
      });
    }
    return albums;
  }

  // Helper methods
  getValidImageUrl(url, id) {
    if (!url || url.includes("undefined") || url.includes("placeimg.com")) {
      return `https://picsum.photos/200/200?random=${id}`;
    }
    return url;
  }

  getRecentDate() {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  clearCache() {
    this.cache.clear();
  }

  async testConnection() {
    try {
      const response = await fetch(`${API_BASE}/companies?_quantity=1`, {
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
