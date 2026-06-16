<script setup lang="ts">
import '~/init'
import { answer } from '~/state'
import { colorblind } from '~/storage'

const { height } = useWindowSize()

watchEffect(() => {
  document.documentElement.style.setProperty('--vh', `${height.value / 100}px`)
})
</script>

<template>
  <main font-sans text="center gray-700 dark:gray-300" select-none :class="{ colorblind }">
    <Navbar />
    <div p="4">
      <NoQuizToday v-if="!answer.word" />
      <Play v-else />
    </div>
    <ModalsLayer />
    <Confetti />
  </main>
</template>
