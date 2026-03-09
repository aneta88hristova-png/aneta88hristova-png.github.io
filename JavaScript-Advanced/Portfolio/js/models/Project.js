export class Project {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.tech = data.tech || [];
    this.image = data.image || './images/projects/default.jpg';
    this.github = data.github;
    this.live = data.live;
  }
  
  getTechBadges() {
    return this.tech.map(tech => `<span class="tech-badge">${tech}</span>`).join('');
  }
  
  hasLiveDemo() {
    return !!this.live;
  }
  
  toHtml() {
    return `
      <article class="project-card">
        <img src="${this.image}" alt="${this.title}" loading="lazy">
        <div class="project-content">
          <h3>${this.title}</h3>
          <p>${this.description}</p>
          <div class="tech-stack">${this.getTechBadges()}</div>
          <div class="project-links">
            ${this.github ? `<a href="${this.github}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>` : ''}
            ${this.live ? `<a href="${this.live}" target="_blank" rel="noopener noreferrer">Live Demo ↗</a>` : ''}
          </div>
        </div>
      </article>
    `;
  }
}