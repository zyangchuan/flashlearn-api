<template>
  <div class="relative w-[240px] h-[172.5px] xl:w-[410px] xl:h-[297.5px]">
    <div 
      v-for="card in cards"
      :key="card.text"
      class="w-[210px] h-[142.5px]
        rounded-xl
        drop-shadow-[0_10px_15px_rgba(0,0,0,0.10)]
        absolute
        flex justify-center items-center
        xl:w-[350px] xl:h-[237.5px]"
      :class="[card.position, card.color]"
    >
      <p class="text-2xl font-medium">{{ card.text }}</p>
    </div>
    <div class="w-32 h-32 xl:w-52 xl:h-52 border-2 border-green-400 flex justify-center items-center absolute -bottom-10 -right-10 xl:-bottom-16 xl:-right-16 z-30">
      3D model
    </div>
  </div>
</template>

<script setup>
const positions = {
  first: "top-[30px] right-[30px] xl:top-[60px] xl:right-[60px] z-30",
  second: "top-[15px] right-[15px] xl:top-[30px] xl:right-[30px] z-20",
  third: "top-0 right-0 z-10"
}

const cards = [
  { text: "Card 1", color: "bg-blue-300", position: positions.first },
  { text: "Card 2", color: "bg-blue-300/[0.6]", position: positions.second },
  { text: "Card 3", color: "bg-blue-300/[0.3]", position: positions.third }
]

</script>