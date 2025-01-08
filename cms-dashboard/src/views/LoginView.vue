<template>
  <section
    class="bg-light"
    style="
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 1vh;
      width: 100%;
      height: 100vh;
    "
  >
    <div class="col-md-6 mb-4">
      <div class="w-100 mt-4 d-flex flex-column align-items-center">
        <img
          src="/images/Sail-2025-logo.png"
          alt="logo"
          style="width: 200px; cursor: pointer"
          @click="this.$router.replace('/')"
        />
        <h2
          class="text-danger text-center pt-2 pb-4"
          @click="this.$router.replace('/')"
          style="cursor: pointer"
        >
          SAIL 2025 Volunteer App CMS
        </h2>
      </div>
      <form
        class="text-dark bg-white p-4"
        style="border-radius: 5px; border: 1px solid rgb(171 171 171);"
      >
        <div class="mb-3">
          <label for="inputUsername" class="form-label">Username</label>
          <input
            v-model="username"
            id="inputUsername"
            type="text"
            class="form-control"
          />
        </div>
        <div class="mb-3">
          <label for="inputPassword" class="form-label">Password</label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            id="inputPassword"
          />
        </div>
      </form>
      <div class="w-100 d-flex justify-content-end align-content-center">
        <a
          href="/"
          class="text-danger mb-0"
          style="line-height: 40px; text-decoration: none"
          >Forgot Password?</a
        >
      </div>
      <div class="w-100 d-flex justify-content-center">
        <button
          style="min-width: 100%; color: white"
          type="button"
          class="btn bg-dark"
          @click="login()"
        >
          Login
        </button>
      </div>
      <div
        class="w-100 d-flex justify-content-center mt-4 align-content-center"
      >
        <p class="text-dark mb-0" style="text-align: center">
          Forgot your password?&nbsp;<a
            href="/register"
            style="text-decoration: none"
            class="text-danger"
            >Reset it here!</a
          >
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import { userStore } from "../stores/user";

export default {
  name: "Login",
  setup() {
    const store = userStore();
    return { store };
  },
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    login() {
      this.store
        .login(this.username, this.password)
        .then((res) => {
          if (res === false) {
            alert("Invalid username or password");
          } else {
            console.log(this.store.loggedIn);
            this.$router.replace("/");
          }
        })
        .catch((error) => {
          this.errorMessage = error;
        });
    },
  },
};
</script>

<style></style>
