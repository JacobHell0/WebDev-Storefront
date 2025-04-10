<template>
  <div class="about-page">
    <!-- Hero / Banner Section -->
    <section class="hero">
      <h1>About Us</h1>
      <p>
        Welcome to our store! We’re dedicated to providing the best products
        and services to our customers.
      </p>
    </section>

    <!-- Company Info -->
    <section class="company-info">
      <h2>CAPJAS</h2>
      <p>
        Cutting-Edge Affordable Products: Just Amazing Stuff. <br />
        We deliver top-quality electrons for all your needs! Shipping across the
        world, wherever, whenever you want!
      </p>
      <p>
        Whether you’re here for our best-selling items or looking to learn more
        about us, we’re thrilled you’ve decided to stop by!
      </p>
    </section>

    <!-- Team / People Section -->
    <section class="team">
      <h2>Meet the Team</h2>
      <div class="team-members">

        <div class="member-card">
          <!-- Replace image with letter -->
          <div class="member-letter">C</div>
          <h3>Caleb Radbourne</h3>
          <p>Front-End Developer</p>
        </div>

        <div class="member-card">
          <div class="member-letter">A</div>
          <h3>Aaron James</h3>
          <p>Back-End Developer</p>
        </div>

        <div class="member-card">
          <div class="member-letter">P</div>
          <h3>Patrick Baguisa</h3>
          <p>Front-End Developer</p>
        </div>

        <div class="member-card">
          <div class="member-letter">J</div>
          <h3>Jacob Rempel</h3>
          <p>Back-End Developer</p>
        </div>

        <div class="member-card">
          <div class="member-letter">A</div>
          <h3>Ayaan Mustafa</h3>
          <p>Front-End Developer</p>
        </div>

        <div class="member-card">
          <div class="member-letter">S</div>
          <h3>Suhrab Roeen</h3>
          <p>Front-End Developer</p>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
// No special script needed unless you want state or lifecycle events
</script>

<style scoped>
/* General about-page wrapper */
.about-page {
  padding: 1rem;
  color: #ffffff; /* adjust to your theme */
  background-color: #1a1a1a; /* or match your site’s background */
}

/* Hero section styling */
.hero {
  text-align: center;
  background: #003c71; /* your brand color */
  padding: 2rem 1rem;
  margin-bottom: 2rem;
  border-radius: 8px;
}

.hero h1 {
  margin: 0 0 1rem;
}

.hero p {
  max-width: 600px;
  margin: 0 auto;
  font-size: 1.1rem;
}

/* Company info section */
.company-info {
  margin-bottom: 2rem;
  text-align: center;
}

.company-info h2 {
  margin-bottom: 0.5rem;
}

/* Team section */
.team h2 {
  margin-bottom: 1rem;
  text-align: center;
}

.team-members {
  display: flex;
  flex-wrap: wrap; /* allows multiple rows on small screens */
  gap: 1.5rem;
  justify-content: center;
}

.member-card {
  background: #002b55; /* brand color or contrast color */
  padding: 1rem;
  border-radius: 8px;
  width: 200px; /* fixed width or use max-width for responsiveness */
  text-align: center;
}

/* Replace the team member image with a letter */
.member-letter {
  background-color: #66baff; /* lighter color for contrast */
  color: #003c71;
  font-size: 40px;
  font-weight: bold;
  width: 80px;
  height: 80px;
  line-height: 80px; /* centers the letter vertically */
  margin: 0 auto 0.5rem;
  border-radius: 50%; /* creates a perfect circle */
}
</style>
