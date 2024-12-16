import { defineStore } from "pinia";
import axios from "axios";
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
      const userId = localStorage.getItem("userId");
  
      if (token && username && userId) {
        // Ensure that all values are properly set
        this.token = token;
        this.username = username;
        this.userId = userId;
        axios.defaults.headers.common["Authorization"] = "Bearer " + token; // Set the token globally for requests
      } else {
        // If there's no valid session, reset state
        console.log("No valid user session found.");
        this.token = "";
        this.username = "";
        this.userId = "";
      }
    },
    login(username, password) {
      return new Promise((resolve, reject) => {
        console.log("Loggin in...");
        // axios
        //   .post(
        //     "http://keycloak-route-oscar-dev.apps.inholland.hcs-lab.nl/realms/sail-amsterdam/protocol/openid-connect/token",
        //     QueryString.stringify({
        //       grant_type: "password",
        //       client_id: "public-client",
        //       scope: "email openid",
        //       username: username,
        //       password: password,
        //     }),
        //     {
        //       headers: {
        //         "Content-Type": "application/x-www-form-urlencoded",
        //       },
        //     }
        //   )
        //   .then((res) => {
        //     console.log(
        //       "Server login response: " +
        //         "access_token: " +
        //         res.data.access_token +
        //         ", expires_in: " +
        //         res.data.expires_in
        //     );

        //     // Assign values from the response to the relevant properties
        //     this.token = res.data.access_token;
        //     this.refreshToken = res.data.refresh_token;
        //     this.tokenType = res.data.token_type;
        //     this.tokenExpiry = res.data.expires_in;

        //     // Decode the token to extract user details
        //     const decodedToken = jwtDecode(res.data.access_token);
        //     console.log("Decoded Token: ", decodedToken);

        //     // Access user-specific details from the token
        //     this.username =
        //       decodedToken.username || decodedToken.preferred_username;
        //     this.email = decodedToken.email;
        //     this.roles =
        //       decodedToken.resource_access.account.roles || decodedToken.scope;

        //     // Add the token to the axios instance so that it is sent with every request
        //     axios.defaults.headers.common["Authorization"] =
        //       res.data.token_type + " " + res.data.access_token;

        //     // Store the token and other relevant data in localStorage
        //     localStorage.setItem("access_token", res.data.access_token);
        //     localStorage.setItem("refresh_token", res.data.refresh_token);
        //     localStorage.setItem("token_type", res.data.token_type);
        //     localStorage.setItem("token_expiry", res.data.expires_in);

        //     // Optionally store decoded token details for later use
        //     localStorage.setItem("username", this.username);
        //     localStorage.setItem("email", this.email);
        //     localStorage.setItem("roles", JSON.stringify(this.roles));

        // Access user-specific details from the token
        this.username = "john.doe"; // Fake username
        this.email = "john.doe@example.com"; // Fake email
        this.roles = ["teamlead"]; // Fake roles
        this.userId = "1234";

        // Add the token to the axios instance so that it is sent with every request
        axios.defaults.headers.common["Authorization"] =
          "Bearer faketoken123456"; // Fake token for testing

        // Store the token and other relevant data in localStorage
        localStorage.setItem("token", "faketoken123456"); // Fake access token
        localStorage.setItem("refresh_token", "fakerefresh123456"); // Fake refresh token
        localStorage.setItem("token_type", "Bearer"); // Fake token type
        localStorage.setItem("token_expiry", "3600"); // Fake token expiry (in seconds)

        // Optionally store decoded token details for later use
        localStorage.setItem("username", this.username); // Fake username
        localStorage.setItem("email", this.email); // Fake email
        localStorage.setItem("userId", this.userId); // Fake email
        localStorage.setItem("roles", JSON.stringify(this.roles)); // Fake roles

        console.log(this.username + '\n'+
          this.email+ '\n' +
          this.roles + '\n' + 
          this.userId + '\n' +
          'local values: \n userId ' + this.getUserId + 'username: ' + this.getUsername + 'token: ' + this.getToken
        );

        resolve();
      }).catch((error) => reject(error));
    },
  }
});
