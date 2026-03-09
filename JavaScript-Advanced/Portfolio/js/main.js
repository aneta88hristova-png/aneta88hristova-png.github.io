import ApiService from './services/apiService.js';
import * as Render from './utils/render.js';
import EmailService from './services/emailService.js';

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
        ApiService.fetchProfile()
      ]);

      this.projects = projects;
      this.profile = profile;

      this.renderProjects();
      this.renderProfile();
      this.updateContactInfo();

    } catch (error) {
      this.showErrorMessage('An unexpected error occurred. Please try again later.');
    }
  }

  showLoadingStates() {
    const projectsContainer = document.getElementById('projects-container');
    if (projectsContainer) {
      Render.showLoading(projectsContainer);
    }
  }

  showErrorMessage(message) {
    const projectsContainer = document.getElementById('projects-container');
    if (projectsContainer) {
      Render.showError(projectsContainer, message);
    }
  }

  renderProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;
    
    if (!this.projects || this.projects.length === 0) {
      Render.showError(container, 'No projects found');
      return;
    }
    
    Render.renderProjects(container, this.projects);
  }

  renderProfile() {
    if (!this.profile) return;

    const bioElement = document.querySelector('.profile-bio');
    if (bioElement && this.profile.bio) {
      bioElement.innerHTML = this.profile.bio.replace(/\n/g, '<br>');
    }

    const greetingElement = document.querySelector('.hero-greeting');
    if (greetingElement && this.profile.name && this.profile.title) {
      const location = this.profile.location || 'Sweden';
      greetingElement.innerHTML = `Hi, I'm <strong>${this.profile.name}</strong>, a <strong>${this.profile.title}</strong> based in ${location}.`;
    }

    const nameElement = document.querySelector('.profile-name');
    if (nameElement && this.profile.name) {
      nameElement.textContent = this.profile.name;
    }

    const titleElement = document.querySelector('.profile-title');
    if (titleElement && this.profile.title) {
      titleElement.textContent = this.profile.title;
    }

    const aboutElement = document.querySelector('.profile-about');
    if (aboutElement && this.profile.about) {
      aboutElement.textContent = this.profile.about;
    }

    const skillsContainer = document.querySelector('.skills-container');
    if (skillsContainer && this.profile.skills) {
      skillsContainer.innerHTML = this.profile.getSkillList();
    }
  }

  updateContactInfo() {
    const emailElement = document.getElementById('contact-email');
    const phoneElement = document.getElementById('contact-phone');
    const locationElement = document.getElementById('contact-location');

    if (this.profile) {
      if (emailElement) {
        emailElement.textContent = this.profile.email || 'Email not available';
        emailElement.href = `mailto:${this.profile.email || ''}`;
      }
      
      if (phoneElement) {
        phoneElement.textContent = this.profile.phone || 'Phone not available';
      }
      
      if (locationElement) {
        locationElement.textContent = this.profile.location || 'Location not available';
      }

      this.updateSocialLinks();
    }
  }

  updateSocialLinks() {
    if (!this.profile) return;

    const githubLinks = document.querySelectorAll('a[href*="github"]');
    githubLinks.forEach(link => {
      if (this.profile.github) {
        link.href = this.profile.github;
      }
    });

    const linkedinLinks = document.querySelectorAll('a[href*="linkedin"]');
    linkedinLinks.forEach(link => {
      if (this.profile.linkedin) {
        link.href = this.profile.linkedin;
      }
    });
  }

  setupEventListeners() {
    document.querySelectorAll('.nav-links a, .btn').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', this.handleContactSubmit.bind(this));
    }
  }

  async handleContactSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim()
    };

    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all fields');
      return;
    }

    if (formData.name.length < 2) {
      alert('Name must be at least 2 characters');
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      alert('Please enter a valid email address');
      return;
    }

    if (formData.message.length < 10) {
      alert('Message must be at least 10 characters');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      const result = await EmailService.sendContactEmail(formData);

      if (result.success) {
        alert('Thank you for your message! I will get back to you as soon as possible.');
        form.reset();
      } else {
        alert(result.errors ? result.errors.join('\n') : 'An error occurred. Please try again.');
      }
    } catch (error) {
      alert('A technical error occurred. Please try again later or contact me directly via email.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
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