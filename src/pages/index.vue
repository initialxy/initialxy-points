<template>
  <div>
    <h1>Welcome to initialxy-points</h1>
    <p>Track points earned by kids and redeem them for rewards.</p>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
}

/* Responsive design */
@media (max-width: 768px) {
  h1 {
    font-size: 1.5rem;
  }

  p {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.2rem;
  }

  p {
    font-size: 0.9rem;
  }
}
</style>