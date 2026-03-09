export class Profile {
  constructor(data) {
    this.name = data.name || '';
    this.title = data.title || '';
    this.bio = data.bio || '';
    this.about = data.about || '';
    this.skills = data.skills || [];
    this.email = data.email || '';
    this.github = data.github || '';
    this.linkedin = data.linkedin || '';
    this.location = data.location || '';
    this.phone = data.phone || '';  
  }
  
  getInitials() {
    if (!this.name) return '';
    return this.name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
  
  getSkillList() {
    return this.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('');
  }
  
  getSocialLinks() {
    return {
      github: this.github,
      linkedin: this.linkedin,
      email: this.email
    };
  }
}