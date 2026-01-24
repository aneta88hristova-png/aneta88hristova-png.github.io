// js/api/FakerAPI.js
export class FakerAPI {
  static API_BASE = "https://fakerapi.it/api/v2";

  static getPicsumPhoto(id, width = 200, height = 200) {
    return `https://picsum.photos/${width}/${height}?random=${id}`;
  }

  // ==================== MOCK DATA ====================
  static generateMockUsers(quantity) {
    const firstnames = [
      "Emma", "Olivia", "Ava", "Sophia", "Mia", "Charlotte", "Amelia", "Harper", "Evelyn",
    ];
    const lastnames = [
      "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    ];
    const cities = [
      "Stockholm", "Gothenburg", "Malmo", "Uppsala", "Linkoping", "Vasteras", "Orebro",
    ];
    const jobs = [
      "Developer", "Designer", "Teacher", "Nurse", "Engineer", "Artist", "Manager",
    ];
    const companies = [
      "TechCorp", "DesignHub", "InnovateAB", "FutureTech", "GreenEnergy", "CreativeMinds",
    ];

    return Array.from({ length: quantity }, (_, i) => {
      const userId = i + 1;
      return {
        id: userId,
        firstname: firstnames[i % firstnames.length],
        lastname: lastnames[i % lastnames.length],
        email: `user${userId}@example.com`,
        phone: `+46 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 90) + 10}`,
        image: FakerAPI.getPicsumPhoto(userId, 200, 200),
        website: `https://user${userId}.com`,
        bio: `Hello! I'm ${firstnames[i % firstnames.length]}. Welcome to my profile!`,
        birthday: `199${Math.floor(Math.random() * 10)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
        address: {
          street: `${["Main", "Oak", "Pine", "Maple", "Cedar"][i % 5]} Street ${Math.floor(Math.random() * 100) + 1}`,
          city: cities[i % cities.length],
          country: "Sweden",
          zipcode: `${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 90) + 10}`,
        },
        company: {
          name: companies[i % companies.length],
          title: jobs[i % jobs.length],
          email: `contact@${companies[i % companies.length].toLowerCase()}.com`,
        },
      };
    });
  }

  // ==================== REAL API WITH FIXED IMAGES ====================
  static async fetchFromAPI(endpoint, params = {}) {
    try {
      const url = new URL(`${FakerAPI.API_BASE}/${endpoint}`);
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key]),
      );

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(url.toString(), {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        return null; 
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      return null; 
    }
  }

  static fixImageUrls(data, type = "person") {
    if (!data || !Array.isArray(data)) return data;

    return data.map((item, index) => {
      const fixedItem = { ...item };

      if (
        fixedItem.image &&
        (fixedItem.image.includes("placeimg.com") ||
          fixedItem.image.includes("undefined"))
      ) {
        fixedItem.image = FakerAPI.getPicsumPhoto(item.id || index, 200, 200);
      }

      if (
        fixedItem.avatar &&
        (fixedItem.avatar.includes("placeimg.com") ||
          fixedItem.avatar.includes("undefined"))
      ) {
        fixedItem.avatar = FakerAPI.getPicsumPhoto(item.id || index, 60, 60);
      }

      return fixedItem;
    });
  }

  static async testConnection() {
    try {
      const response = await fetch(`${FakerAPI.API_BASE}/persons?_quantity=1`, {
        signal: AbortSignal.timeout(3000),
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  static async fetchUsers(quantity = 50) {
    
    try {
      const apiWorking = await this.testConnection();
      
      if (!apiWorking) {
        return FakerAPI.generateMockUsers(quantity);
      }

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(), 5000)
      );
      
      const apiPromise = (async () => {
        const persons = await FakerAPI.fetchFromAPI("persons", {
          _quantity: quantity,
          _gender: "female",
          _birthday_start: "2005-01-01",
        });

        if (persons) {
          const fixedPersons = FakerAPI.fixImageUrls(persons, "person");
          const companies =
            (await FakerAPI.fetchFromAPI("companies", {
              _quantity: Math.ceil(quantity / 3),
            })) || [];

          return fixedPersons.map((person, index) => ({
            id: person.id || index + 1,
            firstname: person.firstname || "User",
            lastname: person.lastname || "Doe",
            email: person.email || `user${index + 1}@example.com`,
            phone: person.phone || "",
            image: person.image || FakerAPI.getPicsumPhoto(person.id || index, 200, 200),
            address: {
              street: person.address?.street || "",
              city: person.address?.city || "Unknown",
              country: person.address?.country || "Unknown",
              zipcode: person.address?.zipcode || "",
            },
            company: {
              name: companies[index % companies.length]?.name || "Company",
              title: companies[index % companies.length]?.type || "Professional",
            },
          }));
        }
        return null;
      })();

      const result = await Promise.race([apiPromise, timeoutPromise]);
      if (result) return result;
      
    } catch (error) {
    }

    // Fallback till mock data
    return FakerAPI.generateMockUsers(quantity);
  }

  static async fetchUserById(id) {
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(), 4000)
      );
      
      const usersPromise = FakerAPI.fetchUsers(10);
      const users = await Promise.race([usersPromise, timeoutPromise]);
      
      let user = users.find((u) => u.id === parseInt(id));

      if (!user) {
        user = users[0];
        user.id = parseInt(id);
      }

      return {
        ...user,
        bio: `Hello! I'm ${user.firstname}. I love coding, photography, and traveling around Sweden.`,
        joinedDate: new Date(2023, 0, 1).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
        education: ["University Graduate", "College Student", "Self-Taught"][
          Math.floor(Math.random() * 3)
        ],
        relationship: ["Single", "In a relationship", "Married"][
          Math.floor(Math.random() * 3)
        ],
        hobbies: [
          "Photography",
          "Traveling",
          "Reading",
          "Sports",
          "Cooking",
          "Gaming",
        ],
        website: user.website || `https://${user.firstname.toLowerCase()}.com`,
      };
    } catch (error) {
      const mockUsers = FakerAPI.generateMockUsers(1);
      return { 
        ...mockUsers[0], 
        id: parseInt(id),
        bio: `Hello! I'm ${mockUsers[0].firstname}. Welcome to my profile!`,
        joinedDate: "January 2023",
        education: "University Graduate",
        relationship: "Single",
        hobbies: ["Photography", "Traveling", "Reading"]
      };
    }
  }

  static async fetchUserAlbums(userId, limit = 6) {
    const albumNames = [
      "Summer Vacation 2023",
      "Family Gatherings",
      "Nature & Hiking",
      "City Life Adventures",
      "Food & Restaurant Reviews",
      "Friends & Parties",
      "Travel Memories",
      "Special Events",
    ];

    return Array.from({ length: limit }, (_, i) => ({
      id: i + 1,
      name: albumNames[i % albumNames.length],
      description: "Beautiful memories and moments",
      coverPhoto: FakerAPI.getPicsumPhoto(`${userId}${i}`, 400, 300),
      photoCount: Math.floor(Math.random() * 20) + 5,
      date: new Date(
        Date.now() - Math.random() * 31536000000,
      ).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    }));
  }

  static async fetchUserFriends(userId, limit = 6) {
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(), 4000)
      );
      
      const usersPromise = FakerAPI.fetchUsers(limit + 5);
      const users = await Promise.race([usersPromise, timeoutPromise]);
      const friends = users.slice(0, limit);

      return friends.map((user) => ({
        id: user.id,
        name: `${user.firstname} ${user.lastname}`,
        avatar: FakerAPI.getPicsumPhoto(user.id, 60, 60),
        mutualFriends: Math.floor(Math.random() * 50) + 5,
        job: user.company?.title || "Professional",
        location: user.address?.city || "Unknown",
      }));
    } catch (error) {
      const mockUsers = FakerAPI.generateMockUsers(limit);
      return mockUsers.map((user) => ({
        id: user.id,
        name: `${user.firstname} ${user.lastname}`,
        avatar: FakerAPI.getPicsumPhoto(user.id, 60, 60),
        mutualFriends: Math.floor(Math.random() * 50) + 5,
        job: user.company?.title || "Professional",
      }));
    }
  }

  static async fetchUserPosts(userId, limit = 5) {
    const postContents = [
      "Had an amazing day hiking in the Swedish mountains! 🏔️ #nature #hiking",
      "Just finished my latest coding project. So excited to share it soon! 💻 #coding #developer",
      "Beautiful sunset in Stockholm tonight. Feeling grateful! 🌇 #stockholm #sunset",
      "Trying out a new restaurant in town. The food was incredible! 🍽️ #foodie #restaurant",
      "Weekend getaway with friends. Making memories that last! 👭 #friends #weekend",
      "Learning a new programming language. Always growing! 📚 #learning #programming",
      "Visited the museum today. So much history and culture! 🏛️ #culture #museum",
    ];

    return Array.from({ length: limit }, (_, i) => ({
      id: `post_${userId}_${i}`,
      userId: parseInt(userId),
      content: postContents[i % postContents.length],
      date: new Date(
        Date.now() - i * 86400000 * Math.random() * 30,
      ).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      likes: Math.floor(Math.random() * 100) + 50, // Mindre antal för realism
      comments: Math.floor(Math.random() * 50) + 5,
      shares: Math.floor(Math.random() * 20) + 2,
      image: i % 3 === 0 ? FakerAPI.getPicsumPhoto(`${userId}${i}`, 600, 400) : null,
    }));
  }

  static async fetchCompanies(quantity = 10) {
    try {
      const companies = await FakerAPI.fetchFromAPI("companies", {
        _quantity: quantity,
      });
      return companies || [];
    } catch (error) {
      return Array.from({ length: quantity }, (_, i) => ({
        id: i + 1,
        name: `Company ${String.fromCharCode(65 + i)}`,
        email: `contact@company${i + 1}.com`,
        phone: `+46${Math.floor(Math.random() * 90000000) + 10000000}`,
        website: `https://company${i + 1}.com`,
        type: ["IT Services", "Design Agency", "Consulting", "E-commerce"][
          Math.floor(Math.random() * 4)
        ],
      }));
    }
  }

  static async getStats() {
    return {
      totalUsers: 50,
      activeUsers: 42,
      avgAge: 32.5,
    };
  }

  static clearCache() {
    // Tyst cache-rensning
  }
}
