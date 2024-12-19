<template>
  <aside class="sidebar">
    <nav class="menu">
      <ul class="menu">
        <li>
          <button @click="goToHome" class="menu-item">
            Home
          </button>
        </li>
        <li>
          <button @click="this.$router.push('/faq');" class="menu-item">
            FAQs
          </button>
        </li>
        <li>
          <button @click="this.$router.push('/schedule');" class="menu-item">
            Schedule
          </button>
        </li>
        <li>
          <button @click="this.$router.push('/users');" class="menu-item">
            Users
          </button>
        </li>
        <li>
          <button @click="this.$router.push('/map');" class="menu-item">
            Map
          </button>
        </li>
        <li>
          <button @click="logout" class="menu-item logout">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
import { userStore } from '@/stores/user';

export default {
  name: "Sidebar",
  setup() {
    const store = userStore();
    return { store };
  },
  methods: {
    goToHome() {
      // Redirect to home page
      this.$router.push('/');
    },
    logout() {
      // Clear user data and redirect to login page
      this.store.logOut();
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.sidebar {
  min-width: 15vw;
  min-height: 100vh;
  background-color: rgb(42, 42, 42);
  color: white;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.menu {
  list-style-type: none;
  padding: 0;
}

.menu-item {
  width: 100%;
  padding: 10px 20px;
  margin: 10px 0;
  text-align: left;
  background-color: transparent;
  border: none;
  color: #ecf0f1;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.menu-item:hover {
  background-color: #3d3d3d;
}
</style>
