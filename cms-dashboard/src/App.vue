<script setup>
import Sidebar from "@/components/Sidebar.vue";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net-dt";

import { useRoute } from "vue-router"; // Import useRoute for accessing route information
import { userStore } from "./stores/user";

DataTable.use(DataTablesCore);

const route = useRoute(); // Get the current route
const store = userStore() // Get the Pinia store instance

store.autoLogin();

</script>

<template>
  <div style="display: flex; flex-direction: row">
    <!-- Conditionally show Sidebar if not on the /login route -->
    <Sidebar v-if="route.path !== '/sign-in'" />
    <RouterView />
  </div>
</template>
