<script setup lang="ts">
import { isPassed } from '~/state'

const show = ref(false)

watch(isPassed, (v) => {
  if (v) {
    setTimeout(() => {
      show.value = true
      /* 动画持续约 6s 后自动隐藏 */
      setTimeout(() => { show.value = false }, 6000)
    }, 300)
  }
})
</script>

<template>
  <Transition name="confetti-fade">
    <div v-if="show" class="confetti-container" aria-hidden="true">
      <div v-for="i in 60" :key="i" class="confetti-piece" :style="{
        '--x': `${Math.random() * 100}%`,
        '--delay': `${Math.random() * 3}s`,
        '--duration': `${2 + Math.random() * 3}s`,
        '--color': ['#5D8C7B', '#F2D091', '#F2A679', '#D9695F', '#8C4646'][Math.floor(Math.random() * 5)],
        '--size': `${6 + Math.random() * 6}px`,
        '--rot': `${Math.random() * 360}deg`,
      }" />
    </div>
  </Transition>
</template>

<style scoped>
.confetti-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}
.confetti-piece {
  position: absolute;
  top: -10px;
  left: var(--x);
  width: var(--size);
  height: calc(var(--size) * 0.6);
  background: var(--color);
  border-radius: 2px;
  opacity: 0.9;
  animation: confetti-fall var(--duration) ease-out var(--delay) infinite;
  transform: rotate(var(--rot));
}
@keyframes confetti-fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}
.confetti-fade-enter-active {
  transition: opacity 0.3s ease;
}
.confetti-fade-leave-active {
  transition: opacity 1s ease;
}
.confetti-fade-enter-from,
.confetti-fade-leave-to {
  opacity: 0;
}
</style>
