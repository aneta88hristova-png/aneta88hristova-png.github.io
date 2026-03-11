class EmailService {
  constructor() {
    this.EMAILJS_PUBLIC_KEY = '5ByEAfNKO6_WL57Vr';
    this.EMAILJS_SERVICE_ID = 'service_s8ezn6c';
    this.EMAILJS_TEMPLATE_ID = 'template_f7nkvqe';
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    
    try {
      await this.loadEmailJS();
      emailjs.init(this.EMAILJS_PUBLIC_KEY);
      this.initialized = true;
    } catch (error) {
      throw new Error('Failed to initialize email service');
    }
  }

  loadEmailJS() {
    return new Promise((resolve, reject) => {
      if (window.emailjs) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  buildTemplate(name, email, message) {
    return {
      from_name: name,
      from_email: email,
      message: message,
      to_name: 'Aneta',
      reply_to: email
    };
  }

  validateForm(name, email, message) {
    const errors = [];
    
    if (!name || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    }
    
    if (!message || message.trim().length < 10) {
      errors.push('Message must be at least 10 characters');
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  async sendContactEmail(formData) {
    try {
      await this.init();
      
      const validation = this.validateForm(
        formData.name, 
        formData.email, 
        formData.message
      );
      
      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors
        };
      }

      const templateParams = this.buildTemplate(
        formData.name,
        formData.email,
        formData.message
      );

      const response = await emailjs.send(
        this.EMAILJS_SERVICE_ID,
        this.EMAILJS_TEMPLATE_ID,
        templateParams
      );

      if (response.status === 200) {
        return {
          success: true,
          message: 'Thank you for your message! I will get back to you soon.'
        };
      } else {
        throw new Error('Could not send message');
      }

    } catch (error) {
      return {
        success: false,
        errors: ['A technical error occurred. Please try again later.']
      };
    }
  }
}

export default new EmailService();