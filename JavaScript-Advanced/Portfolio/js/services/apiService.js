import { Profile } from '../models/Profile.js';
import { Project } from '../models/Project.js';

class ApiService {
  async fetchProfile() {
    try {
      const response = await fetch('./data/profile.json');
      if (!response.ok) throw new Error('Could not fetch profile');
      const data = await response.json();
      return new Profile(data);  
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }
  
   async fetchProjects() {
    try {
      const response = await fetch('./data/projects.json');
      if (!response.ok) throw new Error('Could not fetch projects');
      const data = await response.json();
      return data.map(projectData => new Project(projectData));
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }
}


export default new ApiService();