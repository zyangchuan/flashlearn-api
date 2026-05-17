<template>
  <div>
    <div class="progress-circle__container">
      <span class="progress-circle__percent text-xl text-primary-950 dark:text-primary-dark-100">{{ props.text }}</span>
      <svg class="progress-circle" viewBox="0 0 106 106" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g stroke="none" fill="none" fill-rule="evenodd">
          <g transform="translate(-17.000000, -17.000000)">
            <circle class="circle" :class="[strokeWidth, circleColor]" fill-rule="nonzero" cx="70" cy="70" r="50"></circle>
            <path class="progress-circle__path" :class="[strokeWidth, strokeColor]" :stroke-dasharray="circle" d="M70,120 C97.6142375,120 120,97.6142375 120,70 C120,42.3857625 97.6142375,20 70,20 C42.3857625,20 20,42.3857625 20,70 C20,97.6142375 42.3857625,120 70,120 Z" id="Oval-Copy" fill-rule="nonzero" stroke-linecap="round" transform="translate(70.000000, 70.000000) rotate(-125.000000) translate(-70.000000, -70.000000) "></path>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  percent: { type: Number },
  text: { type: String },
  width: { type: String },
  height: { type: String },
  strokeWidth: { type: String, default: '8px' },
  circleColor: { type: String, default: 'stroke-primary-100 dark:stroke-primary-dark-800' },
  strokeColor: { type: String, default: 'stroke-primary-400' },
  duration: { type: String, default: '0.5s' }
})

const circle = computed(() => {
  return (props.percent * 100 * Math.PI) + ',9999';
})
</script>

<style scoped>
.progress-circle {
  width: 100%;
  height: 100%;
  padding: 2px;
  transform: scaleX(-1) rotate(-55deg);
}

.progress-circle__percent {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}

.progress-circle__container {
  width: v-bind(width);
  height: v-bind(height);
  position: relative;
}

.circle {
  stroke-width: v-bind(strokeWidth);
}

.progress-circle__path {
  stroke-width: v-bind(strokeWidth);
  transition: v-bind(duration) ease-in-out all;
}
</style>