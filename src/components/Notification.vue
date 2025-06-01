<template>
  <div v-if="visible" class="notification" :class="typeClass">
    <span class="notification-message">{{ message }}</span>
    <button @click="close" class="notification-close">×</button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value: string) => ['info', 'success', 'warning', 'error'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  }
});

const visible = ref(true);

const typeClass = ref('');

watch(
  () => props.type,
  (newType) => {
    typeClass.value = `notification-${newType}`;
  },
  { immediate: true }
);

const close = () => {
  visible.value = false;
};

setTimeout(close, props.duration);
</script>

<style scoped>
.notification {
  position: fixed;
  top: 1rem;
  right: 1rem;
  padding: 1rem 2rem;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.notification-message {
  margin-right: 1rem;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notification-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  margin: 0;
}

.notification-info {
  background-color: #007bff;
}

.notification-success {
  background-color: #28a745;
}

.notification-warning {
  background-color: #ffc107;
  color: #212529;
}

.notification-error {
  background-color: #dc3545;
}

/* Responsive design */
@media (max-width: 768px) {
  .notification {
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
  }

  .notification-message {
    font-size: 0.9rem;
  }

  .notification-close {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .notification {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
    width: calc(100% - 2rem);
    top: 0.5rem;
    right: 0.5rem;
    left: 0.5rem;
  }

  .notification-message {
    font-size: 0.8rem;
  }

  .notification-close {
    font-size: 1rem;
  }
}
</style>