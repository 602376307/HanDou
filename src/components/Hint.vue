<script setup lang="ts">
import { answer, dayNoHanzi, hint, parseWord } from '~/state'
import { meta } from '~/storage'
import { t } from '~/i18n'
import seedrandom from 'seedrandom'

/* 第一个提示字（来自答案的 hint 字段） */
const firstParsed = computed(() => parseWord(hint.value, answer.value.word)[0])
const firstMasked = computed(() => ({
  ...firstParsed.value,
  char: '?',
}))

/* 第二个提示字：从成语中随机取一个不同于初始提示字的汉字 */
const secondParsed = computed(() => {
  const word = answer.value.word
  const others = [...word].filter(c => c !== hint.value)
  const pick = others[Math.floor(seedrandom(`second-hint-${word}`)() * others.length)]
  return parseWord(pick, answer.value.word)[0]
})
const secondMasked = computed(() => ({
  ...secondParsed.value,
  char: '?',
}))
</script>

<template>
  <div p8 flex="~ col gap-4" items-center>
    <p><b>{{ dayNoHanzi }}</b></p>
    <div>
      {{ t('hint-note') }}
      <b>{{ meta.hintLevel === 3 || meta.hintLevel === 4 ? t('hanzi') : t('ziyin') }}</b>
    </div>
    <div flex gap-2 justify-center>
      <template v-if="meta.hintLevel === 1">
        <CharBlock :char="firstMasked" />
      </template>
      <template v-if="meta.hintLevel >= 2">
        <CharBlock v-if="meta.hintLevel === 2" :char="firstParsed" />
        <template v-if="meta.hintLevel === 3">
          <CharBlock :char="firstParsed" />
          <CharBlock :char="secondMasked" />
        </template>
        <template v-if="meta.hintLevel === 4">
          <CharBlock :char="firstParsed" />
          <CharBlock :char="secondParsed" />
        </template>
      </template>
    </div>
    <button
      v-if="meta.hintLevel !== 4"
      class="btn bg-mis"
      @click="meta.hintLevel = (meta.hintLevel || 1) + 1"
    >
      {{ t('more-hint') }}
    </button>
  </div>
</template>
