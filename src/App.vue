<!-- Modified to allow login and check login status. If a profile is logged in, it can view profile if, if not, it can choose login -->

<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { onMounted, ref } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Logo from './components/Logo.vue';

//Check the status of user authentication
const isLoggedIn = ref(false);
onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user;
  });
});

</script>
<template>
  <main class="full-page">
    <header>
      <div class="header-container">
        <!-- Logo/Site Name -->
        <div class="header-name-logo">
          <Logo class ="logo"/>
          <h1></h1>
        </div>

        <!-- Search Bar -->
        <div class="search-bar-container">
          <input type="text" placeholder="Search..." />
        </div>

        <!-- Navbar -->
        <nav>
          <ul>
            <li><RouterLink to="/">Home</RouterLink></li>
            <li><RouterLink to="/cart">Cart</RouterLink></li>
            <li><RouterLink to="/status">Server Test (Debug)</RouterLink></li>
            <!-- Show Login link only if NOT logged in -->
            <li><RouterLink v-if="!isLoggedIn" to="/login">Login</RouterLink></li>
            <!-- Show Profile link ONLY IF LOGGED IN -->
            <li><RouterLink v-if="isLoggedIn" to="/profile">Profile</RouterLink></li>
          </ul>
        </nav>
      </div>
    </header>

    <div class="content">
      <RouterView />
    </div>

    <footer>
      <div class="footer-container">
          <RouterLink to="/about">About</RouterLink>
          <span> | </span>
          <RouterLink to="/contact">Contact</RouterLink>
      </div>
    </footer>
  </main>

</template>

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

.main-content {
  flex: 1;
  padding-top: 80px;
}

header {
  background-color: #003C71;
  color: white;
  padding: 1rem;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
}

.header-container {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  min-width: auto ;
}

.header-name-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo {
  width: 40px;
  height: 40px;
}

h1 {
  font-size: 24px;
}

.search-bar-container {
  justify-self: center;
  width: 100%;
  max-width: 300px;
}

.search-bar-container input {
  padding: 8px;
  border-radius: 4px;
  width: 100%;
}

.header-nav {
  justify-self: end;
}

nav ul {
  display: flex;
  gap: 16px;
  list-style: none;
  padding: 0;
  margin: 0;
}

nav a {
  color: white;
  padding: 8px 16px;
}

nav a:hover {
  text-decoration: underline;
}

nav a.router-link-exact-active {
  background-color: #E75D2A;
}

/* Footer Styling */
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
  width: 100%;
  gap: 0.5rem;
  min-width: auto;
}

.footer-container a {
  color: white;
  text-decoration: none;
}

.footer-container a:hover {
  text-decoration: underline;
}

.content{
  flex: 1;
  overflow-y: auto;
  padding-top: 71.99px;
  width: 100%;
  box-sizing: border-box;
}
</style>