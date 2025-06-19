<template>
  <QuestionCard
    v-if="examFinished === false"
    :question="question"
    :answer-selected="answerSelected"
    :infinite="false"
    :exam-mode="true"
    :card-title="'Pytanie ' + (currentIndex + 1) + ' z 20'"
    @answer="onAnswerSelected"
    @next="next"
  />
  <QuestionCard v-else
    :question="indexedQuestion"
    :answer-selected="answers[currentIndex]"
    :infinite="false"
    :exam-mode="false"
    :card-title="'Pytanie ' + (questionIdx + 1)"
    @next="currentIndex = (currentIndex + 1) % 20"
  ></QuestionCard>
  <StatsCard v-if="examFinished" 
    :stats="stats"
    :clickable="true"
    :time-override="timeOverride"
    @row-click="currentIndex = $event"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import QuestionCard from './QuestionCard.vue';
import StatsCard from './StatsCard.vue';
import type QuestionList from '../services/questionList';
import type { IndexedQuestion } from '../model/indexedQuestion';
import type StatsData from '../model/statsData';
import type QuestionsData from '../model/questionData';

const props = defineProps<{
  questionList: QuestionList;
  questionData: QuestionsData;
}>();

const emit = defineEmits<{
  (e: 'answered', stats: StatsData): void;
  (e: 'reset'): void;
}>();

const errorQuestion = {
  question: 'Błąd wczytywania pytania',
  answers: [''],
  correct: 0,
  is_last: true,
  index: 0
} as IndexedQuestion;

let question = ref<IndexedQuestion>(props.questionList.getNextQuestion() || errorQuestion);
let answerSelected = ref<undefined | number>(undefined);
let stats = ref<StatsData>(props.questionList.getStats());
const answers = ref<number[]>(Array(20).fill(0));
let currentIndex = ref(0);
let examFinished = ref(false);
let timeOverride = ref<number | undefined>(undefined);

function onAnswerSelected(value: number) {
  if (value !== undefined) {
    props.questionList.answered(question.value.correct === value);
  }
  answerSelected.value = value;
  stats.value = props.questionList.getStats();
  emit('answered', stats.value);
}

function next() {
  if (answerSelected.value !== undefined) {
    answers.value[currentIndex.value] = answerSelected.value;
    currentIndex.value++;
    if (currentIndex.value >= 20) {
      examFinished.value = true;
      currentIndex.value = 0;
      timeOverride.value = Date.now() - stats.value.currentSessionStartTime;
      return;
    }
    question.value = props.questionList.getNextQuestion() || errorQuestion;
    answerSelected.value = undefined;
  }
}

const questionIdx = computed(() => {
  return stats.value.questionIdx[currentIndex.value];
});

const indexedQuestion = computed(() => {
  return {...props.questionData.questions[questionIdx.value], 
    index: questionIdx.value,
    is_last: false
  } as IndexedQuestion;
});
</script>