<template>
  <QuestionCard
    :question="question"
    :answer-selected="answerSelected"
    :infinite="infinite"
    :exam-mode="false"
    :card-title="'Pytanie ' + (question.index + 1)"
    @answer="onAnswerSelected"
    @next="next"
  />
  <StatsCard 
    :stats="stats"
    :clickable="false"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import QuestionCard from './QuestionCard.vue';
import StatsCard from './StatsCard.vue';
import type IQuestionList from '../services/questionList';
import type { IndexedQuestion } from '../model/indexedQuestion';
import type StatsData from '../model/statsData';

const props = defineProps<{
  questionList: IQuestionList;
  infinite: boolean;
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
let answerSelected = ref<undefined|number>(undefined);
let stats = ref<StatsData>(props.questionList.getStats());

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
    if (props.infinite && question.value.is_last) {
      props.questionList.reset();
    }
    question.value = props.questionList.getNextQuestion() || errorQuestion;
    answerSelected.value = undefined;
  }
}
</script>