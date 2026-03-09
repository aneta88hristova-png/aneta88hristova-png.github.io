export const createElement = (tag, className = '', innerHTML = '') => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (innerHTML) element.innerHTML = innerHTML;
  return element;
};

export const clearSection = (selector) => {
  const section = document.querySelector(selector);
  if (section) {
    section.innerHTML = '';
  }
  return section;
};

export const showLoading = (container) => {
  const loadingEl = createElement('div', 'loading', 'Loading...');
  container.innerHTML = '';
  container.appendChild(loadingEl);
};

export const showError = (container, message = 'Something went wrong. Please try again later.') => {
  const errorEl = createElement('div', 'error-message', message);
  container.innerHTML = '';
  container.appendChild(errorEl);
};

export const renderProjects = (container, projects) => {
  if (!container) return;
  
  if (!projects || projects.length === 0) {
    showError(container, 'No projects to display');
    return;
  }
  
  container.innerHTML = projects.map(project => project.toHtml()).join('');
};

export const renderProfile = (profileElements, profile) => {
  if (!profile) return;
  
  if (profileElements.name) {
    profileElements.name.textContent = profile.name;
  }
  
  if (profileElements.title) {
    profileElements.title.textContent = profile.title;
  }
  
  if (profileElements.bio) {
    profileElements.bio.textContent = profile.bio;
  }
  
  if (profileElements.skills && profile.getSkillList) {
    profileElements.skills.innerHTML = profile.getSkillList();
  }
};