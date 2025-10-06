<template>
  <QuestionCard
    :answer-selected="answerSelected"
    :card-title="cardTitle"
    :exam-mode="false"
    :infinite="options.infinite"
    :question="question"
    :show-source="showSource"
    @answer="onAnswerSelected"
    @next="next"
  />
  <StatsCard
    :clickable="false"
    :stats="stats"
  />
</template>

<script setup lang="ts">
  import type { IndexedQuestion } from '../model/indexedQuestion'
  import type { LearnOptions } from '../model/learnOptions'
  import type StatsData from '../model/statsData'
  import type QuestionList from '../services/questionList'
  import { computed, ref } from 'vue'
  import QuestionCard from './QuestionCard.vue'
  import StatsCard from './StatsCard.vue'

  const props = defineProps<{
    questionList: QuestionList
    options: LearnOptions
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

  function onAnswerSelected (value: number) {
    if (value !== undefined) {
      props.questionList.answered(question.value.correct === value)
    }
    answerSelected.value = value
    stats.value = props.questionList.getStats()
    emit('answered', stats.value)
  }

  function next () {
    if (answerSelected.value !== undefined) {
      if (props.options.infinite && question.value.is_last) {
        props.questionList.reset()
      }
      question.value = props.questionList.getNextQuestion() || errorQuestion
      answerSelected.value = undefined
    }
  }

  const showSource = computed(() => {
    return props.options.showSource === 'always' || (props.options.showSource === 'after' && answerSelected.value !== undefined)
  })

  const cardTitle = computed(() => {
    return props.options.showQuestionNumber === 'always' || (props.options.showQuestionNumber === 'after' && answerSelected.value !== undefined)
      ? `Pytanie ${question.value.index + 1}`
      : 'Pytanie'
  })
</script>
