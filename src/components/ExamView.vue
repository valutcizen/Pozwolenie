<template>
  <QuestionCard
    v-if="examFinished === false"
    :answer-selected="answerSelected"
    :card-title="'Pytanie ' + (currentIndex + 1) + ' z 20'"
    :exam-mode="true"
    :infinite="false"
    :question="question"
    :show-source="false"
    @answer="onAnswerSelected"
    @next="next"
  />
  <QuestionCard
    v-else
    :answer-selected="answers[currentIndex]"
    :card-title="'Pytanie ' + (questionIdx + 1)"
    :exam-mode="false"
    :infinite="false"
    :question="indexedQuestion"
    :show-source="true"
    @next="currentIndex = (currentIndex + 1) % 20"
  />

  <div v-if="!examFinished" class="mt-4 d-flex justify-center">
    <v-card
      style="min-width: 200px; max-width: 800px; margin: 0 auto;"
      variant="tonal"
    >
      <v-card-text class="text-center" style="font-size: 1.2em;">
        ⏳ Pozostały czas: <span :style="{ color: timeLeftMinutes < 5 ? 'red' : undefined }">{{ formattedTimeLeft }}</span>
      </v-card-text>
    </v-card>
  </div>

  <StatsCard
    v-if="examFinished"
    :clickable="true"
    :stats="stats"
    :time-override="timeOverride"
    @row-click="currentIndex = $event"
  />

  <v-dialog v-model="showResultDialog" max-width="400">
    <v-card>
      <v-card-title class="text-center">
        <span v-if="examPassed" style="color:green">Egzamin zdany 🎉</span>
        <span v-else style="color:red">Egzamin niezdany</span>
      </v-card-title>
      <v-card-text class="text-center">
        <div>Poprawnych odpowiedzi: <b>{{ correctCount }}</b></div>
        <div>Błędnych odpowiedzi: <b>{{ 20 - correctCount }}</b></div>
        <div>Procent poprawnych: <b>{{ percentCorrect }}%</b></div>
        <div>Wymagany procent poprawnych: <b>90%</b></div>
        <div>Czas: <b>{{ formattedExamTime }}</b></div>
      </v-card-text>
      <v-card-actions>
        <v-btn block color="primary" @click="showResultDialog = false">Zamknij</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import type { IndexedQuestion } from '../model/indexedQuestion'
  import type QuestionsData from '../model/questionData'
  import type StatsData from '../model/statsData'
  import type QuestionList from '../services/questionList'
  import { computed, onMounted, onUnmounted, ref } from 'vue'
  import QuestionCard from './QuestionCard.vue'
  import StatsCard from './StatsCard.vue'

  const props = defineProps<{
    questionList: QuestionList
    questionData: QuestionsData
  }>()

  const emit = defineEmits<{
    (e: 'answered', stats: StatsData): void
    (e: 'reset'): void
  }>()

  const errorQuestion = {
    question: 'Błąd wczytywania pytania',
    answers: [''],
    correct: 0,
    is_last: true,
    index: 0,
  } as IndexedQuestion

  const question = ref<IndexedQuestion>(props.questionList.getNextQuestion() || errorQuestion)
  const answerSelected = ref<undefined | number>(undefined)
  const stats = ref<StatsData>(props.questionList.getStats())
  const answers = ref<number[]>(Array.from({ length: 20 }).fill(0) as number[])
  const currentIndex = ref(0)
  const examFinished = ref(false)
  const timeOverride = ref<number | undefined>(undefined)
  const timeLeft = ref(30 * 60 * 1000)
  const showResultDialog = ref(false)
  let timer: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    timer = setInterval(() => {
      if (!examFinished.value && timeLeft.value <= 0) {
        finishExam()
        clearInterval(timer!)
      }
      if (!examFinished.value) {
        timeLeft.value -= 1000
      }
    }, 1000)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  function onAnswerSelected (value: number) {
    answerSelected.value = value
    stats.value = props.questionList.getStats()
    emit('answered', stats.value)
  }

  function next () {
    if (answerSelected.value !== undefined) {
      props.questionList.answered(question.value.correct === answerSelected.value)
      answers.value[currentIndex.value] = answerSelected.value
      currentIndex.value++
      if (currentIndex.value >= 20) {
        finishExam()
        return
      }
      question.value = props.questionList.getNextQuestion() || errorQuestion
      answerSelected.value = undefined
    }
  }

  function finishExam () {
    examFinished.value = true
    currentIndex.value = 0
    timeOverride.value = Date.now() - stats.value.currentSessionStartTime
    showResultDialog.value = true
  }

  const questionIdx = computed(() => {
    return stats.value.questionIdx[currentIndex.value]
  })

  const indexedQuestion = computed(() => {
    return { ...props.questionData.questions[questionIdx.value],
             index: questionIdx.value,
             is_last: false,
    } as IndexedQuestion
  })

  const timeLeftMinutes = computed(() => Math.floor(timeLeft.value / 60_000))

  const formattedTimeLeft = computed(() => {
    const minutes = Math.floor(timeLeft.value / 60_000)
    const seconds = Math.floor((timeLeft.value % 60_000) / 1000)
    return `${minutes}m ${seconds.toString().padStart(2, '0')}s`
  })
  const correctCount = computed(() =>
    stats.value.correctAnswers.reduce((sum, val) => sum + (val > 0 ? 1 : 0), 0),
  )

  const percentCorrect = computed(() =>
    Math.round((correctCount.value / 20) * 100),
  )

  const examPassed = computed(() => correctCount.value >= 18)

  const formattedExamTime = computed(() => {
    const ms = typeof timeOverride.value === 'number' ? timeOverride.value : 0
    const minutes = Math.floor(ms / 60_000)
    const seconds = Math.floor((ms % 60_000) / 1000)
    return `${minutes}m ${seconds.toString().padStart(2, '0')}s`
  })
</script>
