# 🧑‍🎓 Homework Task: Personal Portfolio Website

**Deadline:** `09.03.2026 (preferably)`  
**Submission:** Send the GitHub Pages URL via `email` or as `comment` on the Trello task

---

## 🎯 Objective

Build a fully functional **personal portfolio website** using HTML, CSS, and JavaScript. Your data must be stored in `.json` files and loaded dynamically via `fetch()`. The final site must be live and publicly accessible via **GitHub Pages**.

---

## 📋 Requirements

### 1. General Structure

Your portfolio must include the following sections:

- **Hero / Header** — Your name, title (e.g. "Frontend Developer"), and a short bio
- **About** — A brief description of yourself, skills, and background
- **Projects** — A showcase of at least 3 projects
- **Skills** — A visual or structured list of your technical skills
- **Contact** — Contact information or a simple contact form (non-functional is acceptable)
> ⭐ **Bonus — Functional Contact Form:** Wire up your contact form using
> [EmailJS](https://www.emailjs.com/) so it sends a real email without a backend.
---

### 2. Technologies

You must use the following technologies:

- **HTML5** — Semantic markup (`<section>`, `<article>`, `<nav>`, etc.)
- **CSS3** — Custom styling; use of CSS variables, Flexbox and/or Grid is expected
- **Vanilla JavaScript (ES6+)** — DOM manipulation, event handling, async/await, modules

- At least **one external library**, for example:
  - [Bootstrap](https://getbootstrap.com/) — responsive grid, components, and utility classes
  - [Animate.css](https://animate.style/) — CSS animations
  - [AOS (Animate On Scroll)](https://michalsnik.github.io/aos/) — scroll-triggered animations
  - [Swiper.js](https://swiperjs.com/) — touch-friendly sliders/carousels
  - [Font Awesome](https://fontawesome.com/) — icons
  - [Particles.js](https://vincentgarreau.com/particles.js/) — animated background

> You are free to use additional libraries as needed

---

### 3. JSON Data & Fetch

All dynamic content **must be stored in `.json` files** and loaded using the `fetch()` API. You must have at least **two `.json` files**.

For example:

**`data/projects.json`**
```json
[
  {
    "id": 1,
    "title": "E-Commerce App",
    "description": "A full-stack shopping app built with Node.js and MongoDB.",
    "tech": ["HTML", "CSS", "JavaScript", "Node.js"],
    "image": "images/project1.png",
    "github": "https://github.com/yourusername/project",
    "live": "https://yourproject.live"
  }
]
```

**`data/profile.json`**
```json
{
  "name": "Your Name",
  "title": "Frontend Developer",
  "bio": "Passionate about building clean, user-friendly web experiences.",
  "skills": ["JavaScript", "HTML", "CSS", "Git", "REST APIs"],
  "email": "you@email.com",
  "github": "https://github.com/yourusername",
  "linkedin": "https://linkedin.com/in/yourusername"
}
```

Your JavaScript must fetch and render this data dynamically into the DOM. **No hardcoded content** in HTML for the sections that have a corresponding `.json` source.

Example fetch pattern:
```js
async function loadProjects() {
  const response = await fetch('./data/projects.json');
  const projects = await response.json();
  renderProjects(projects);
}
```

---

### 4. Code Quality

Since you have completed Advanced JavaScript, the following is expected:

- Use **ES6+ syntax** throughout (`const`/`let`, arrow functions, template literals, destructuring, spread, etc.)
- Organize your JS into **separate files or modules** — see the suggested file structure for guidance
- Avoid spaghetti code — use **functions with single responsibilities**
- Handle **fetch errors** gracefully (try/catch or `.catch()`)
- Use **higher-order functions** (`map`, `filter`, `reduce`, `sort`...) when processing data — avoid manual `for` loops where a cleaner alternative exists
- **Map raw JSON responses to model objects** before passing them to render functions - keep your data shape consistent and predictable
- Your code should be readable and reasonably commented and documented

---

### 5. Design & UX

- The website must be **responsive** (works on both desktop and mobile)
- Use a consistent color palette and typography
- Avoid placeholder/dummy content — this should represent **you**
- Smooth scrolling and basic hover effects are a plus
- Add a **Personal Touch** — this is your portfolio, not a template.
  Your design should reflect your personality, style, or the kind of developer you want to be.

---

## 🌐 Portfolio Guides, Inspiration & Examples

Use these resources to get inspired before you start designing:

| Resource | Link |
|---|---|
| "How to Build a Web Developer Portfolio" — freeCodeCamp | [freecodecamp.org](https://www.freecodecamp.org/news/how-to-build-a-developer-portfolio-website/) |
| Awwwards Portfolio Examples | [awwwards.com/websites/portfolio](https://www.awwwards.com/websites/portfolio/) |
| Brittany Chiang's Portfolio | [brittanychiang.com](https://brittanychiang.com) |
| Matt Farley's Portfolio | [mattfarley.ca](https://mattfarley.ca) |
| Figma Templates | [templates](https://www.figma.com/community/portfolio-templates) |2

> Take note of layout choices, section ordering, color usage, and how they present projects - then make it your own.

---

## 🚀 Hosting with GitHub Pages

Your portfolio **must be hosted live** using GitHub Pages. Follow these steps:

1. Create a GitHub repository named `portfolio` (or `yourusername.github.io` for a root domain)
2. Push all your project files to the `main` branch
3. Go to your repository → **Settings** → **Pages**
4. Under **Source**, select `main` branch and `/ (root)` folder, then click **Save**
5. Wait a minute — your site will be live at:
   `https://yourusername.github.io/portfolio/`

> ⚠️ **Important:** Make sure all your `fetch()` paths are **relative** (e.g. `./data/projects.json`), not absolute, so they work correctly when hosted.

---

## 📦 File Structure (Example)

```
portfolio/
├── index.html
├── css/
│   └── style.css
|
├── js/
│   ├── main.js
│   ├── services/
│   │   ├── apiService.js    # All fetch() calls — fetchProjects, fetchProfile...
│   │   │                    # Maps raw JSON responses through models before returning
│   │   └── emailService.js  # EmailJS logic — buildTemplate, validate, sendContactEmail...
|   |
│   ├── models/
│   │   ├── Project.js  # Class: properties (id, title, description, tech..) & methods (getTechBadges, hasLiveDemo, toHtmlCard)
│   │   │
│   │   └── Profile.js  # Class: properties (name, title, bio, skills..) &  methods (getInitials, getSkillList, getSocialLinks...)
│   │
│   └── utils/
│       ├── render.js (DOM helpers: createElement, clearSection etc..)                 
│       │
│       └── formatters.js (truncateText, formatDate...)
│
├── data/
│   ├── profile.json
│   └── projects.json
|
├── images/
│   └── ...
|
└── README.md
```

---

## ✅ Submission Checklist

Before submitting, verify:

- [ ] All sections are present (Hero, About, Projects, Skills, Contact)
- [ ] At least 2 `.json` files with data fetched via `fetch()`
- [ ] At least one external library integrated
- [ ] Site is responsive on mobile
- [ ] Code uses ES6+ features and is well-structured
- [ ] Fetch errors are handled
- [ ] Site is live on GitHub Pages
- [ ] GitHub repository is **public**
- [ ] `README.md` includes a short description and the live URL

---

### 🚀 Good luck - this is your chance to build something you'll actually use! 🙌