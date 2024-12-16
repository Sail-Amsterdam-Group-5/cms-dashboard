<template>
  <div
    class="modal fade"
    :id="modalId"
    tabindex="-1"
    style="z-index: 10000 !important"
    :aria-labelledby="`${modalId}Label`"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" :id="`${modalId}Label`">{{ title }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div v-for="(field, index) in fields" :key="index" class="mb-3">
              <label class="form-label">{{ field.label }}</label>
              <input
                v-model="formData[field.key]"
                :type="field.type || 'text'"
                :class="['form-control', field.class || '']"
              />
              <span v-if="formErrors[field.key]" class="text-danger small">
                {{ formErrors[field.key] }}
              </span>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary">
                {{ submitText }}
              </button>
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
import { ref, watch, onMounted } from 'vue';

// Props
const props = defineProps({
  modalId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: 'Create',
  },
  fields: {
    type: Array,
    default: () => [],
  },
  submitText: {
    type: String,
    default: 'Save',
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
});

// Local state
const formData = ref({});  // Initialize formData as an empty object
const formErrors = ref({ ...props.errors });

// Watch for props changes to update the errors
watch(
  () => props.errors,
  (newErrors) => {
    formErrors.value = { ...newErrors };
  }
);

// Emitters
const emit = defineEmits(['submit']);

// Methods
const handleSubmit = () => {
  emit('submit', formData.value);  // Emit the updated formData
};

// Reset form on modal close
onMounted(() => {
  const modalElement = document.getElementById(props.modalId);
  modalElement?.addEventListener('hidden.bs.modal', () => {
    formData.value = {}; // Reset form data to empty object
    formErrors.value = {}; // Clear errors
  });
});
</script>

<style scoped>
.text-danger {
  font-size: 0.875rem;
}
</style>
