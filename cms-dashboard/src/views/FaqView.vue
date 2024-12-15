<template>
  <div
    style="
      background-color: white;
      border-radius: 1vh;
      border: 1px solid rgb(187, 187, 187);
      width: 100%;
      margin: 1vw;
    "
  >
    <div style="padding: 3vw; display: flex; flex-direction: column; gap: 20px">
      <h1 style="margin-bottom: 0px !important">FAQs</h1>
      <button
        class="btn btn-primary w-25"
        data-bs-toggle="modal"
        data-bs-target="#createModal"
      >
        Add new
      </button>
      <div style="font-size: 14px">
        <DataTable
          ref="table"
          :columns="columns"
          :options="options"
          :data="faqs"
          class="table display"
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
            <h5 class="modal-title" id="editModalLabel">Edit FAQ</h5>
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
                <label class="form-label">Category:</label>
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
                <input
                  v-model="selectedFaq.answer"
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
            <h5 class="modal-title" id="deleteModalLabel">Delete FAQ</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this FAQ?</p>
            <p><strong>Category:</strong> {{ selectedFaq.category }}</p>
            <p><strong>Question:</strong> {{ selectedFaq.question }}</p>
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

  <!-- Create Modal -->
  <div
    class="modal fade"
    id="createModal"
    style="z-index: 10000 !important"
    tabindex="-1"
    aria-labelledby="createModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="createModalLabel">Create FAQ</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleCreateSubmit">
            <div class="mb-3">
              <label class="form-label">Category:</label>
              <input
                v-model="newFaq.category"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': createFormErrors.category }"
              />
              <div class="invalid-feedback">
                {{ createFormErrors.category }}
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Question:</label>
              <input
                v-model="newFaq.question"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': createFormErrors.question }"
              />
              <div class="invalid-feedback">
                {{ createFormErrors.question }}
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Answer:</label>
              <input
                v-model="newFaq.answer"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': createFormErrors.answer }"
              />
              <div class="invalid-feedback">{{ createFormErrors.answer }}</div>
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
</template>

<script setup>
import { ref, onMounted } from "vue";
import DataTable from "datatables.net-vue3";
import DataTableBs5 from "datatables.net-bs5";
import $ from "jquery"

// import "bootstrap/dist/css/bootstrap.min.css";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";

DataTable.use(DataTableBs5);

const options = {
  responsive: true,
  select: true
};

const createFormErrors = ref({
  category: "",
  question: "",
  answer: "",
});

const columns = [
  { data: "category", title: "Category" },
  { data: "question", title: "Question" },
  { data: "answer", title: "Answer", width: "50%", },
  {
    data: null,
    title: "Edit",
    className: "center",
    width: "5%",
    render: function (row) {
      return `
        <a style="text-decoration: none; cursor: pointer;  color: rgba(0, 89, 255); background-color: rgba(0, 89, 255, 0.2); border-radius: 3px; padding: 5px; height: auto;" data-id="${row.id}" class="edit-link" data-bs-toggle="modal" data-bs-target="#editModal">edit</a>
      `;
    },
  },
  {
    data: null,
    title: "Actions",
    className: "center",
    width: "5%",
    render: function (data, type, row) {
      return `
        <a style="text-decoration: none; cursor: pointer;  color: rgba(255, 0, 0); background-color: rgba(255, 0, 0, 0.2); border-radius: 3px; padding: 5px; height: auto;" data-id="${row.id}" class="delete-link" data-bs-toggle="modal" data-bs-target="#deleteModal">delete</a>
      `;
    },
  },
];

const faqs = ref([]);
const selectedFaq = ref({
  category: "",
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

onMounted(() => {
  document.addEventListener("click", handleTableClick);

  dt = table.value.dt;

  dt.dataTable

  const createModal = document.getElementById("createModal");
  createModal.addEventListener("hidden.bs.modal", clearNewFaq);

  loadData();
});

const loadData = async (callback) => {
  try {
    const response = await fetch("/faqs");
    const faqsData = await response.json();
    faqs.value = faqsData;
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
    await fetch(`/faqs/${selectedFaq.value.category}/${selectedFaq.value.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedFaq.value),
    });
    loadData(); // Reload data
  } catch (error) {
    console.error("Error updating FAQ:", error);
  }
};

const handleDeleteConfirm = async () => {
  try {
    await fetch(`/faqs/${selectedFaq.value.category}/${selectedFaq.value.id}`, {
      method: "DELETE",
    });
    loadData(); // Reload data
  } catch (error) {
    console.error("Error deleting FAQ:", error);
  }
};

const handleCreateSubmit = async () => {
  try {
    const response = await fetch(`/faqs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newFaq.value),
    });

    if (response.ok) {
      faqs.value.push({
        category: newFaq.value.category,
        question: newFaq.value.question,
        answer: newFaq.value.answer,
      });

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
          const field = error.loc[1]; // The field name (e.g., "category", "question")
          if (createFormErrors.value[field] !== undefined) {
            createFormErrors.value[field] = error.msg; // Set the error message for the field
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
  console.log("Clearing new FAQ...");
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
</style>
