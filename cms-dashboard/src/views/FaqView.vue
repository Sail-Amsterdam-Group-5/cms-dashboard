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
        FAQs
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
          :columns="columns"
          :options="options"
          :data="faqs"
          class="table display table-striped table-bordered align-middle"
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
            <h6 class="modal-title" id="editModalLabel">Edit FAQ</h6>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleEditSubmit" id="editForm">
              <div class="mb-3">
                <label class="form-label">Category:</label>
                <input
                  type="hidden"
                  id="originalCategory"
                  name="originalCategory"
                  v-model="selectedFaq.originalCategory"
                />
                <input
                  v-model="selectedFaq.category"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Question:</label>
                <input
                  v-model="selectedFaq.question"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Answer:</label>
                <textarea
                  v-model="selectedFaq.answer"
                  type="text"
                  class="form-control"
                ></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="submit"
              class="btn-sm btn btn-primary"
              form="editForm"
            >
              Save
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
            <h6 class="modal-title" id="deleteModalLabel">Delete FAQ</h6>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <b style="margin: 5px">Are you sure you want to delete this FAQ?</b>
            <p style="margin: 5px; color: gray">
              Category: {{ selectedFaq.category }}
            </p>
            <p style="margin: 5px; color: gray">
              Question: {{ selectedFaq.question }}
            </p>
          </div>
          <div class="modal-footer">
            <button
              @click="handleDeleteConfirm"
              class="btn-sm btn btn-danger"
              data-bs-dismiss="modal"
            >
              Yes, Delete
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
import { userStore } from "@/stores/user";
import DataTable from "datatables.net-vue3";
import DataTableBs5 from "datatables.net-bs5";
import CreateModal from "@/components/CreateModal.vue";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";

DataTable.use(DataTableBs5);

const options = {
  responsive: true,
  select: true,
};

const createFormErrors = ref({
  category: "",
  question: "",
  answer: "",
});

const createModalFields = ref([
  { label: "Category", key: "category", type: "text" },
  { label: "Question", key: "question", type: "text" },
  { label: "Answer", key: "answer", type: "text" },
]);

const columns = [
  { data: "category", title: "Category" },
  { data: "question", title: "Question" },
  { data: "answer", title: "Answer", width: "50%" },
  {
    data: null,
    title: "Edit",
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
    title: "Delete",
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

const faqs = ref([]);
const selectedFaq = ref({
  category: "",
  originalCategory: "",
  question: "",
  answer: "",
});

const newFaq = ref({
  category: "",
  question: "",
  answer: "",
});

let dt;
const table = ref();

const store = userStore();

onMounted(() => {
  document.addEventListener("click", handleTableClick);
  dt = table.value.dt;
  dt.dataTable;
  const createModal = document.getElementById("createModal");
  createModal.addEventListener("hidden.bs.modal", clearNewFaq);

  loadData();
});

const loadData = async () => {
  try {
    // Replace 'your_token' with the actual token value
    const token = store.getToken; // Retrieve the token from localStorage or your preferred storage method

    const response = await fetch("/faqs", {
      method: "GET", // Use the appropriate HTTP method
      headers: {
        "Content-Type": "application/json", // Specify JSON content type if required
        Authorization: `Bearer ${token}`, // Include the Bearer token in the Authorization header
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const faqsData = await response.json();
    faqs.value = faqsData; // Assuming faqs is a reactive variable
  } catch (error) {
    console.error("Error fetching FAQs:", error);
  }
};

const handleTableClick = (event) => {
  const editLink = event.target.closest(".edit-link");
  const deleteLink = event.target.closest(".delete-link");

  if (editLink) {
    const faqId = editLink.dataset.id;
    const faq = faqs.value.find((f) => f.id === faqId);
    if (faq) {
      selectedFaq.value = { ...faq };
      selectedFaq.value.originalCategory = faq.category;
    }
  }

  if (deleteLink) {
    const faqId = deleteLink.dataset.id;
    const faq = faqs.value.find((f) => f.id === faqId);
    if (faq) {
      selectedFaq.value = faq;
    }
  }
};

const handleEditSubmit = async () => {
  try {
    await fetch(
      `/faqs/${selectedFaq.value.originalCategory}/${selectedFaq.value.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${store.getToken}`,
        },
        body: JSON.stringify(selectedFaq.value),
      }
    );
    loadData(); // Reload data
  } catch (error) {
    console.error("Error updating FAQ:", error);
  }
};

const handleDeleteConfirm = async () => {
  try {
    await fetch(`/faqs/${selectedFaq.value.category}/${selectedFaq.value.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${store.getToken}`,
      },
    });
    loadData(); // Reload data
  } catch (error) {
    console.error("Error deleting FAQ:", error);
  }
};

const handleCreateSubmit = async (formData) => {
  try {
    const response = await fetch(`/faqs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${store.getToken}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const createdFaq = await response.json();
      faqs.value.push(createdFaq.data);

      createFormErrors.value = { category: "", question: "", answer: "" };

      let myModalEl = document.querySelector("#createModal");
      let modal = bootstrap.Modal.getOrCreateInstance(myModalEl);
      modal.hide();
    } else {
      const errorData = await response.json();

      // Reset errors before setting new ones
      createFormErrors.value = { category: "", question: "", answer: "" };

      if (errorData.detail && Array.isArray(errorData.detail)) {
        errorData.detail.forEach((error) => {
          const field = error.loc[1];
          if (createFormErrors.value[field] !== undefined) {
            createFormErrors.value[field] = error.msg;
          }
        });
      } else {
        console.error("Unknown error:", errorData);
      }
    }
  } catch (error) {
    console.error("Error while creating FAQ:", error);
  }
};

function clearNewFaq() {
  newFaq.value.category = "";
  newFaq.value.question = "";
  newFaq.value.answer = "";

  createFormErrors.value = { category: "", question: "", answer: "" };
}
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

.rounded {
  border-radius: 1vw;
}
</style>
