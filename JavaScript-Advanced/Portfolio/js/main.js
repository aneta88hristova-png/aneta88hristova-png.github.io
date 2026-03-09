import ApiService from "./services/apiService.js";
import * as Render from "./utils/render.js";
import EmailService from "./services/emailService.js";

class Portfolio {
  constructor() {
    this.projects = [];
    this.profile = null;
    this.init();
  }

  async init() {
    await this.loadData();
    this.setupEventListeners();
  }

  async loadData() {
    try {
      this.showLoadingStates();

      const [projects, profile] = await Promise.all([
        ApiService.fetchProjects(),
        ApiService.fetchProfile(),
      ]);

      this.projects = projects;
      this.profile = profile;

      this.renderProjects();
      this.renderProfile();
      this.updateContactInfo();
    } catch (error) {
      this.showErrorMessage(
        "An unexpected error occurred. Please try again later.",
      );
    }
  }

  showLoadingStates() {
    const projectsContainer = document.getElementById("projects-container");
    if (projectsContainer) {
      Render.showLoading(projectsContainer);
    }
  }

  showErrorMessage(message) {
    const projectsContainer = document.getElementById("projects-container");
    if (projectsContainer) {
      Render.showError(projectsContainer, message);
    }
  }

  renderProjects() {
    const container = document.getElementById("projects-container");
    if (!container) return;

    if (!this.projects || this.projects.length === 0) {
      Render.showError(container, "No projects found");
      return;
    }

    try {
      const projectsHtml = this.projects
        .map((project) => project.toHtml())
        .join("");
      container.innerHTML = projectsHtml;
    } catch (error) {
      Render.showError(container, "Error rendering projects");
    }
  }

  renderProfile() {
    if (!this.profile) return;

    const bioElement = document.querySelector(".profile-bio");
    if (bioElement && this.profile.bio) {
      bioElement.innerHTML = this.profile.bio.replace(/\n/g, "<br>");
    }
  }

  updateContactInfo() {
    const emailElement = document.getElementById("contact-email");
    const phoneElement = document.getElementById("contact-phone");
    const locationElement = document.getElementById("contact-location");

    if (this.profile) {
      if (emailElement) {
        emailElement.textContent = this.profile.email || "Email not available";
        emailElement.href = `mailto:${this.profile.email || ""}`;
      }

      if (phoneElement) {
        phoneElement.textContent = this.profile.phone || "Phone not available";
      }

      if (locationElement) {
        locationElement.textContent =
          this.profile.location || "Location not available";
      }

      this.updateSocialLinks();
    }
  }

  updateSocialLinks() {
    if (!this.profile) return;

    const githubLink = document.querySelector('.social-icon[href*="github"]');
    if (githubLink && this.profile.github) {
      githubLink.href = this.profile.github;
    }

    const linkedinLink = document.querySelector(
      '.social-icon[href*="linkedin"]',
    );
    if (linkedinLink && this.profile.linkedin) {
      linkedinLink.href = this.profile.linkedin;
    }
  }

  setupEventListeners() {
    document.querySelectorAll(".nav-links a, .btn").forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
        }
      });
    });

    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.addEventListener(
        "submit",
        this.handleContactSubmit.bind(this),
      );
    }
  }

  async handleContactSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
      const result = await EmailService.sendContactEmail(formData);

      if (result.success) {
        alert(
          result.message ||
            "Thank you for your message! I will get back to you as soon as possible.",
        );
        form.reset();
      } else {
        alert(
          result.errors
            ? result.errors.join("\n")
            : "An error occurred. Please try again.",
        );
      }
    } catch (error) {
      alert(
        "A technical error occurred. Please try again later or contact me directly via email.",
      );
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    new Portfolio();
  } catch (error) {
    document.body.innerHTML += `
      <div style="position: fixed; bottom: 20px; right: 20px; background: red; color: white; padding: 1rem; border-radius: 5px;">
        An error occurred while starting. Please refresh the page.
      </div>
    `;
  }
});
