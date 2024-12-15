import { defineStore } from "pinia";
import axios from "../../node_modules/axios";
import QueryString from "qs";
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
    userId: "",
  }),
  getters: {
    loggedIn: (state) => state.username !== "",
    getUsername: (state) => state.username,
    getUserId: (state) => state.userId,
    getToken: (state) => state.token,
  },
  actions: {
    logOut() {
      this.username = "";
      this.userId = "";
      this.token = "";

      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("userId");

      axios.defaults.headers.common["Authorization"] = "";
    },
    autoLogin() {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      const userId = localStorage.getItem("userId");
      if (token && username && userId) {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;

        this.token = token;
        this.username = username;
        this.userId = userId;
      }
    },
    login(username, password) {
      return new Promise((resolve, reject) => {
        axios
          .post(
            "http://keycloak-route-oscar-dev.apps.inholland.hcs-lab.nl/realms/sail-amsterdam/protocol/openid-connect/token",
            QueryString.stringify({
              grant_type: "password",
              client_id: "public-client",
              scope: "email openid",
              username: username,
              password: password,
            }),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          )
          .then((res) => {
            console.log(
              "Server login response: " +
                "access_token: " +
                res.data.access_token +
                ", expires_in: " +
                res.data.expires_in
            );

            // Assign values from the response to the relevant properties
            this.token = res.data.access_token;
            this.refreshToken = res.data.refresh_token;
            this.tokenType = res.data.token_type;
            this.tokenExpiry = res.data.expires_in;

            // Decode the token to extract user details
            const decodedToken = jwtDecode(res.data.access_token);
            console.log("Decoded Token: ", decodedToken);

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
            localStorage.setItem("access_token", res.data.access_token);
            localStorage.setItem("refresh_token", res.data.refresh_token);
            localStorage.setItem("token_type", res.data.token_type);
            localStorage.setItem("token_expiry", res.data.expires_in);

            // Optionally store decoded token details for later use
            localStorage.setItem("username", this.username);
            localStorage.setItem("email", this.email);
            localStorage.setItem("roles", JSON.stringify(this.roles));

            resolve();
          })
          .catch((error) => reject(error));
      });
    },
    register(user) {
      axios
        .post("/users/register", user, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(
            "Server register response: " +
              res.data.id +
              " name:  " +
              res.data.username +
              " jwt:  " +
              res.data.jwt
          );

          this.username = res.data.username;
          this.userId = res.data.id;
          this.token = res.data.jwt;

          // Add the token to the axios instance
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + res.data.jwt;

          localStorage.setItem("token", res.data.jwt);
          localStorage.setItem("username", res.data.username);
          localStorage.setItem("userId", res.data.id);
        })
        .catch((error) => reject(error));
    },
  },
});
