<template>
    <div class="contact-page">
      <!-- Hero / Banner Section -->
      <section class="contact-hero">
        <h1>Contact Us</h1>
        <p>
          We'd love to hear from you! Please fill out the form below and we’ll get back to you as soon as possible.
        </p>
      </section>
  
      <!-- Contact Form Section -->
      <section class="contact-form-section">
        <form class="contact-form" @submit.prevent="submitForm">
          <div class="form-group">
            <label for="name">Name</label>
            <input v-model="form.name" type="text" id="name" placeholder="Your name" required />
          </div>
  
          <div class="form-group">
            <label for="email">Email</label>
            <input v-model="form.email" type="email" id="email" placeholder="Your email" required />
          </div>
  
          <div class="form-group">
            <label for="subject">Subject</label>
            <input v-model="form.subject" type="text" id="subject" placeholder="Subject" required />
          </div>
  
          <div class="form-group">
            <label for="message">Message</label>
            <textarea v-model="form.message" id="message" placeholder="Your message" required></textarea>
          </div>
  
          <button type="submit">Send Message</button>
        </form>
      </section>
    </div>
  </template>
  
  <script setup>
  import { reactive } from 'vue'
  
  const form = reactive({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  
  function submitForm() {
    console.log('Form submitted:', form)
    
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  }
  </script>
  
  <style scoped>
  .contact-page {
    padding: 2rem;
    color: #fff;
    background-color: #1a1a1a;
    min-height: calc(100vh - 80px); 
  }
  
  .contact-hero {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .contact-hero h1 {
    margin: 0;
    font-size: 2.5rem;
  }
  
  .contact-hero p {
    margin: 1rem 0 0;
    font-size: 1.2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .contact-form-section {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .contact-form {
    background-color: #003c71;
    padding: 1.5rem;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  .contact-form label {
    margin-bottom: 0.5rem;
    font-weight: bold;
  }
  
  .contact-form input,
  .contact-form textarea {
    padding: 0.75rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .contact-form textarea {
    resize: vertical;
    min-height: 100px;
  }
  
  .contact-form button {
    background-color: #ffaa33;
    color: #003c71;
    border: none;
    padding: 0.75rem;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .contact-form button:hover {
    background-color: #e6951e;
  }
  </style>
  