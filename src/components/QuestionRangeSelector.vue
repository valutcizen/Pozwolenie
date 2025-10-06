<template>
  <div>
    <div v-if="!editing">
      <span>{{ displayRange }}</span>
      <v-btn icon="mdi-pencil" size="small" @click="startEditing" />
    </div>
    <div v-else>
      <v-text-field
        v-model="editableRange"
        label="Zakresy pytań"
        @keydown.enter="finishEditing"
      />
      <v-chip-group column>
        <v-tooltip
          v-for="range in customRanges"
          :key="range.name"
          location="end"
          :text="range.tip"
        >
          <template #activator="{ props: tooltipProps }">
            <v-chip
              v-bind="tooltipProps"
              @click="appendRange(range.range)"
            >
              {{ range.name }}
            </v-chip>
          </template>
        </v-tooltip>
      </v-chip-group>
      <div class="text-center mt-4">
        <v-btn color="secondary" @click="finishEditing">Gotowe</v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import customRangesData from '@/data/custom-ranges.json'
  import QuestionRange from '@/model/questionRange'

  const props = defineProps<{
    modelValue: string
  }>()

  const emit = defineEmits(['update:modelValue'])

  const editing = ref(false)
  const editableRange = ref('')
  const customRanges = ref<{ name: string, tip: string, range: string }[]>([])

  const displayRange = computed(() => {
    if (!props.modelValue) {
      return 'Wszystkie pytania'
    }
    return QuestionRange.fromString(props.modelValue).toString()
  })

  function startEditing () {
    editableRange.value = props.modelValue
    editing.value = true
  }

  function finishEditing () {
    try {
      const range = QuestionRange.fromString(editableRange.value)
      emit('update:modelValue', range.toString())
    } catch (error) {
      console.error('Invalid range string:', error)
    // Optionally, show an error to the user
    }
    editing.value = false
  }

  function appendRange (range: string) {
    if (editableRange.value) {
      editableRange.value += `,${range}`
    } else {
      editableRange.value = range
    }
  }

  onMounted(() => {
    customRanges.value = customRangesData
  })
</script>
