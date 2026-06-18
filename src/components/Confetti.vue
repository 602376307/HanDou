<script setup lang="ts">
import { isPassed } from '~/state'

/* 动态导入 canvas-confetti，避免库初始化异常导致整页白屏 */
async function congrats() {
  try {
    const confetti = (await import('canvas-confetti')).default
    const defaults = {
      colors: [
        '#5D8C7B',
        '#F2D091',
        '#F2A679',
        '#D9695F',
        '#8C4646',
      ],
      shapes: ['square'],
      ticks: 500,
    } as Parameters<typeof confetti>[0]
    confetti({
      ...defaults,
      particleCount: 80,
      spread: 100,
      origin: { y: 0 },
    })
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 50,
        angle: 60,
        spread: 80,
        origin: { x: 0 },
      })
    }, 250)
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 50,
        angle: 120,
        spread: 80,
        origin: { x: 1 },
      })
    }, 400)
  }
  catch (e) {
    console.warn('彩纸动画加载失败，不影响游戏进行', e)
  }
}

watch(isPassed, (v) => {
  if (v)
    setTimeout(congrats, 300)
}, { flush: 'post' })
</script>

<template>
  <div />
</template>
