<template>
  <main class="full-page">
    <!-- HEADER -->
    <header>
      <div class="header-container">
        <!-- Logo (Left Column) -->
        <div class="header-name-logo">
          <Logo class="logo-svg" />
        </div>

        <!-- Search Bar (Center Column) -->
        <div class="search-bar-container">
          <input type="text" placeholder="Search..." />
        </div>

        <!-- Navigation (Right Column) -->
        <nav class="header-nav">
          <ul>
            <li><RouterLink to="/">Home</RouterLink></li>
            <li><RouterLink to="/cart">Cart</RouterLink></li>
            <li><RouterLink to="/status">Server Test (Debug)</RouterLink></li>
            <li v-if="!isLoggedIn"><RouterLink to="/login">Login</RouterLink></li>
            <li v-if="isLoggedIn"><RouterLink to="/profile">Profile</RouterLink></li>
          </ul>
        </nav>
      </div>
    </header>

    <!-- MAIN CONTENT -->
    <div class="content">
      <RouterView />
    </div>

    <!-- FOOTER -->
    <footer>
      <div class="footer-container">
        <RouterLink to="/about">About</RouterLink>
        <span> | </span>
        <RouterLink to="/contact">Contact</RouterLink>
      </div>
    </footer>
  </main>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, ref } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import Logo from './components/Logo.vue'

const isLoggedIn = ref(false)
onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user
  })
})
</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.full-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  max-width: 100%;
}

/* HEADER */
header {
  background-color: #003C71;
  color: white;
  padding: 1rem;
  width: 100%;
  /* position: fixed; */
  position: sticky;
  top: 0;
  left: 0;
  z-index: 10;
}

/* Grid layout for header:
   - Left: Logo
   - Center: Search Bar
   - Right: Nav Links
*/
.header-container {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  width: 100%;
  gap: 1rem;
}

.header-name-logo {
  display: flex;
  align-items: center;
}

/* Responsive, scalable logo */
.logo-svg {
  width: clamp(60px, 20vw, 300px);
  height: auto;
  transition: width 0.3s ease;
}

/* Center Search Bar */
.search-bar-container {
  width: 100%;
  max-width: 400px;
  justify-self: center;
}

.search-bar-container input {
  padding: 8px;
  border-radius: 4px;
  width: 100%;
}

/* Right Navigation */
.header-nav {
  justify-self: end;
}

.header-nav ul {
  display: flex;
  gap: 16px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.header-nav a {
  color: white;
  padding: 8px 16px;
  text-decoration: none;
}

.header-nav a:hover {
  text-decoration: underline;
}

.header-nav a.router-link-exact-active {
  background-color: #E75D2A;
}

/* MAIN CONTENT */
.content {
  flex: 1;
  overflow-y: auto;
  padding-top: 0;
  width: 100%;
  box-sizing: border-box;
}

header{
  margin-bottom: 0;
}

/* FOOTER */
footer {
  background-color: #003C71;
  color: white;
  padding: 1rem;
  width: 100%;
  margin-top: auto;
  flex-shrink: 0;
}

.footer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.footer-container a {
  color: white;
  text-decoration: none;
}

.footer-container a:hover {
  text-decoration: underline;
}
</style>
