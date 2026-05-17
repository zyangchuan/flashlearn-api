<template>
  <div class="w-screen max-w-[430px] p-8 rounded-xl bg-white dark:bg-neutral-900 moveUp">
    <slot/>
    <div>
      <slot name="header"></slot>
    </div>
    <div class="mt-5">
      <slot name="main" class="mt-5"></slot>
    </div>
    <div class="mt-10 flex items-center justify-end">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.moveUp {
  animation: moveUp 200ms ease-out forwards;
}

@keyframes moveUp {
  from {
    transform: translateY(100px)
  }
  to {
    transform: translateY(0)
  }
}
</style>