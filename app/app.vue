<template>
  <UApp>
    <NuxtLayout :name="loggedIn ? 'default' : 'login'">
      <NuxtPage :class="{ 'ios-navigation': isNativeNavigation && $device.isIos }"/>
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
const { loggedIn } = useUserSession()
const router = useRouter()

const isNativeNavigation: Ref<boolean> = ref(false)

router.beforeEach((to, from, next) => {
  isNativeNavigation.value = false
  next()
})

onMounted(() => {
  window.addEventListener('popstate', (event: Event) => {
    console.log(event);
    isNativeNavigation.value = true
  })
})
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
  position: absolute;
  width: 100%;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
.page-enter-from {
  transform: translateX(10rem);
}
.page-leave-to {
  transform: translateX(-10rem);
}

.ios-navigation.page-enter-active,
.ios-navigation.page-leave-active {
  transition: none 0s;
}
</style>