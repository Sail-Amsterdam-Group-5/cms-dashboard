import { defineStore } from "pinia";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const userStore = defineStore("store", {
  state: () => ({
    token: "",
    refreshToken: "",
    tokenType: "",
    tokenExpiry: "",
    username: "",
    email: "",
    roles: "",
  }),
  getters: {
    loggedIn: (state) => state.username !== "",
    getUsername: (state) => state.username,
    getEmail: (state) => state.email,
    getToken: (state) => state.token,
  },
  actions: {
    logOut() {
      this.username = "";
      this.token = "";
      this.refreshToken = "";
      this.tokenType = "";
      this.tokenExpiry = "";
      this.roles = "";

      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("token_type");
      localStorage.removeItem("token_expiry");
      localStorage.removeItem("username");
      localStorage.removeItem("userId");
      localStorage.removeItem("roles");

      axios.defaults.headers.common["Authorization"] = "";

      console.log("You have been logged out.");
      console.log(localStorage.getItem("username"));
      console.log(this.loggedIn);
    },

    autoLogin() {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      const email = localStorage.getItem("email");

      if (token && username && email) {
        // Ensure that all values are properly set
        this.token = token;
        this.username = username;
        this.email = email;
        axios.defaults.headers.common["Authorization"] = "Bearer " + token; // Set the token globally for requests
      } else {
        // If there's no valid session, reset state
        this.token = "";
        this.username = "";
        this.email = "";
      }
    },

    login(username, password) {
      return new Promise((resolve, reject) => {
        // Construct the form data in URL-encoded format
        const formData = new URLSearchParams();
        formData.append("grant_type", "password"); // Hardcoded grant_type
        formData.append("client_id", "public-client"); // Hardcoded client_id
        formData.append("scope", "email openid"); // Hardcoded scope
        formData.append("username", username); // Provided by user
        formData.append("password", password); // Provided by user

        // Send the POST request using axios
        axios
          .post("http://nginx-service-oscar-dev.apps.inholland.hcs-lab.nl/login", formData, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded", // Specify content type
            },
          })
          .then((res) => {
            // Assign values from the response to the relevant properties
            this.token = res.data.access_token;
            this.refreshToken = res.data.refresh_token;
            this.tokenType = res.data.token_type;
            this.tokenExpiry = res.data.expires_in;

            // Decode the token to extract user details
            const decodedToken = jwtDecode(res.data.access_token);

            // Access user-specific details from the token
            this.username =
              decodedToken.username || decodedToken.preferred_username;
            this.email = decodedToken.email;
            this.roles =
              decodedToken.resource_access.account.roles || decodedToken.scope;

            // Add the token to the axios instance so that it is sent with every request
            axios.defaults.headers.common["Authorization"] =
              res.data.token_type + " " + res.data.access_token;

            // Store the token and other relevant data in localStorage
            localStorage.setItem("token", res.data.access_token);
            localStorage.setItem("refresh_token", res.data.refresh_token);
            localStorage.setItem("token_type", res.data.token_type);
            localStorage.setItem("token_expiry", res.data.expires_in);

            // Optionally store decoded token details for later use
            localStorage.setItem("username", this.username);
            localStorage.setItem("email", this.email);
            localStorage.setItem("roles", JSON.stringify(this.roles));

            resolve(); // Resolve the promise on success
          })
          .catch((error) => reject(error)); // Reject the promise on error
      });
    },
  },
});
