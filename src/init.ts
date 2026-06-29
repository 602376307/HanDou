import { initialized, markEnd, markStart, meta, pauseTimer, getActiveGame, clearActiveGame, history, cleanEmptyHistoryRecords } from './storage'
import { answer, dayNo, isDev, isFinished, isPassed, showCheatSheet, showHelp } from './state'
import { t } from './i18n'
import { answers } from './answers/list'
import { START_DATE } from './logic/constants'
import { tryFixAnswer } from './logic/answer-fix'

useTitle(computed(() => `${t('name')} - ${t('description')}`))

if (!initialized.value)
  showHelp.value = true

/* 清理历史中已有的空记录 */
cleanEmptyHistoryRecords()

/* 恢复上次未完成的游戏状态 */
const savedGame = getActiveGame()
if (savedGame && savedGame.dayNo === dayNo.value) {
  const h = history.value[dayNo.value] || {}
  h.tries = savedGame.tries
  /* 恢复尝试次数，确保 isFailed 正确判断 */
  if (savedGame.tries.length > 0) {
    /* 只恢复已积累的时长，并把 start 设为当前时间，后续从此刻重新开始计时 */
    h.duration = savedGame.meta.duration || 0
    h.start = Date.now()
    h.hint = savedGame.meta.hint
    h.hintLevel = savedGame.meta.hintLevel
    h.strict = savedGame.meta.strict
  }
  history.value[dayNo.value] = h
}

watchEffect(() => {
  if (isPassed.value)
    meta.value.passed = true
})

watch([isFinished, meta], () => {
  if (isFinished.value) {
    markEnd()
    clearActiveGame() /* 游戏完成时清除记忆 */
  }
  // sendAnalytics()
}, { flush: 'post' })

watch(isFinished, (v) => {
  if (v)
    showCheatSheet.value = false
}, { flush: 'post' })

const visible = useDocumentVisibility()

let leaveTime = 0
const REFRESH_TIME = 1000 * 60 * 60 * 3 // 3 hours
watchEffect(() => {
  if (visible.value === 'visible') {
    // left for a long while, refresh the page for updates
    if (leaveTime && Date.now() - leaveTime > REFRESH_TIME)
      location.reload()

    // restart timer
    if (meta.value.duration)
      markStart()
  }
  else if (visible.value === 'hidden') {
    leaveTime = Date.now()
    pauseTimer()
  }
}, { flush: 'post' })

nextTick(() => {
  // if (acceptCollecting.value)
  //   sendAnalytics()

  tryFixAnswer(dayNo.value)
})

if (isDev || import.meta.hot) {
  const theDate = new Date(+START_DATE + dayNo.value * 86400000)
  // eslint-disable-next-line no-console
  console.log(`D${dayNo.value}`, theDate.toLocaleDateString(), answer.value.word, answer.value.hint)
}

if (import.meta.hot) {
  // eslint-disable-next-line no-console
  console.log(`${answers.length} days prepared`)
  // eslint-disable-next-line no-console
  console.log(`${answers.length - dayNo.value} days left`)
  if ((answers.length - dayNo.value) < 10)
    // eslint-disable-next-line no-console
    console.warn('剩余题目不足！')
}
