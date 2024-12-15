<template>
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
          <form @submit.prevent="submitEdit">
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
</template>

<script setup>
import { mount } from "@vue/test-utils";
import { defineProps, defineEmits, onMounted } from "vue";

// Props to accept `selectedFaq` from parent
defineProps({
  selectedFaq: Object,
});

// Emits to notify parent of the save action
defineEmits(["submit"]);

// Method to handle the edit form submission
const submitEdit = () => {
  // Emit submit event to parent with the updated FAQ
  emit("submit");
};

onMounted(() => {
  console.log(selectedFaq)
});
</script>