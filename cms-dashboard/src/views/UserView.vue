<template>
  <div
    style="
      background-color: white;
      box-shadow: 5px 5px 10px rgb(0, 0, 0, 0.2);
      border: 1px solid rgb(187, 187, 187);
      border-radius: 1vh;
      width: 100%;
      margin: 1vw;
    "
  >
    <div style="padding: 2vw; display: flex; flex-direction: column; gap: 20px">
      <p
        style="
          margin-bottom: 0px !important;
          color: rgb(33, 37, 41);
          font-size: 22px;
        "
      >
        Users
      </p>
      <div style="font-size: 14px">
        <DataTable
          ref="table"
          :columns="columns"
          :options="options"
          :data="users"
          class="table display table-striped table-bordered align-middle"
          width="100%"
        />
      </div>
    </div>
  </div>

  <!-- Delete Modal -->
  <div
    class="modal fade"
    id="goToDashboardModal"
    tabindex="-1"
    style="z-index: 10000 !important"
    aria-labelledby="goToDashboardModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title" id="goToDashboardModalLabel">User Dashboard Redirect</h6>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          This dashboard does not support adding, editing or deleting users for security reasons. Would you like to go to the user dashboard to manage users?
        </div>
        <div class="modal-footer">
          <button
            class="btn-sm btn btn-primary"
            data-bs-dismiss="modal"
            @click="goToUserDashboard"
          >
            Go to User Dashboard
          </button>
          <button
            type="button"
            class="btn-sm btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { userStore } from "@/stores/user";
import DataTable from "datatables.net-vue3";
import DataTableBs5 from "datatables.net-bs5";

DataTable.use(DataTableBs5);

let dt;
const users = ref([]);
const table = ref();
const store = userStore();

const options = {
  responsive: true,
  select: true,
  columnDefs: [
    { className: "dt-center", targets: "_all" }, // Center align all columns
    {
      targets: 0,
      searchable: true,
      visible: false,
    },
  ],
};

const columns = [
  { data: "id", title: "" },
  { data: "firstName", title: "First Name" },
  { data: "function", title: "Function" },
  { data: "groupId", title: "Group" },
  { data: "lastName", title: "Last Name" },
  { data: "username", title: "Username" },
  { data: "roles", title: "Roles" },
  {
    data: null,
    title: "Edit",
    className: "center",
    orderable: false,
    width: "5%",
    render: function (row) {
      return `
        <svg width='25px' style="border-radius: 5px; padding: 5px; background-color: #909090;cursor: pointer" data-id="${row.id}" class="edit-link" data-bs-toggle="modal" data-bs-target="#goToDashboardModal" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="white" d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg>
      `;
    },
  },
];

onMounted(() => {
  dt = table.value.dt;

  loadData();
});

onUnmounted(() => {
  dt.destroy();
});

const loadData = async () => {
  try {
    // Replace 'your_token' with the actual token value
    const token = store.getToken; // Retrieve the token from localStorage or your preferred storage method

    const response = await fetch("/user/users", {
      method: "GET", // Use the appropriate HTTP method
      headers: {
        "Content-Type": "application/json", // Specify JSON content type if required
        Authorization: `Bearer ${token}`, // Include the Bearer token in the Authorization header
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const usersData = await response.json();
    users.value = usersData; // Assuming users is a reactive variable
  } catch (error) {
    console.error("Error fetching FAQs:", error);
  }
};

const goToUserDashboard = () => {
  const userDashboardUrl = "http://keycloak-route-oscar-dev.apps.inholland.hcs-lab.nl/realms/sail-amsterdam/account"; // Replace with your actual URL
  window.open(userDashboardUrl, "_blank"); // Opens in a new tab
};

</script>

<style scoped>
h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.button {
  padding: 0.5vw;
  background-color: rgba(1, 1, 1, 0.1);
  border: none;
  border-radius: 7px;
}

table.dataTable td {
  font-size: 10px !important;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Center modal */
  max-width: 500px;
}

.button.primary {
  background-color: rgba(0, 89, 255, 1);
  color: white;
}

.button.secondary {
  background-color: rgba(211, 211, 211, 1);
  color: black;
}

.button.danger {
  background-color: rgba(255, 0, 0, 1);
  color: white;
}

/* Add a fade-in animation for the modal */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -45%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

:root {
  --bs-primary: #ff0088; /* Replace with your desired primary color */
}

.center {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: center !important;
}

.rounded {
  border-radius: 1vw;
}
</style>
