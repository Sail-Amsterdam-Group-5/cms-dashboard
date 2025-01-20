<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      gap: 1vw;
      width: 100%;
      padding: 1vw;
    "
  >
    <div
      style="
        background-color: white;
        box-shadow: 5px 5px 10px rgb(0, 0, 0, 0.1);
        border: 1px solid rgb(187, 187, 187);
        border-radius: 1vh;
        width: 100%;
      "
    >
      <div
        style="padding: 2vw; display: flex; flex-direction: column; gap: 20px"
      >
        <div style="display: flex; flex-direction: column; gap: 20px">
          <p style="font-size: 22px; margin-bottom: 0px !important">
            Utilities
          </p>
          <button
            class="btn btn-primary btn-sm w-100"
            data-bs-toggle="modal"
            data-bs-target="#createModal"
          >
            + Add new
          </button>
          <div style="font-size: 14px">
            <DataTable
              ref="table"
              :columns="utilitiesColumns"
              :options="options"
              :data="utilities"
              class="table display table-striped table-bordered align-middle"
              width="100%"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      class="modal fade"
      id="editModal"
      style="z-index: 10000 !important"
      tabindex="-1"
      aria-labelledby="editModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editModalLabel">Edit Location</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleEditSubmit">
              <div class="mb-3">
                <label class="form-label">Name:</label>
                <input
                  v-model="selectedUtility.name"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Description:</label>
                <input
                  v-model="selectedUtility.description"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Location:</label>
                <select
                  v-if="locations.length && selectedUtility.location"
                  v-model="selectedUtility.location.id"
                  class="form-select"
                >
                  <option selected :value="selectedUtility.location.id">
                    {{ selectedUtility.location.name }}
                  </option>
                  <option
                    v-for="location in locations"
                    :key="location.id"
                    :value="location.id"
                  >
                    {{ location.name }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Type:</label>
                <input
                  v-model="selectedUtility.type"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Dates:</label>
                <input
                  v-model="selectedUtility.dates"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="modal-footer">
                <button type="submit" class="btn btn-primary">Save</button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div
      class="modal fade"
      id="deleteModal"
      tabindex="-1"
      style="z-index: 10000 !important"
      aria-labelledby="deleteModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel">Delete Utility</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this utility?</p>
            <p>
              <strong>Longitude:</strong>
              {{ selectedUtility.name }}
            </p>
            <p>
              <strong>Latitude:</strong>
              {{ selectedUtility.description }}
            </p>
          </div>
          <div class="modal-footer">
            <button
              @click="handleDeleteConfirm"
              class="btn btn-danger"
              data-bs-dismiss="modal"
            >
              Yes, Delete
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <CreateModal
      modalId="createModal"
      title="Create New Utility"
      :fields="createModalFields"
      :errors="createFormErrors"
      @submit="handleCreateSubmit"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import DataTable from "datatables.net-vue3";
import DataTableBs5 from "datatables.net-bs5";
import CreateModal from "@/components/CreateModal.vue";
import { userStore } from "@/stores/user";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";

DataTable.use(DataTableBs5);

let dt;
const table = ref();

const options = {
  responsive: true,
  select: true,
  columnDefs: [
    { className: "dt-center", targets: "_all" }, // Center align all columns
    { visible: false, targets: 0 },
  ],
};

const utilities = ref([]);
const locations = ref([]);

const selectedUtility = ref({ utility: {} });

const store = userStore();

const createFormErrors = ref({
  name: "",
  description: "",
  locationId: "",
  type: "",
  dates: "",
});

const utilitiesColumns = [
  { data: "id", title: "ID" },
  { data: "name", title: "Name" },
  { data: "description", title: "Description" },
  { data: "location.name", title: "Location" },
  { data: "type", title: "Type" },
  { data: "dates", title: "Dates" },
  {
    data: null,
    title: "",
    className: "center",
    orderable: false,
    width: "5%",
    render: function (row) {
      return `
        <svg width='25px' style="border-radius: 5px; padding: 5px; background-color: #909090;cursor: pointer" data-id="${row.id}" class="edit-link" data-bs-toggle="modal" data-bs-target="#editModal" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="white" d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg>
      `;
    },
  },
  {
    data: null,
    title: "",
    className: "center",
    orderable: false,
    width: "5%",
    render: function (row) {
      return `
      <svg width='25px' style="border-radius: 5px; padding: 5px; background-color: #ff3d3d;cursor: pointer" data-id="${row.id}" class="delete-link" data-bs-toggle="modal" data-bs-target="#deleteModal" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="white" d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
      `;
    },
  },
];

onMounted(() => {
  document.addEventListener("click", handleTableClick);

  dt = table.value.dt;

  loadUtilities();
  loadLocations();
});

const loadUtilities = async () => {
  try {
    const response = await fetch("/api/map/utilities");
    utilities.value = await response.json();
    console.log("Utilities:", utilities.value);
  } catch (error) {
    console.error("Error fetching utilities:", error);
  }
};

const loadLocations = async () => {
  try {
    const response = await fetch("/locations", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${store.getToken}`
      },
    });
    locations.value = await response.json();
  } catch (error) {
    console.error("Error fetching locations:", error);
  }
};

const handleTableClick = (event) => {
  const editLink = event.target.closest(".edit-link");
  const deleteLink = event.target.closest(".delete-link");

  if (editLink) {
    const utilityId = editLink.dataset.id;
    const utility = utilities.value.find((f) => f.id === utilityId);
    if (utility) {
      selectedUtility.value = { ...utility };
    }
  }

  if (deleteLink) {
    const utilityId = deleteLink.dataset.id;
    const utility = utilities.value.find((f) => f.id === utilityId);
    if (utility) {
      selectedUtility.value = utility;
    }
  }
};

// Computed property for location select options
const createModalLocationSelectOptions = computed(() =>
  locations.value.length
    ? locations.value.map((location) => ({
        label: location.name,
        value: location.id,
      }))
    : [{ label: "Loading locations...", value: "" }]
);

// Create Modal Fields
const createModalFields = computed(() => [
  { label: "Name", key: "name", type: "text" },
  { label: "Description", key: "description", type: "text" },
  {
    label: "Location",
    key: "locationId",
    type: "select",
    options: createModalLocationSelectOptions.value,
  },
  { label: "Dates", key: "dates", type: "text" },
  { label: "Type", key: "type", type: "text" },
]);

const handleEditSubmit = async () => {
  // PUT request to update location
  const formattedData = {
    name: selectedUtility.value.name,
    description: selectedUtility.value.description,
    locationId: selectedUtility.value.location.id,
    type: selectedUtility.value.type,
    dates: selectedUtility.value.dates,
  };

  try {
    const response = await fetch(`/utilities/${selectedUtility.value.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedData),
    });

    if (response.ok) {
      // Update the utility in the utilities array
      const updatedUtility = await response.json(); // Get the updated utility from the response
      const index = utilities.value.findIndex(
        (f) => f.id === updatedUtility.id
      );
      utilities.value[index] = updatedUtility;

      // Close the modal
      let myModalEl = document.querySelector("#editModal");
      let modal = bootstrap.Modal.getOrCreateInstance(myModalEl);
      modal.hide();
    } else {
      console.error("Error updating utility:", response);
    }
  } catch (error) {
    console.error("Error updating utility:", error);
  }
};

const handleDeleteConfirm = async () => {
  // DELETE request for location
  try {
    const response = await fetch(`/utilities/${selectedUtility.value.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      // Remove the utility from the utilities array
      utilities.value = utilities.value.filter(
        (f) => f.id !== selectedUtility.value.id
      );

      // Close the modal
      let myModalEl = document.querySelector("#deleteModal");
      let modal = bootstrap.Modal.getOrCreateInstance(myModalEl);
      modal.hide();
    } else {
      console.error("Error deleting utility:", response);
    }
  } catch (error) {
    console.error("Error deleting utility:", error);
  }
};

const handleCreateSubmit = async (formData) => {
  console.log("Form data before submission:", formData);
  const formattedData = {
    name: formData.name,
    description: formData.description,
    locationId: formData.locationId,
    type: formData.type,
    dates: formData.dates,
  };
  console.log("Form data after submission:", formattedData);

  try {
    const response = await fetch(`/utilities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedData),
    });

    if (response.ok) {
      // Add the newly created utility to the utilities array
      const createdUtility = await response.json(); // Get the created utility from the response

      // Add the newly created utility to the utilities array
      utilities.value.push(createdUtility);

      console.log("utilities after pushing: ", utilities.value);

      // Clear the form errors
      createFormErrors.value = { latitude: "", longitude: "", imageURL: "" };

      // Close the modal
      let myModalEl = document.querySelector("#createModal");
      let modal = bootstrap.Modal.getOrCreateInstance(myModalEl);
      modal.hide();
    } else {
      const errorData = await response.json();

      // Reset errors before setting new ones
      createFormErrors.value = { latitude: "", longitude: "", imageURL: "" };

      // Handle validation errors from the API
      if (errorData.detail && Array.isArray(errorData.detail)) {
        errorData.detail.forEach((error) => {
          const field = error.loc[1];
          if (createFormErrors.value[field] !== undefined) {
            createFormErrors.value[field] = error.msg; // Set the error message for the field
          }
        });
      } else {
        console.error("Unknown error:", errorData);
      }
    }
  } catch (error) {
    console.error("Error while creating the utility:", error);
  }
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

.button {
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 14px;
  border: none;
  cursor: pointer;
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
</style>
