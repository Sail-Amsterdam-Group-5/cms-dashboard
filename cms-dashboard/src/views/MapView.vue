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
    <div style="padding: 3vw; display: flex; flex-direction: column; gap: 20px">
      <h1 style="margin-bottom: 0px !important">Map</h1>
      <button
        class="btn btn-primary w-25"
        data-bs-toggle="modal"
        data-bs-target="#createModal"
      >
        + Add new
      </button>
      <div style="font-size: 14px">
        <DataTable
          ref="table"
          :columns="columns"
          :options="options"
          :data="locations"
          class="table display table-striped"
          width="100%"
        />
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
                <label class="form-label">Longitude:</label>
                <input
                  v-model="selectedLocation.location.longitude"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Latitude:</label>
                <input
                  v-model="selectedLocation.location.latitude"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Image URL:</label>
                <input
                  v-model="selectedLocation.imageURL"
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
            <h5 class="modal-title" id="deleteModalLabel">Delete Location</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this location?</p>
            <p>
              <strong>Longitude:</strong>
              {{ selectedLocation.location.longitude }}
            </p>
            <p>
              <strong>Latitude:</strong>
              {{ selectedLocation.location.latitude }}
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
  </div>

  <CreateModal
    modalId="createModal"
    title="Create New Location"
    :fields="createModalFields"
    :errors="createFormErrors"
    @submit="handleCreateSubmit"
  />
</template>

<script setup>
import { ref, onMounted } from "vue";
import DataTable from "datatables.net-vue3";
import DataTableBs5 from "datatables.net-bs5";
import CreateModal from "@/components/CreateModal.vue";

import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";

DataTable.use(DataTableBs5);

const createModalFields = ref([
  { label: "Longitude", key: "longitude", type: "text" },
  { label: "Latitude", key: "latitude", type: "text" },
  { label: "Image URL", key: "imageURL", type: "url" },
]);

let dt;
const table = ref();

const options = {
  responsive: true,
  select: true,
};

const locations = ref([]);

const selectedLocation = ref({ location: {}, imageURL: "" });

const createFormErrors = ref({
  longitude: "",
  latitude: "",
  imageURL: "",
});

const columns = [
  { data: "id", title: "ID" },
  { data: "location.longitude", title: "Longitude" },
  { data: "location.latitude", title: "Latitude" },
  {
    data: "imageURL",
    title: "Image URL",
    render: function (row) {
      return `
      <img src="${row}" alt="Image" style="max-width: 100px; max-height: 100px;">
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
    render: function (data, type, row) {
      return `
      <svg width='25px' style="border-radius: 5px; padding: 5px; background-color: #ff3d3d;cursor: pointer" data-id="${row.id}" class="delete-link" data-bs-toggle="modal" data-bs-target="#deleteModal" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="white" d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
      `;
    },
  },
];

onMounted(() => {
  document.addEventListener("click", handleTableClick);

  dt = table.value.dt;
  
  dt.dataTable;

  loadData();
});

const loadData = async () => {
  try {
    console.log("loading data...");
    const response = await fetch("/locations");
    locations.value = await response.json();
    console.log("response: ", locations.value);
  } catch (error) {
    console.error("Error fetching locations:", error);
  }
};

const handleTableClick = (event) => {
  const editLink = event.target.closest(".edit-link");
  const deleteLink = event.target.closest(".delete-link");

  if (editLink) {
    const locationId = editLink.dataset.id;
    const location = locations.value.find((f) => f.id === locationId);
    if (location) {
      selectedLocation.value = { ...location };
    }
  }

  if (deleteLink) {
    const locationId = deleteLink.dataset.id;
    const location = locations.value.find((f) => f.id === locationId);
    if (location) {
      selectedLocation.value = location;
    }
  }
};

const handleEditSubmit = async () => {
  // PUT request to update location
};

const handleDeleteConfirm = async () => {
  // DELETE request for location
};

const handleCreateSubmit = async (formData) => {
  console.log("Form data before submission:", formData);
  const formattedData = {
    location: {
      latitude: formData.latitude,
      longitude: formData.longitude,
    },
    imageURL: formData.imageURL,
  };
  console.log("Form data after submission:", formattedData);

  try {
    const response = await fetch(`/locations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedData), // Replace `newFaq` with `newLocation`
    });

    if (response.ok) {
      // Add the newly created location to the locations array
      const createdLocation = await response.json(); // Get the created location from the response

      // Add the newly created location to the locations array
      locations.value.push(createdLocation);

      console.log("Locations after pushing: ", locations.value);

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
          const field = error.loc[1]; // The field name (e.g., "latitude", "longitude", "imageURL")
          if (createFormErrors.value[field] !== undefined) {
            createFormErrors.value[field] = error.msg; // Set the error message for the field
          }
        });
      } else {
        console.error("Unknown error:", errorData);
      }
    }
  } catch (error) {
    console.error("Error while creating location:", error);
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
