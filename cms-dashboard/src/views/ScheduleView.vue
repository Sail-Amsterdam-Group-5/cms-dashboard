<template>
  <div
    style="
      background-color: white;
      border-radius: 1vh;
      width: 100%;
      margin: 1vw;
    "
  >
    <div style="padding: 3vw; display: flex; flex-direction: column; gap: 20px">
      <h1 style="margin-bottom: 0px !important">Schedule</h1>
      <div style="font-size: 14px">
        <DataTable
          :columns="columns"
          :options="options"
          :data="data"
          class="table display"
          width="100%"
        />
      </div>
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addModal">
        Add new
      </button>
    </div>

    <!-- Edit Modal -->
    <div
      class="modal fade"
      id="editModal"
      style="z-index: 10000 !important;"
      tabindex="-1"
      aria-labelledby="editModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editModalLabel">Edit FAQ</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleEditSubmit">
              <div class="mb-3">
                <label class="form-label">Category:</label>
                <input v-model="selectedFaq.category" type="text" class="form-control" />
              </div>
              <div class="mb-3">
                <label class="form-label">Question:</label>
                <input v-model="selectedFaq.question" type="text" class="form-control" />
              </div>
              <div class="mb-3">
                <label class="form-label">Answer:</label>
                <input v-model="selectedFaq.answer" type="text" class="form-control" />
              </div>
              <div class="modal-footer">
                <button type="submit" class="btn btn-primary">Save</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
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
      style="z-index: 10000 !important;"
      aria-labelledby="deleteModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel">Delete FAQ</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this item?</p>
            <p><strong>Category:</strong> {{ selectedFaq.category }}</p>
            <p><strong>Question:</strong> {{ selectedFaq.question }}</p>
          </div>
          <div class="modal-footer">
            <button @click="handleDeleteConfirm" class="btn btn-danger" data-bs-dismiss="modal">
              Yes, Delete
            </button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import DataTable from "datatables.net-vue3";
import DataTableBs5 from "datatables.net-bs5";

// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";

DataTable.use(DataTableBs5);

const options = {
  responsive: true,
  select: true,
};

const columns = [
  { data: "name", title: "name" },
  { data: "surname", title: "surname" },
  { data: "email", title: "email" },
  {
    data: null,
    title: "Edit",
    render: function (data, type, row) {
      return `
        <a style="text-decoration: underline; color: rgba(0, 89, 255);" data-id="${row.id}" class="edit-link" data-bs-toggle="modal" data-bs-target="#editModal">edit</a>
      `;
    },
  },
  {
    data: null,
    title: "Actions",
    render: function (data, type, row) {
      return `
        <a style="text-decoration: underline; color: rgba(255, 0, 0);" data-id="${row.id}" class="delete-link" data-bs-toggle="modal" data-bs-target="#deleteModal">delete</a>
      `;
    },
  },
];

const data = ref([

])

const faqs = ref([]);
const selectedFaq = ref({
  category: '',
  question: '',
  answer: '',
});

onMounted(() => {
  document.addEventListener("click", handleTableClick);
});

const loadData = async (data, callback, settings) => {
  try {
    const response = await fetch("/faqs");
    const faqsData = await response.json();
    callback({ data: faqsData });
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
</style>
