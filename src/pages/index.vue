<template>
  <v-container class="pt-8" max-width="900">
    <div>
      <v-img
        class="mb-4"
        height="120"
        src="@/assets/logo.png"
      />

      <div class="mb-6 text-center">
        <h4>Twoje Logo - Twój Nagłówek</h4>
        <h3>Aplikacja pomagająca w nauce do egzaminu WPA na pozwolenie na broń</h3>
      </div>
    </div>

    <v-row v-if="mode !== Mode.Menu" class="mb-6" justify="center">
      <v-btn color="secondary" @click="mode = Mode.Menu">
        Powrót do menu głównego
      </v-btn>
    </v-row>

    <main-menu
      v-if="mode===Mode.Menu"
      :can-load="canLoad"
      @exam="setExam"
      @learn="setLearn"
      @load="loadLearn"
    />
    <learn-view
      v-else-if="mode===Mode.Learn && questionList"
      :options="learnOptions"
      :question-list="questionList"
      @answered="stats = $event; persistentLearn.save()"
      @reset="mode=Mode.Menu"
    />
    <exam-view
      v-else-if="mode===Mode.Exam && questionList"
      :question-data="questionsData"
      :question-list="questionList"
      @answered="stats = $event"
      @reset="mode=Mode.Menu"
    />
  </v-container>
</template>

<script lang="ts" setup>
  import type { LearnOptions } from '../model/learnOptions'
  import type QuestionsData from '../model/questionData'

  import type StatsData from '../model/statsData'
  import type QuestionList from '../services/questionList'
  import { ref } from 'vue'

  import ExamView from '../components/ExamView.vue'
  import LearnView from '../components/LearnView.vue'
  import MainMenu from '../components/MainMenu.vue'
  import QuestionsDataJson from '../data/questions.json'
  import { createEmptyStatsData } from '../model/statsData'
  import OrderedQuestionList from '../services/orderedQuestionList'
  import PersistLearnState from '../services/persistLearnState'
  import RandomizedQuestionList from '../services/randomizedQuestionList'

  enum Mode {
  Menu, Learn, Exam,
}

  const mode = ref<Mode>(Mode.Menu)
  const canLoad = ref<boolean>(false)
  const questionsData = QuestionsDataJson as QuestionsData

  const learnOptions = ref<LearnOptions>({
    infinite: false,
    randomized: false,
    showQuestionNumber: 'never',
    showSource: 'never',
    questionRange: '',
  })
  const questionList = ref<QuestionList | null>(null)
  const stats = ref<StatsData>(createEmptyStatsData(200))
  const persistentLearn = new PersistLearnState(canLoad, questionsData, stats)

  function setLearn (args: LearnOptions) {
    learnOptions.value = args
    questionList.value = args.randomized ? new RandomizedQuestionList(questionsData, learnOptions.value) : new OrderedQuestionList(questionsData, learnOptions.value)
    stats.value = createEmptyStatsData(questionList.value.questionRange.length)
    mode.value = Mode.Learn
    persistentLearn.init(learnOptions.value, questionList.value.questionRange)
  }

  function setExam () {
    mode.value = Mode.Exam
    const examOptions: LearnOptions = {
      infinite: false,
      randomized: true,
      showQuestionNumber: 'never',
      showSource: 'never',
      questionRange: '', // all questions
    }
    questionList.value = new RandomizedQuestionList(questionsData, examOptions)
  }

  function loadLearn () {
    if (!canLoad.value) {
      console.warn('Nie można załadować stanu nauki, brak danych.')
      return
    }

    const loadedData = persistentLearn.load()
    learnOptions.value = loadedData.options
    questionList.value = loadedData.options.randomized ? new RandomizedQuestionList(questionsData, learnOptions.value, stats.value, loadedData.questionOrder) : new OrderedQuestionList(questionsData, learnOptions.value, stats.value, loadedData.questionOrder)
    mode.value = Mode.Learn
  }
</script>
